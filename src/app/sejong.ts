import axios from "axios"
import * as cheerio from 'cheerio'
import * as iconv from 'iconv-lite'
import Scraper from "./scraper"
import { EndpointInject } from "../decorator"
import { NoDataFound } from "../error"
import { MealProcess } from "../types"


class SejongScrape extends Scraper {
    constructor() {
        super()
    }

    @EndpointInject("sejong")
    public async scrape(): Promise<MealProcess> {
        let html = (await axios.get(this.endpoint, { responseType: "arraybuffer" }))?.data

        //If response is nothing
        if (!html) {
            throw new NoDataFound()
        }

        // Prevent unicode type language to be decoded
        const unicodeDecode: string = iconv.decode(html, "EUC-KR").toString()
        // $ : cheerio object
        const $: cheerio.CheerioAPI = cheerio.load(unicodeDecode)
        // Get all of tr tags from tbody
        let $table = $('body > div.h2 > div > div > table > tbody').children('tr')
        // Parse information about department 'B' only
        // cheerio splice return array value

        const $tableSection: cheerio.Element[] = [$table[0], $table[3]]
        const mealofweek = new Array<string[][]>()
        // Meal table scrape and filtering
        $tableSection.map(x => {
            $(x).each((i, elm) => {
                // find all of td element in <tr>
                let $tdLists = $(elm).find('td')
                const meals: string[][] = new Array<string[]>()
                $tdLists.each((i, elm) => {
                    /**
                     * Stringfy process progressing(use regex)
                     * 1. convert to element to text
                     * 2. replace '\t' to '' and split standard in \n
                     * 3. filter '' from string array
                     */
                    meals.push($(elm).text().replace(/\t/g, '').split('\n').filter(x => {
                        return x
                    }))
                })
                if (!meals.length) {
                    throw new Error("Something went wrong while parsing datas")
                }
                mealofweek.push(meals)
            })
        })
        // Destruct lunch and dinner meal information
        const [lunch, dinner] = mealofweek
        /**
         * What u need to know
         * 
         * -> JS Day start with 0, which refers to sunday. 
         * -> Meal inforamtion only supports monday to saturday
         */

        // end of process : build in object
        const result: MealProcess = lunch.reduce((acc: MealProcess, cur: string[], idx: number, src: string[][]): MealProcess => {
            acc[idx + 1] = [cur, dinner[idx]]
            return acc
        }, {});
        return result
    }

}

export default SejongScrape