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
      const auditsArray = Object.values(reportObject.audits) as any[];
      const reprovadas = auditsArray.filter(a => a.score === 0);
      const aprovadas = auditsArray.filter(a => a.score === 1);
      const manuais = auditsArray.filter(a => a.score === null && a.scoreDisplayMode === 'manual');
      const naoAplicaveis = auditsArray.filter(a => a.scoreDisplayMode === 'notApplicable');
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
      throw new Error(`Erro ao executar o Lighthouse: ${error.message}`);
    }
  }
} 