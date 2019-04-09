// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
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
		
		let configPrefix: String = 'ng2ComponentGenerator';
		let _workspace = vscode.workspace;
		let defaultConfig: Config = FileHelper.getDefaultConfig();
		let userConfig: Config = <Config>_workspace.getConfiguration((configPrefix + '.config'));
		let config: Config;
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
