import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

// O pacote 'chromium' (npm) não é mais usado para o caminho
// import chromium from 'chromium'; // <--- REMOVIDO OU IGNORADO

@Injectable()
export class LighthouseService {
  /**
   * Verifica a saúde do serviço Lighthouse (se o Chromium está disponível)
   */
  async checkHealth() {
    const CHROME_EXECUTABLE_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || '/usr/bin/chromium';
    
    try {
      // Verificar se o Chromium existe
      const chromiumExists = fs.existsSync(CHROME_EXECUTABLE_PATH);
      
      if (!chromiumExists) {
        return {
          chromium: {
            available: false,
            path: CHROME_EXECUTABLE_PATH,
            error: 'Chromium não encontrado no caminho especificado',
          },
        };
      }

      // Tentar iniciar o Chrome brevemente para verificar se funciona
      try {
        const chromeLauncherModule = await import('chrome-launcher');
        const chromeLauncher = chromeLauncherModule.default || chromeLauncherModule;
        
        const chrome = await chromeLauncher.launch({
          chromePath: CHROME_EXECUTABLE_PATH,
          chromeFlags: [
            '--headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        });
        
        await chrome.kill();
        
        return {
          chromium: {
            available: true,
            path: CHROME_EXECUTABLE_PATH,
            version: 'OK',
          },
        };
      } catch (error) {
        return {
          chromium: {
            available: false,
            path: CHROME_EXECUTABLE_PATH,
            error: error.message || 'Erro ao iniciar Chromium',
          },
        };
      }
    } catch (error) {
      return {
        chromium: {
          available: false,
          path: CHROME_EXECUTABLE_PATH,
          error: error.message || 'Erro desconhecido',
        },
      };
    }
  }

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
    console.log(`[LighthouseService] Iniciando análise para: ${url}`);
    
    // Validação prévia rápida da URL (5 segundos máximo)
    console.log(`[LighthouseService] Validando acessibilidade da URL...`);
    const isAccessible = await this.validateUrlAccessibility(url);
    
    if (!isAccessible) {
      console.error(`[LighthouseService] URL não acessível: ${url}`);
      throw new Error(`A URL "${url}" não pôde ser acessada. Verifique se o endereço está correto e se o site está online.`);
    }
    console.log(`[LighthouseService] URL validada com sucesso`);
    
    // Caminho para o binário Chromium instalado via APK no Dockerfile
    const CHROME_EXECUTABLE_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || '/usr/bin/chromium';
    console.log(`[LighthouseService] Caminho do Chromium: ${CHROME_EXECUTABLE_PATH}`);
    
    // Verificar se o Chromium existe
    try {
      if (!fs.existsSync(CHROME_EXECUTABLE_PATH)) {
        console.error(`[LighthouseService] Chromium não encontrado no caminho: ${CHROME_EXECUTABLE_PATH}`);
        throw new Error(`Chromium não encontrado no caminho: ${CHROME_EXECUTABLE_PATH}`);
      }
      console.log(`[LighthouseService] Chromium encontrado no caminho especificado`);
    } catch (error) {
      console.error(`[LighthouseService] Erro ao verificar Chromium:`, error);
      throw new Error(`Chromium não encontrado no caminho: ${CHROME_EXECUTABLE_PATH}. Verifique a instalação do Chromium no container.`);
    }
    
    let chrome: any = null;

    try {
      console.log(`[LighthouseService] Iniciando Chrome Launcher...`);
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
      console.log(`[LighthouseService] Chrome iniciado com sucesso na porta: ${chrome.port}`);
    } catch (error) {
      const errorMessage = error.message || error.toString();
      console.error(`[LighthouseService] Erro ao iniciar Chrome:`, errorMessage);
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
      console.log(`[LighthouseService] Executando Lighthouse...`);
      // Importação dinâmica do Lighthouse (ES Module)
      const lighthouseModule = await import('lighthouse');
      const lighthouse = lighthouseModule.default;
      
      if (typeof lighthouse !== 'function') {
        throw new Error('Função lighthouse não encontrada no módulo');
      }
      
      // Timeout total de 45 segundos para a execução do Lighthouse (reduzido para evitar timeout do proxy)
      const lighthouseStartTime = Date.now();
      const lighthousePromise = lighthouse(url, options);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout: A análise do Lighthouse excedeu o tempo limite de 45 segundos'));
        }, 45000); // Reduzido para 45 segundos
      });
      
      const runnerResult = await Promise.race([lighthousePromise, timeoutPromise]) as any;
      const lighthouseDuration = Date.now() - lighthouseStartTime;
      console.log(`[LighthouseService] Lighthouse executado com sucesso em ${lighthouseDuration}ms`);
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