const Codes = require('../../Codes')
const embedConfig = require('../embed.json')

const addZeroUnderTen = (number) => {
    try{
        return number < 10 ? "0" + number : number
    }catch(err){
        return undefined
    }
}

const hexColorCodeDecimal = (hex) => {
    return parseInt(hex,16)
}

module.exports.embedBuilder = (res) => {
    const now = new Date()
    const todayStringfy = `${now.getFullYear()}년 ${addZeroUnderTen(now.getMonth() + 1)}월 ${addZeroUnderTen(now.getDate())}일 학식정보`
    // For debuging
    // res = Codes.weekendMsg
    
    // If weekend
    if(res.status === Codes.weekend){
        return {
            "embeds" : [
                {
                    "title" : todayStringfy,
                    "description" : `[B동 학식 정보입니다](https://sj.hongik.ac.kr/site/food/food_menu.html) - ${res.msg}`,
                    "color" : hexColorCodeDecimal(embedConfig.colors.warning),
                    "footer" : {
                        "text" : embedConfig.footer.text,
                        "icon_url" : embedConfig.footer.url
                    }
                }
            ],
        }
    }else{
        let [lunch, dinner] = res.msg[now.getDay()]
        return {
            "embeds" : [
                {
                    "title" : todayStringfy,
                    "description" : "[B동 학식 정보입니다](https://sj.hongik.ac.kr/site/food/food_menu.html)",
                    "color" : hexColorCodeDecimal(embedConfig.colors.normal),
                    "fields" : [
                        {
                            "name" : "**[ 중식 ]**",
                            "value" : (() => {
                                return lunch.length <= 0
                                ? Codes.notReady
                                : lunch.join(', ')
                            })()
                        },
                        {
                            "name" : "**[ 석식 ]**",
                            "value" : (() => {
                                return dinner.length <=0
                                ? Codes.notReady
                                : dinner.join(', ')
                            })()
                        }
                    ],
                    "footer" : {
                        "text" : embedConfig.footer.text,
                        "icon_url" : embedConfig.footer.url
                    }
                }
            ]
        }
    }
}

module.exports.errorEmbedBuilder = (res) => {
    return {
        "embeds" : [
            {
                "title" : embedConfig.error.title,
                "color" : hexColorCodeDecimal(embedConfig.colors.error),
                "fields": [
                    {
                        "name" : embedConfig.error['field-title'],
                        "value" : res
                    }
                ],
                "footer" : {
                    "text" : embedConfig.footer.text,
                    "icon_url" : embedConfig.footer.url
                }
            }
        ]
    }
}