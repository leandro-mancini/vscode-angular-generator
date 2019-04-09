import * as vscode from 'vscode';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as changeCase from 'change-case';

import { GlobalConfig } from './config/global.interface';
import { Observable } from 'rxjs';
import { FileConfig } from './config/files.interface';
import { ModuleConfig } from './config/types/module-config.interface';
import { HTMLConfig } from './config/types/html-config.interface';
import { CSSConfig } from './config/types/css-config.interface';

export class FileHelper {
    private static createFile = <(file: string, data: string) => Observable<{}>>Observable.bindNodeCallback(fse.outputFile);
    private static assetRootDir: string = path.join(__dirname, '../assets');

    public static createComponent(componentDir: string, componentName: string, globalConfig: GlobalConfig, config: FileConfig): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/component.template';

        let componentContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{selector}/g, componentName)
            .replace(/{templateUrl}/g, `${componentName}.component.html`)
            .replace(/{styleUrls}/g, `${componentName}.component.${config.css.extension}`)
            .replace(/{className}/g, changeCase.pascalCase(componentName))
            .replace(/{quotes}/g, this.getQuotes(globalConfig));

        let filename = `${componentDir}/${componentName}.component.${config.component.extension}`;

        if (config.component.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    }

    public static createHtml(componentDir: string, componentName: string, config: HTMLConfig): Observable<string> {
        return Observable.of();
    }

    public static createCss(componentDir: string, componentName: string, config: CSSConfig): Observable<string> {
        return Observable.of();
    }

    public static createModule(componentDir: string, componentName: string, globalConfig: GlobalConfig, config: ModuleConfig): Observable<string> {
        return Observable.of();
    }

    public static createComponentDir(uri: any, componentName: string, globalConfig: GlobalConfig): string {
        let contextMenuSourcePath;

        if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
            contextMenuSourcePath = uri.fsPath;
        } else if (uri) {
            contextMenuSourcePath = path.dirname(uri.fsPath);
        } else {
            contextMenuSourcePath = vscode.workspace.rootPath;
        }

        let componentDir = `${contextMenuSourcePath}`;
        if(globalConfig.generateFolder) {
            componentDir = `${contextMenuSourcePath}/${componentName}`;
            fse.mkdirsSync(componentDir);
        }

        return componentDir;
    }

    public static getDefaultConfig(): any {
        let content = fs.readFileSync(this.assetRootDir + '/config/config.json').toString();

        return JSON.parse(content);
    }

    private static getQuotes(config: GlobalConfig) {
        return config.quotes === "double" ? '"' : '\'';
    }
}