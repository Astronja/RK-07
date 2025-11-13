import source from '../source.js';
import { GetWiki } from '../imports/getwiki.js';

/**
 * This is to get operator ids
 * @deprecated 2025-11-13
 * @attention Although deprecated, this does not mean this code piece could not work intentionally.
 */
export class GetOpIds {
    constructor (interaction) {
        this.interaction = interaction;
    }

    async execute () {
        const fileList = await source.readOperatorDataDir();
        let object = {};
        for (let item of fileList) {
            const file = await source.readOperatorData(item);
            object[file.summary.name] = file.summary.id;
        }
        await source.writeCase(object);
    }
}


/**
 * This is to get the rangeids of operators
 * @deprecated 2025-11-13
 * @attention Although deprecated, this does not mean this code piece could not work intentionally.
 */
export class GetRangeIds {
    constructor (interaction) {
        this.interaction = interaction;
        this.results = {};
    }

    async execute () {
        const wiki = new GetWiki();
        const cm = await wiki.listCategoryMembers("Operator");
        const cncm = await wiki.listCategoryMembers("CN_Operator");
        for (let item of cm) await this.search(item.title);
        for (let item of cncm) await this.search(item.title);
        await source.writeCase("RangeID_Case", JSON.stringify(this.results, null, 2), ".json");
    }

    async read () {
        const data = await source.readCase("RangeID_Case", ".json");
        console.log(Object.keys(JSON.parse(data)));
    }

    async compareExisting () {
        const json = await source.readCase("RangeID_Case", ".json");
        const existing = Object.keys(range);
        let list = [];
        for (let id in JSON.parse(json)) {
            if (!existing.includes(id)) {
                list.push(id);
            }
        }
        console.log(list);
    }

    async search (name) {
        const data = await source.readOperatorData(name);
        this.pushRangeId(name, data);
    }

    pushRangeId (name, data) {
        const idList = this.getRangeId(data);
        for (let id of idList) {
            if (this.results[id] == undefined) {
                this.results[id] = [];
            }
            this.results[id].push(name);
        }
    }

    getRangeId (data) {
        let ids = [];
        for (let item of data.character.phases) {
            if (!ids.includes(item.rangeId)) {
                ids.push(item.rangeId);
            }
        }
        for (let key in data.charSkills) {
            for (let item of data.charSkills[key].levels) {
                if (!ids.includes(item.rangeId) && item.rangeId != undefined) {
                    ids.push(item.rangeId);
                }
            }
        }
        return ids;
    }
}

async function start () {
    const caseCommand = new Case();
    await caseCommand.execute();
}

//start();