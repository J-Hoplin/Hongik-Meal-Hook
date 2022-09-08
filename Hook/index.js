const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const Codes = require('../Codes')

module.exports.scraper = async() => {
    try{
        let html
        try{
            // Get menu html source code
            html = await axios.get("https://sj.hongik.ac.kr/site/food/food_menu.html",{responseType: "arraybuffer"})
        }catch(err){
            return Codes.requestError
        }
        // Prevent unicode type languages to be decoded
        const unicodeDecode = iconv.decode(html.data,"EUC-KR").toString()
        // $~ : cheerio object variable
        const $ = cheerio.load(unicodeDecode)
        // Get all of tr tags from tbody
        let $table = $('body > div.h2 > div > div > table > tbody').children('tr')
        // Parse information about department 'B' only
        // cheerio splice return array value
        let $tableSection = $table.splice(0,2)

        let mealofweek = new Array()
        // Meal table scrape and filtering
        $tableSection = $tableSection.map(x => {
            $(x).each((i,elm) => {
                // find all of td element in <tr>
                let $tdLists = $(elm).find('td')
                const meals = new Array()
                $tdLists.each((i,elm)=> {
                    /**
                     * Stringfy process progressing(use regex)
                     * 1. convert to element to text
                     * 2. replace '\t' to '' and split standard in \n
                     * 3. filter '' from string array
                     */
                    meals.push($(elm).text().replace(/\t/g,'').split('\n').filter(x => {
                        return x
                    }))
                })
                if(!meals.length){
                    throw new Error("Something went wrong while parsing datas")
                }
                mealofweek.push(meals)
            })
        })
        // Zip lunch and dinner meal information
        const [lunch, dinner] = mealofweek
        
        // end of process : build in object
        const returnVal = new Object()
        // zip lunch and dinner info and add to object
        lunch.map((v,i) => {
            returnVal[i + 1] = [v,dinner[i]]
        })
        /**
         * What u need to know
         * 
         * -> JS Day start with 0, which refers to sunday. 
         * -> Meal inforamtion only supports monday to saturday
         */
        return Codes.convention(Codes.success,returnVal)
    }catch(err){
        return Codes.parsingError
    }
}

