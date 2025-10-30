import { Ping } from './commands/ping.js';
import { Test } from './commands/test.js';
import { Update } from './commands/update.js';

export class Command {
    constructor() {
        this.name = 'Prototype';
        this.version = '1.0.0';
    }

    static registerCommand() {
        return [
            {
                name: "update",
                description: "Start an update session!",
                options: [
                    {
                        type: 3, // STRING
                        name: "type",
                        description: "Select update type",
                        required: true,
                        choices: [
                            {
                                name: "Game Data",
                                value: "gamedata"
                            },
                            {
                                name: "Wiki Data",
                                value: "wikidata"
                            },
                            {
                                name: "All Data",
                                value: "alldata"
                            }
                        ]
                    },
                    {
                        type: 3,
                        name: "operator",
                        description: "Enter the update target, type \"All\" if all, \"CN\" if all CN.",
                        required: true
                    }
                ]
            },
            {
                name: "test",
                description: "Test out Silence!"
            }
        ]
    }

    async executeCommand (commandName) {
        switch (commandName) {
            case 'ping':
                const pingCommand = new Ping();
                return pingCommand.execute();
            default:
                return `Unknown command: ${commandName}`;
        }
    } 

    async slashCommandHandler (interaction) {
        switch (interaction.commandName) {
            case "update":
                const updateCommand = new Update(interaction);
                await updateCommand.execute();
                break;
            case 'test':
                const testCommand = new Test(interaction);
                await testCommand.execute();
        }
    }
}