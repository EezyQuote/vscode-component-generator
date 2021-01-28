import { workspace, Uri, window } from 'vscode';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import { pascalCase, paramCase } from 'change-case';
import { Observable } from 'rxjs';
import {
  IndexInterface,
  CSSInterface,
  ComponentInterface,
} from './interfaces/types';
import GlobalInterface from './interfaces/global.interface';

// import { Config as ConfigInterface } from './config.interface';

export class FileHelper {
  private static assetRootDir: string = path.join(__dirname, '../../assets');

  private static createFile = <(file: string, data: string) => Observable<{}>>(
    Observable.bindNodeCallback(fse.outputFile)
  );

  public static getContextMenuSourcePath(uri: any): string {
    let contextMenuSourcePath;

    if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
      contextMenuSourcePath = uri.fsPath;
    } else if (uri) {
      contextMenuSourcePath = path.dirname(uri.fsPath);
    } else {
      contextMenuSourcePath = workspace.rootPath;
    }

    return contextMenuSourcePath;
  }

  public static createComponentDir(
    uri: any,
    componentName: string,
    skipFolder: boolean = false
  ): string {
    const contextMenuSourcePath = this.getContextMenuSourcePath(uri);
    let componentDir = `${contextMenuSourcePath}`;

    if (!skipFolder) {
      const globalConfig: GlobalInterface = getConfig().get('global');
      if (globalConfig.generateFolder) {
        componentDir = `${contextMenuSourcePath}/${this.setName(
          componentName,
          globalConfig.case
        )}`;
        fse.mkdirsSync(componentDir);
      }
    }

    return componentDir;
  }

  public static createNextPage(
    componentDir: string,
    nextjsPageName: string,
    suffix: string = ''
  ): Observable<string> {
    const globalConfig: GlobalInterface = getConfig().get('global');
    const pageConfig: IndexInterface = getConfig().get('nextPage');

    let templateFileName =
      this.assetRootDir + `/templates/next${suffix}.template`;
    if (pageConfig.template) {
      templateFileName = this.resolveWorkspaceRoot(pageConfig.template);
    }

    const pageName = this.setName(nextjsPageName);
    const pageKebabName = this.setName(nextjsPageName, 'param');

    let pageContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace(/{pageName}/g, pageName)
      .replace(/{pageKebabName}/g, pageKebabName)
      .replace(/{quotes}/g, this.getQuotes(globalConfig));

    let filename = `${componentDir}/${pageKebabName}.${pageConfig.extension}`;

    return this.createFile(filename, pageContent).map(() => filename);
  }

  public static createComponent(
    componentDir: string,
    componentName: string,
    suffix: string = '-container'
  ): Observable<string> {
    const componentConfig: ComponentInterface = getConfig().get('mainFile');
    if (componentConfig.create) {
      const globalConfig: GlobalInterface = getConfig().get('global');
      let templateFileName =
        this.assetRootDir + `/templates/component${suffix}.template`;
      if (componentConfig.template) {
        templateFileName = this.resolveWorkspaceRoot(componentConfig.template);
      }

      const compName = this.setName(componentName);
      const fileName = this.setName(componentName, globalConfig.case);
      const pageKebabName = this.setName(componentName, 'param');

      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName)
        .replace(/{pageKebabName}/g, pageKebabName)
        .replace(/{quotes}/g, this.getQuotes(globalConfig));

      // console.log('content', componentContent);

      let path = `${componentDir}/${fileName}.${componentConfig.extension}`;

      return this.createFile(path, componentContent).map(() => path);
    } else {
      return Observable.of('');
    }
  }

  public static createIndexFile(
    componentDir: string,
    componentName: string
  ): Observable<string> {
    const indexConfig: IndexInterface = getConfig().get('indexFile');
    if (indexConfig.create) {
      const globalConfig: GlobalInterface = getConfig().get('global');

      let templateFileName = this.assetRootDir + '/templates/index.template';
      if (indexConfig.template) {
        templateFileName = this.resolveWorkspaceRoot(indexConfig.template);
      }

      const compName = this.setName(componentName, globalConfig.case);

      let indexContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName)
        .replace(/{quotes}/g, this.getQuotes(globalConfig));

      let path = `${componentDir}/index.${indexConfig.extension}`;

      return this.createFile(path, indexContent).map((result) => path);
    } else {
      return Observable.of('');
    }
  }

  public static createCSS(
    componentDir: string,
    componentName: string
  ): Observable<string> {
    const globalConfig: GlobalInterface = getConfig().get('global');
    const styleConfig: CSSInterface = getConfig().get('styleFile');
    const styleTemplate = getStyleSheetExtTemplate();
    let templateFileName = `${this.assetRootDir}/templates/${styleTemplate.template}`;
    // if (styleConfig.template) {
    //     templateFileName = this.resolveWorkspaceRoot(styleConfig.template);
    // }

    const compName = this.setName(componentName);
    const fileName = this.setName(componentName, globalConfig.case);

    let cssContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace(/{componentName}/g, compName)
      .replace(/{quotes}/g, this.getQuotes(globalConfig));

    let path = `${componentDir}/${fileName}${styleConfig.suffix}.${styleTemplate.ext}`;
    if (styleConfig.create) {
      return this.createFile(path, cssContent).map((result) => path);
    } else {
      return Observable.of('');
    }
  }

  public static resolveWorkspaceRoot = (path: string): string =>
    path.replace('${workspaceFolder}', workspace.rootPath);

  private static getQuotes = (config: GlobalInterface) =>
    config.quotes === 'double' ? '"' : "'";

  public static setName = (
    name: string,
    type: 'pascal' | 'param' = 'pascal'
  ) => {
    switch (type) {
      case 'param':
        return paramCase(name);
      default:
        return pascalCase(name);
    }
  };
}

export function logger(
  type: 'success' | 'warning' | 'error',
  msg: string = ''
) {
  switch (type) {
    case 'success':
      return window.setStatusBarMessage(`Success: ${msg}`, 5000);
    // return window.showInformationMessage(`Success: ${msg}`);
    case 'warning':
      return window.showWarningMessage(`Warning: ${msg}`);
    case 'error':
      return window.showErrorMessage(`Failed: ${msg}`);
  }
}

export default function getConfig(uri?: Uri) {
  return workspace.getConfiguration('ComponentGenerator', uri) as any;
}

export function getStyleSheetExtTemplate() {
  const configuredView = getConfig().get('styleFile.type');
  let styleTemplate = {
    ext: 'module.css',
    template: 'css.template',
  };

  switch (configuredView) {
    case 'css (.css)':
      styleTemplate.ext = 'css';
      break;
    case 'scss (.scss)':
      styleTemplate.ext = 'scss';
      break;
    case 'less (.less)':
      styleTemplate.ext = 'less';
      break;
    case 'module.scss (.scss)':
      styleTemplate.ext = 'module.sass';
      break;
    case 'module.less (.less)':
      styleTemplate.ext = 'module.less';
      break;
  }

  return styleTemplate;
}
