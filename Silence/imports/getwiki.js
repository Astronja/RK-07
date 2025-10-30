export class GetWiki {
    constructor () {
        this.url = 'https://arknights.wiki.gg/api.php?';
    }

    async getWikiText (page_name) {
        const params = {
            action: 'parse',
            prop: 'wikitext',
            page: page_name,
            format: 'json'
        }
        const response = await (await fetch(this.url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            return response.parse.wikitext["*"];
        }
    }
    
    async listCategoryMembers (category_name) {
        if (!category_name.startsWith('Category:')) {
            category_name = 'Category:' + category_name;
        }
        const params = {
            action: 'query',
            list: 'categorymembers',
            cmtitle: category_name,
            cmlimit: 500,
            format: 'json'
        }
        const response = await (await fetch(this.url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            return response.query.categorymembers;
        }
    }
    
    async getImageURL (file_name) {
        
        let fn = file_name;
        if (!file_name.startsWith('File:')) {
            fn = 'File:' + file_name;
        }
        const params = {
            action: 'query',
            prop: 'imageinfo',
            titles: fn,
            iiprop: 'url',
            format: 'json'
        }
        const response = await (await fetch(this.url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            const pageid = Object.keys(response.query.pages)[0];
            return response.query.pages[pageid].imageinfo[0].url;
        }
    }

    async getInfo(page_name) {
        const params = {
            action: 'parse',
            page: page_name,
            format: 'json'
        }
        const response = await (await fetch(this.url + new URLSearchParams(params))).json();
        if (response.error) {
            return response.error.info;
        } else {
            const properties = response.parse.properties;
            let result = {};
            for (let item of properties) {
                if (item.name == 'description') {
                    result.desc = item['*'];
                } else if (item.name == 'page_image_free') {
                    result.thumbnail = await this.getImageURL(item['*']);
                }
            }
            console.log(result);
            return result;
        }
    }
}

// For testing use only
async function test () {
    const request = new GetWiki();
    //console.log(await request.getWikiText("Jessica"));
    //console.log(await request.listCategoryMembers("Untranslated"));
    //console.log(await request.getImageURL("Jessica_icon.png"));
    //console.log(await request.getInfo("Jessica"));
}