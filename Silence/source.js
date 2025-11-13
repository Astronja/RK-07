import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { InviteType } from 'discord.js';
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

    static async readOperatorData (name) {
        return JSON.parse(await fs.readFile(__dirname + "operators/closure/" + name.replaceAll(" ", "_").replaceAll(".json", "") + ".json", 'utf8'));
    }

    static async readOperatorWikitext (name) {
        return await fs.readFile(__dirname + "operators/wiki/" + name.replaceAll(" ", "_") + ".txt", 'utf8');
    }

    static async readOperatorDataDir () {
        return await fs.readdir(__dirname + "operators/closure");
    }

    static async readOperatorWikitextDir () {
        return await fs.readdir(__dirname + "operators/wikitext");
    }

    // The following fs-using methods serves for the GetOpIds class, check commands/case.js.
    /*
    static async writeCase (data) {
        await fs.writeFile(__dirname + "cases/ids.json", JSON.stringify(data, null, 2), 'utf8');
    }
    */

    // The following fs-using methods serves for the GetRangeIds class, check commands/case.js.
    /*
    static async writeCase (name, value, suffix) {
        const caseDataPath = __dirname + "cases/" + name.replaceAll(" ", "_") + suffix;
        await fs.writeFile(caseDataPath, value, 'utf8');
    }

    static async readCase (name, suffix) {
        const caseDataPath = __dirname + "cases/" + name.replaceAll(" ", "_") + suffix;
        return await fs.readFile(caseDataPath, 'utf8');
    }

    static async clearCaseDir (name, suffix) {
        if (name == "ALLCASES") {
            const caseDir = __dirname + "cases/";
            const files = await fs.readdir(caseDir);
            for (const file of files) {
                if (file.endsWith(suffix)) {
                    await fs.unlink(path.join(caseDir, file));
                }
            }
        } else {
            const caseDataPath = __dirname + "cases/" + name.replaceAll(" ", "_") + suffix;
            await fs.unlink(caseDataPath);
        }
    }
    */
}

async function start () {
    const data = await fetch("https://api.closure.wiki/v2/en/operators/mrnothing");
    const closure = await data.json();
    source.writeOperatorDataClosure("Mr. Nothing", closure);
}

//start();