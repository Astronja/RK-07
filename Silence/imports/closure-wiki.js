import slugify from 'slugify';

export class Closure {
    constructor () {
        // All valid pages of closure.wiki must include "/en" (Sept 13, 2025)
        this.baseurl = "https://api.closure.wiki/en/";
        // API V2 is recommended to be used, since V1 does not assure connection. (Oct 29, 2025)
        this.v2url = "https://api.closure.wiki/v2/en/";
        this.baseurl = this.v2url;
    }

    // public methods (for external use)

    /**
     * Gets data of operator by page name.
     * @param {string} name The targeted operator page name on closure.wiki.
     * @returns {Promise<object>} The data of the targeted operator.
     * @returns {Promise<boolean>} If the data of the targeted operator is not applicable, returns false.
     */
    async getOperator (name) {
        const url = this.baseurl + "operators/" + this.formatName(name);
        const response = await fetch(url);
        return this.responseHandler(response);
    }

    /**
     * Gets data of enemy by page name.
     * @param {string} name The targeted enemy page name on closure.wiki.
     * @returns {Promise<object>} The data of the targeted enemy.
     * @returns {Promise<boolean>} If the data of the targeted enemy is not applicable, returns false.
     */
    async getEnemy (name) {
        const url = this.baseurl + "enemies/" + this.formatName(name);
        const response = await fetch(url);
        return this.responseHandler(response);
    }

    /**
     * Gets data of operation by page name.
     * @param {string} name The targeted operation page name on closure.wiki.
     * @returns {Promise<object>} The data of the targeted operation.
     * @returns {Promise<boolean>} If the data of the targeted operation is not applicable, returns false.
     */
    async getOperation (name) {
        const url = this.baseurl + "operations/" + this.formatName(name);
        const response = await fetch(url);
        return this.responseHandler(response);
    }

    /**
     * Gets data of module by page name.
     * @param {string} name The targeted module page name on closure.wiki.
     * @returns {Promise<object>} The data of the targeted module.
     * @returns {Promise<boolean>} If the data of the targeted module is not applicable, returns false.
     */
    async getModule (name) {
        const url = this.baseurl + "modules/" + this.formatName(name);
        const response = await fetch(url);
        return this.responseHandler(response);
    }


    // utility methods (for internal use)

    /**
     * Checks connection to closure.wiki
     * @returns {Promise<boolean>} If the connection is okay, return true, vice versa.
     */
    async ok () {
        const response = await fetch("https://closure.wiki/en/home");
        return response.ok;
    }

    /**
     * Logs 404 message if the page is not found on closure.wiki.
     * @param {string} url The url that the request has made to.
     * @returns {string} Returns error message of 404.
     */
    pageNotFound (url) {
        console.log("Page not found, please check your spelling and check if data is ready");
        console.log("Access URL: ", url.replace("api.", ""));
        console.log("API URL: ", url);
        return `[ERROR] Page not found with request url: ${url}`;
    }
    
    /**
     * Checks if the response is ready for further data parsing.
     * @param {object} response The response data of the request.
     * @returns {Promise<object>} The json (in format of an object) data of the request.
     * @returns {Promise<string>} Returns error message if the response status is not 200.
     */
    async responseHandler (response) {
        if (response.status == 200) return await response.json();
        else if (response.status == 404) return this.pageNotFound(response.url);
        else return `[ERROR] Code ${response.status}: ${response.statusText}`;
    }

    /**
     * Checks if an operator's original data is ready for uploading use.
     * @param {object} data The data object containing the operator's information
     * @returns {boolean} If the operator data is completed
     */
    checkOperatorSourceCompleteness (data) {
        if (data
            && data.charProfile.storyTextAudio.length > 0
            && data.charDialog.length > 0
        ) return true;
    }

    /**
     * Formats the given string that functions as page name in closure.wiki.
     * @param {string} name The unformatted page name 
     * @returns {string} The formatted page name that is valid in closure.wiki
     */
    formatName (name) {
        switch (name) {
            case "Gummy":
                return "gum";
            case "Pozëmka":
                return "pozyomka";
            case "THRM-EX":
                return "thermal-ex";
        }
        //const result = name.toLowerCase().replaceAll(' ', '-');
        const result = slugify(name, { lower: true, strict: true });
        return result;
    }
}


// only for test use
async function start () {
    const closure = new Closure();
    if (await closure.ok()) { // If connection is okay
        //const response = await closure.getOperator("Ch'en the Holungday");
    } else console.log("Closure wiki connection failed."); // report if connection failure
}

//start();