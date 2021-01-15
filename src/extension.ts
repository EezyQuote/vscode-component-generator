'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { paramCase } from 'change-case';
import { Observable } from 'rxjs';
import { commands, ExtensionContext, window, workspace } from 'vscode';
import { FileHelper, logger } from './helpers';

const TEMPLATE_SUFFIX_SEPERATOR = '-';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const createComponent = (uri, suffix: string = '', isPage) => {
    // Display a dialog to the user
    let enterComponentNameDialog$ = Observable.from(
      window.showInputBox({
        prompt:
          'Please enter component name in camelCase then I can convert it to PascalCase or KebabCase for you.',
      })
    );

    enterComponentNameDialog$
      .concatMap((val) => {
        if (val.length === 0) {
          logger('error', 'Component name can not be empty!');
          throw new Error('Component name can not be empty!');
        }
        let componentName = paramCase(val);
        let componentDir = FileHelper.createComponentDir(
          uri,
          componentName,
          isPage
        );
        if (isPage) {
          return Observable.forkJoin(
            FileHelper.createNextPage(componentDir, componentName, suffix)
          );
        }

        return Observable.forkJoin(
          FileHelper.createComponent(componentDir, componentName, suffix),
          FileHelper.createIndexFile(componentDir, componentName),
          FileHelper.createCSS(componentDir, componentName)
        );
      })
      .concatMap((result) => {
        return Observable.from(result);
      })
      .filter((path) => path.length > 0)
      .first()
      .concatMap((filename) =>
        Observable.from(workspace.openTextDocument(filename))
      )
      .concatMap((textDocument) => {
        if (!textDocument) {
          logger('error', 'Could not open file!');
          throw new Error('Could not open file!');
        }
        return Observable.from(window.showTextDocument(textDocument));
      })
      .do((editor) => {
        if (!editor) {
          logger('error', 'Could not open file!');
          throw new Error('Could not open file!');
        }
      })
      .subscribe(
        (c) => logger('success', 'successfully created!'),
        (err) => logger('error', err.message)
      );
  };

  const componentArray = [
    {
      type: 'react-fc',
      commandId: 'extension.genReactTSFunctionalComponentFiles',
    },
    {
      type: 'next-fc',
      commandId: 'extension.genNextjsTSFunctionalComponentFiles',
    },
    {
      type: 'ssg-page',
      commandId: 'extension.genNextjsSSGPageFiles',
      page: true,
    },
    {
      type: 'ssr-page',
      commandId: 'extension.genNextjsSSRPageFiles',
      page: true,
    },
    {
      type: 'page',
      commandId: 'extension.genNextjsPageFiles',
      page: true,
    },
  ];

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  componentArray.forEach((c) => {
    const suffix = `${TEMPLATE_SUFFIX_SEPERATOR}${c.type}`;
    const isPage = c.page || false;
    const disposable = commands.registerCommand(c.commandId, (uri) =>
      createComponent(uri, suffix, isPage)
    );

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(disposable);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  // code whe
}
