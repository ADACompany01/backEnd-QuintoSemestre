import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';

// O pacote 'chromium' (npm) não é mais usado para o caminho
// import chromium from 'chromium'; // <--- REMOVIDO OU IGNORADO

@Injectable()
export class LighthouseService {
  /**
   * Valida se a URL está acessível antes de executar o Lighthouse
   * Retorna rapidamente (timeout de 5 segundos) para evitar espera desnecessária
   */
  private async validateUrlAccessibility(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const timeout = 5000; // 5 segundos
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const request = client.get(url, { timeout }, (response) => {
          // Qualquer resposta (mesmo erro 404) significa que o site está acessível
          resolve(response.statusCode !== undefined);
          request.destroy();
        });

        request.on('error', () => {
          resolve(false);
        });

        request.on('timeout', () => {
          request.destroy();
          resolve(false);
        });

        // Timeout de segurança
        setTimeout(() => {
          if (!request.destroyed) {
            request.destroy();
          }
          resolve(false);
        }, timeout);
      } catch (error) {
        // URL inválida ou outro erro
        resolve(false);
      }
    });
  }

  async runLighthouse(url: string) {
    // Validação prévia rápida da URL (5 segundos máximo)
    const isAccessible = await this.validateUrlAccessibility(url);
    
    if (!isAccessible) {
      throw new Error(`A URL "${url}" não pôde ser acessada. Verifique se o endereço está correto e se o site está online.`);
    }
    
    // Caminho para o binário Chromium instalado via APK no Dockerfile
    const CHROME_EXECUTABLE_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || '/usr/bin/chromium';
    let chrome: any = null;

    try {
      // Importação dinâmica do chrome-launcher (ES Module)
      const chromeLauncherModule = await import('chrome-launcher');
      const chromeLauncher = chromeLauncherModule.default || chromeLauncherModule;
      
      chrome = await chromeLauncher.launch({
        // CORREÇÃO CRÍTICA: Prioriza o caminho do Chromium instalado via APK no Alpine.
        // Usa CHROME_EXECUTABLE_PATH como fallback se a variável de ambiente CHROME_PATH não estiver definida.
        chromePath: CHROME_EXECUTABLE_PATH, 
        chromeFlags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--mute-audio',
          '--no-first-run',
          '--disable-default-apps',
          '--disable-software-rasterizer',
          '--disable-setuid-sandbox',
          '--single-process', // Importante para ambientes com poucos recursos
        ],
      });
    } catch (error) {
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes('ENOENT') || errorMessage.includes('not found')) {
        throw new Error(`Chromium não encontrado no caminho: ${CHROME_EXECUTABLE_PATH}. Verifique a instalação do Chromium no container.`);
      }
      throw new Error(`Erro ao iniciar o Chrome: ${errorMessage}`);
    }

    const options: any = {
      logLevel: 'error', // Reduzir logs para apenas erros
      output: 'json',
      port: chrome.port,
      onlyCategories: ['accessibility'],
      locale: 'pt-BR',
      maxWaitForLoad: 15000, // Aumentado para 15 segundos para sites mais lentos
      maxWaitForFcp: 10000, // Timeout para First Contentful Paint aumentado
      throttling: {
        rttMs: 40, // Reduzir latência simulada
        throughputKbps: 10240, // Aumentar throughput
        cpuSlowdownMultiplier: 1, // Sem desaceleração de CPU
      },
      skipAudits: [
        // Pular auditorias que não são essenciais para acessibilidade
        'uses-http2',
        'uses-long-cache-ttl',
        'total-byte-weight',
        'dom-size',
      ],
    };

    try {
      // Importação dinâmica do Lighthouse (ES Module)
      const lighthouseModule = await import('lighthouse');
      const lighthouse = lighthouseModule.default;
      
      if (typeof lighthouse !== 'function') {
        throw new Error('Função lighthouse não encontrada no módulo');
      }
      
      // Timeout total de 60 segundos para a execução do Lighthouse
      const lighthousePromise = lighthouse(url, options);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout: A análise do Lighthouse excedeu o tempo limite de 60 segundos'));
        }, 60000);
      });
      
      const runnerResult = await Promise.race([lighthousePromise, timeoutPromise]) as any;
      const reportJson = Array.isArray(runnerResult.report) 
        ? runnerResult.report[0] 
        : runnerResult.report;
      const reportObject = JSON.parse(reportJson as string);
      await chrome.kill();
      
      // Verificar detalhes da navegação (sem logs excessivos)
      const finalUrl = reportObject.finalDisplayedUrl || reportObject.finalUrl || reportObject.requestedUrl;
      const runtimeError = reportObject.runtimeError;
      
      // Se há erro de runtime ou URL final é chrome-error, significa que não conseguiu acessar
      if (runtimeError || 
          (finalUrl && finalUrl.includes('chrome-error://')) ||
          (finalUrl && finalUrl.includes('data:text/html')) ||
          reportObject.categories.accessibility.score === null) {
        throw new Error(`A URL "${url}" não pôde ser acessada. Verifique se o endereço está correto e se o site está online.`);
      }
      
      const auditsArray = Object.values(reportObject.audits) as any[];
      const reprovadas = auditsArray.filter(a => a.score === 0);
      const aprovadas = auditsArray.filter(a => a.score === 1);
      const manuais = auditsArray.filter(a => a.score === null && a.scoreDisplayMode === 'manual');
      const naoAplicaveis = auditsArray.filter(a => a.scoreDisplayMode === 'notApplicable');
      
      // Verificar se retornou dados válidos (se tudo está vazio, algo deu errado)
      if (reprovadas.length === 0 && aprovadas.length === 0 && manuais.length === 0) {
        throw new Error(`A URL "${url}" não pôde ser acessada. Verifique se o endereço está correto e se o site está online.`);
      }
      
      return {
        notaAcessibilidade: reportObject.categories.accessibility.score * 100,
        reprovadas,
        aprovadas,
        manuais,
        naoAplicaveis
      };
    } catch (error) {
      // Garantir que o Chrome seja fechado mesmo em caso de erro
      if (chrome) {
        try {
          await chrome.kill();
        } catch (killError) {
          // Ignorar erros ao matar o Chrome
        }
      }
      
      // Identificar tipo de erro
      const errorMessage = error.message || error.toString();
      
      // Erros de timeout
      if (errorMessage.includes('Timeout') || errorMessage.includes('timeout')) {
        throw new Error(`A análise do site demorou muito tempo. Tente novamente ou verifique se o site está acessível.`);
      }
      
      // Erros comuns de URL inacessível
      if (errorMessage.includes('ENOTFOUND') || 
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('net::ERR_NAME_NOT_RESOLVED') ||
          errorMessage.includes('ERR_CONNECTION')) {
        throw new Error(`A URL "${url}" não pôde ser acessada. Verifique se o endereço está correto e se o site está online.`);
      }
      
      // Erros relacionados ao Chrome/Chromium
      if (errorMessage.includes('ENOENT') || 
          errorMessage.includes('not found') ||
          errorMessage.includes('No usable sandbox') ||
          errorMessage.includes('Chromium')) {
        throw new Error(`Erro na configuração do navegador. Entre em contato com o suporte técnico.`);
      }
      
      // Outros erros - mensagem genérica sem mencionar Lighthouse
      throw new Error(`Não foi possível analisar o site. Verifique se a URL está correta e tente novamente.`);
    }
  }
}