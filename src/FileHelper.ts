import * as fs from 'fs';
import * as path from 'path';

export class FileHelper {
    private static assetRootDir: string = path.join(__dirname, '../../assets');

    public static getDefaultConfig(): any {
        // let content = fs.readFile(this.assetRootDir + '/config/config.json', 'utf8').toString();

        let content = fs.readFile(this.assetRootDir + '/config/config.json', 'utf8', (error, data) => {
            // ...
            console.log(error);
            console.log(data);
        });

        return content;
    }
}