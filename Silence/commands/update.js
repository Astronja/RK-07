import { Closure } from '../imports/closure-wiki.js';
import { GetWiki } from '../imports/getwiki.js';
import source from '../source.js';

export class Update {
    constructor (interaction) {
        this.interaction = interaction;
        this.type = interaction.options.getString("type");
        this.target = interaction.options.getString("operator");
        this.resultLogs = "";
    }

    async execute () {
        await this.updateProcess(this.interaction);
    }

    async getTasks () {
        const wiki = new GetWiki();
        let list = [];
        if (this.target == "All") {
            const cm = await wiki.listCategoryMembers("Operator");
            for (let item of cm) {
                list.push({
                    platform: this.type,
                    pagename: item.title
                });
            }
        } else if (this.target == "CN") {
            const cm = await wiki.listCategoryMembers("CN_Operator");
            for (let item of cm) {
                list.push({
                    platform: this.type,
                    pagename: item.title
                });
            }
        } else {
            list.push({
                platform: this.type,
                pagename: this.target
            });
        }
        return list;
    }

    async updateLogs (message) {
        if (this.ephemeral) {
            await this.interaction.editReply(message);
        } else {
            await this.logmessage.edit(message);
        }
    }

    async updateProcess (interaction) {
        try {
            const startTime = Date.now();
            const elapse = `Elapse: <t:${Math.floor(startTime / 1000)}:R>\n`;
            let list = await this.getTasks();
            if (list.length > 20) {
                this.ephemeral = false;
                await interaction.editReply("Processing a large number of items, creating a new message for logs...");
                this.logmessage = await interaction.channel.send("``New logs session.``");
            } else {
                this.ephemeral = true;
            }
            await this.updateLogs({
                content: elapse,
                files: [await this.formatLog("Execution started.")]
            });
            let success = 0;
            for (var i = 0; i < list.length; i++) {
                await delay(35000);
                const log = `(${i + 1}) ${await this.toIssue(list[i])}`;
                if (!log.includes("ERROR")) success++;
                const progress = `(${i + 1}/${list.length})`;
                const percentage = `${Math.round((i + 1)/list.length*10000)/100}%`;
                const barLength = 40;
                const bar = "``[" + "#".repeat(Math.round((i + 1)/list.length*barLength)) + ".".repeat(barLength - Math.round((i + 1)/list.length*barLength)) + "]``";
                await this.updateLogs({
                    content: elapse + progress + "\n" + percentage + "\n" + bar,
                    files: [await this.formatLog(log)]
                });
            }
            const endTime = Date.now();
            await delay(5000);
            await this.updateLogs({ files: [await this.formatLog(`(${success}/${list.length}) item(s) successfully issued.`)] });
            await this.updateLogs({ files: [await this.formatLog(`Execution completed, process time: ${this.formatTimespanString(startTime, endTime)}`)] });
        } catch (error) {
            console.error(error);
            await this.updateLogs({ files: [await this.formatLog("Execution failed. (Code: -1 Unexpected error)")] });
        }
        await source.unlinkUpdateLog();
    }

    async toIssue (task) {
        try {
            if (task.platform == "alldata") {
                const closureResponse = await this.handleClosureTask(task.pagename);
                const wikiResponse = await this.handleWikiTask(task.pagename);
                return closureResponse + "\n" + wikiResponse;
            } else if (task.platform == "gamedata") {
                return await this.handleClosureTask(task.pagename);
            } else {
                return await this.handleWikiTask(task.pagename);
            }
        } catch (error) {
            console.log(error);
            return `[ERROR] ${error}`;
        }
    }

    async handleClosureTask (name) {
        try {
            const closure = new Closure();
            const result = await closure.getOperator(name);
            if (typeof(result) == "string") return result;
            await source.writeOperatorDataClosure(name, result);
            return `Game data of operator ${name} is updated.`;
        } catch (err) {
            return `[ERROR] ${err}`;
        }
    }

    async handleWikiTask (name) {
        try {
            const wiki = new GetWiki();
            const result = await wiki.getWikiText(name);
            if (!result.includes("{{Operator tab}}")) return `[ERROR] Wikitext of operator ${name} is not found or formatted incorrectly.`;
            await source.writeOperatorWikitext(name, result);
            return `Wikitext of operator ${name} is updated.`;
        } catch (err) {
            return `[ERROR] ${err}`;
        }
    }

    getTimeString () {
        return (new Date()).toTimeString().split(" ")[0];
    }

    formatTimespanString (start, end) {
        let timespan = Math.round((end - start) / 1000);
        return `${Math.floor(timespan/3600)}h${Math.floor((timespan%3600)/60)}m${timespan % 60}s`;
    }

    async formatLog (msg) {
        const message = this.resultLogs + `[Silence][${this.getTimeString()}] ${msg}`; 
        this.resultLogs+=`[Silence][${this.getTimeString()}] ${msg}\n`;
        return await source.bufferUpdateLog(message);
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function start () {
    const wiki = new GetWiki();
    const cm = await wiki.listCategoryMembers("Operator");
    console.log(cm);
}

//start();