const Codes = require('../../Codes')
const embedConfig = require('../embed.json')

const addZeroUnderTen = (number) => {
    try{
        return number < 10 ? "0" + number : number
    }catch(err){
        return undefined
    }
}

module.exports.embedBuilder = (res) => {
    const now = new Date()
    const todayStringfy = `${now.getFullYear()}년 ${addZeroUnderTen(now.getMonth() + 1)}월 ${addZeroUnderTen(now.getDate())}일 학식정보`

    res = Codes.weekendMsg
    if(res.status === Codes.weekend){
        return {
            "attachments" : [
                {
                    "title" : todayStringfy,
                    "color" : `#${embedConfig.colors.warning}`,
                    "text" : `B동 학식 정보입니다 : https://sj.hongik.ac.kr/site/food/food_menu.html - ${res.msg}`,
                    "footer" : embedConfig.footer.text,
                    "footer_icon" : embedConfig.footer.url
                }
            ]
        }
    }else{
        let [lunch, dinner] = res.msg[now.getDay()]
        return {
            "attachments" : [
                {
                    "title" : todayStringfy,
                    "color" : `#${embedConfig.colors.normal}`,
                    "text" : `B동 학식 정보입니다 : https://sj.hongik.ac.kr/site/food/food_menu.html`,
                    "fields" : [
                        {
                            "title" : "중식",
                            "value" : (() => {
                                return lunch.length <= 0
                                ? Codes.notReady
                                : lunch.join(', ')
                            })()
                        },
                        {
                            "title" : "석식",
                            "value" : (() => {
                                return dinner.length <=0
                                ? Codes.notReady
                                : dinner.join(', ')
                            })()
                        }
                    ],
                    "footer" : embedConfig.footer.text,
                    "footer_icon" : embedConfig.footer.url
                }
            ]
        }
    }
}

module.exports.errorEmbedBuilder = (res) => {
    return {
        "attachments" : [
            {
                "title" : embedConfig.error.title,
                "color" : `#${embedConfig.colors.error}`,
                "fields" : [
                    {
                        "title" : embedConfig.error['field-title'],
                        "value" : res
                    }
                ],
                "footer" : embedConfig.footer.text,
                "footer_icon" : embedConfig.footer.url
            }
        ]
    }
}