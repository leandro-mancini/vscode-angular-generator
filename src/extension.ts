// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as changeCase from 'change-case';
import { Observable } from 'rxjs';

import { Config } from './config.interface';
import { FileHelper } from './FileHelper';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', (uri) => {
		// The code you place here will be executed every time your command is executed
		
		let configPrefix: string = 'apolloGenerator';
		let _workspace = vscode.workspace;
		let defaultConfig: Config = FileHelper.getDefaultConfig();
		let userConfig: Config = <Config>_workspace.getConfiguration((configPrefix + '.config'));
		let _config: Config;

		if (userConfig) {
            _config = _.assign(_config, defaultConfig, userConfig) as Config;
		}

		let inputBox = Observable.from(
            vscode.window.showInputBox(
                {
					prompt: 'Por favor insira o nome do component'
				}
			)
		);

		inputBox
			.concatMap(val => {
				if (val === undefined || val.length === 0) {
					vscode.window.showErrorMessage('O nome do componente não pode está vazio.');
				}

				let componentName = changeCase.paramCase(val);
				let componentDir = FileHelper.createComponentDir(uri, componentName, _config.global);

				return Observable.forkJoin(
					FileHelper.createComponent(componentDir, componentName, _config.global, _config.files),
					FileHelper.createHtml(componentDir, componentName, _config.files.html),
					FileHelper.createCss(componentDir, componentName, _config.files.css),
					FileHelper.createModule(componentDir, componentName, _config.global, _config.files.module)
				);
			})
			.do(editor => {
				console.log('editor', editor);
			})
			.subscribe(() => {
				vscode.window.setStatusBarMessage('Componente creado com sucesso!', 5000);
			}, err => vscode.window.showErrorMessage(err.message));

		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
