import { Injectable } from '@nestjs/common';
const lighthouseModule = require('lighthouse');
import * as chromeLauncher from 'chrome-launcher';
import chromium from 'chromium';

@Injectable()
export class LighthouseService {
  async runLighthouse(url: string) {
    const chrome = await chromeLauncher.launch({
      chromePath: process.env.CHROME_PATH || chromium.path,
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    });

    const options = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['accessibility'],
      locale: 'pt-BR',
    };

    try {
      console.log('Chaves do objeto lighthouse:', Object.keys(lighthouseModule));
      let runnerResult;
      if (typeof lighthouseModule === 'function') {
        runnerResult = await lighthouseModule(url, options);
      } else if (typeof lighthouseModule.default === 'function') {
        runnerResult = await lighthouseModule.default(url, options);
      } else {
        const lighthouseFn = Object.values(lighthouseModule).find(
          (val) => typeof val === 'function'
        );
        if (lighthouseFn) {
          runnerResult = await lighthouseFn(url, options);
        } else {
          throw new Error('Não foi possível encontrar a função lighthouse');
        }
      }
      const reportJson = runnerResult.report;
      const reportObject = JSON.parse(reportJson);
      await chrome.kill();
      console.log('Categorias disponíveis:', Object.keys(reportObject.categories));
      
      // DEBUG: Verificar detalhes da navegação
      const finalUrl = reportObject.finalDisplayedUrl || reportObject.finalUrl || reportObject.requestedUrl;
      console.log('URL solicitada:', url);
      console.log('URL final:', finalUrl);
      console.log('Score acessibilidade:', reportObject.categories.accessibility.score);
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
      await chrome.kill();
      console.error('Erro completo:', error);
      
      // Identificar tipo de erro
      const errorMessage = error.message || error.toString();
      
      // Erros comuns de URL inacessível
      if (errorMessage.includes('ENOTFOUND') || 
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('net::ERR_NAME_NOT_RESOLVED') ||
          errorMessage.includes('No usable sandbox') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('Navigation timeout') ||
          errorMessage.includes('ERR_CONNECTION')) {
        throw new Error(`A URL "${url}" não pôde ser acessada. Verifique se o endereço está correto e se o site está online.`);
      }
      
      // Outros erros do Lighthouse
      throw new Error(`Erro ao executar o Lighthouse: ${error.message}`);
    }
  }
} 