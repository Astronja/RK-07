export class Test {
    constructor (interaction) {
        this.interaction = interaction;
    }

    async execute () {
        this.interaction.editReply({ content: "reply w/ attachments", files: ['./config.json']});
    }
}