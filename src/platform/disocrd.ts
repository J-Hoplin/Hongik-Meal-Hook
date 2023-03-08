import { SejongScrape } from "../app";
import axios, { Axios, AxiosResponse } from "axios";
import { colors, error, footer } from './embedconfig.json'
import { CampusScraperMap, MealProcess, HookType } from "../types";
import { Endpoints, Message } from "../constant";
import Scraper from "../app/scraper";
import logger from "../log";
import { hook } from '../../app-config.json'

/**
 * Supported Campus mapping object
 */
const scrapers: CampusScraperMap = {
    sejong: new SejongScrape()
}

const addZeroUnderTen = (number: number): string | number => {
    return number < 10 ? "0" + number : number
}

const hexColorCodeDecimal = (hex: string) => {
    return parseInt(hex, 16)
}

const buildEmbedJSON = async (weekData: MealProcess): Promise<object> => {
    const now = new Date();
    const todayStringfy = `${now.getFullYear()}년 ${addZeroUnderTen(now.getMonth() + 1)}월 ${addZeroUnderTen(now.getDate())}일 학식정보`
    const day = now.getDay();

    // Weekend
    if (day === 0 || day === 6) {
        return {
            "embeds": [
                {
                    "title": todayStringfy,
                    "description": `[B동 학식 정보입니다](https://sj.hongik.ac.kr/site/food/food_menu.html) - ${Message.closeOnWeekend}`,
                    "color": hexColorCodeDecimal(colors.warning),
                    "footer": {
                        "text": footer.text,
                        "icon_url": footer.url
                    }
                }
            ],
        }
    }
    // Weekday
    else {
        // Get today's meal information
        let [lunch, dinner] = weekData[day];
        return {
            "embeds": [
                {
                    "title": todayStringfy,
                    "description": "[B동 학식 정보입니다](https://sj.hongik.ac.kr/site/food/food_menu.html)",
                    "color": hexColorCodeDecimal(colors.normal),
                    "fields": [
                        {
                            "name": "**[ 중식 ]**",
                            "value": (() => {
                                return lunch.length <= 0
                                    ? Message.notReady
                                    : lunch.join(', ')
                            })()
                        },
                        {
                            "name": "**[ 석식 ]**",
                            "value": (() => {
                                return dinner.length <= 0
                                    ? Message.notReady
                                    : dinner.join(', ')
                            })()
                        }
                    ],
                    "footer": {
                        "text": footer.text,
                        "icon_url": footer.url
                    }
                }
            ]
        }
    }
}


const task = async (): Promise<void> => {
    try {
        const taskObjects = hook.map(async x => {
            try {
                const {
                    campus,
                    hook
                } = x as HookType
                if (!Object.keys(scrapers).includes(campus)) {
                    return false
                }
                const instance = scrapers[campus]
                // nullish
                const data = await instance!.scrape()
                const embed = await buildEmbedJSON(data)
                logger.info(`Process Complete : ${hook}`)
                return axios.post(hook, embed)
            } catch (err) {
                console.error(err)
                logger.error(err)
                return false
            }
        })
        await Promise.all(taskObjects)
    } catch (err) {
        console.error(err)
        logger.error(err)
    }
}

export default task
