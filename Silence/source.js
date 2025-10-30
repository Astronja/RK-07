import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename) + "/sources/";

export default class source {
    static async writeOperatorDataClosure (name, data) {
        await fs.writeFile(__dirname + "operators/closure/" + name.replaceAll(" ", "_") + ".json", JSON.stringify(data, null, 2), 'utf8');
    }

    static async writeOperatorWikitext (name, wikitext) {
        await fs.writeFile(__dirname + "operators/wiki/" + name.replaceAll(" ", "_") + ".txt", wikitext, 'utf8');
    }

    static async bufferUpdateLog (logs) {
        await fs.writeFile(__dirname + "buffers/update.txt", logs, "utf8");
        return __dirname + "buffers/update.txt";
    }

    static async unlinkUpdateLog () {
        await fs.unlink(__dirname + "buffers/update.txt");
    }
}