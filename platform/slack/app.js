const axios = require('axios')
const schedule = require('node-schedule')
const scraper = require('../../Hook').scraper
const config = require('../../config.json').slack
const Codes = require('../../Codes')
const builder = require('./embedBuilder')

const scheduledTask = async() => {
    try{
        // Get today day
        const getDay = new Date().getDay()
        // Get meal information
        const meals = await scraper()
        // Check status of data scraper
        const embed = meals.status === Codes.fail
        ? (() => {throw new Error(meals.msg)})()
        : (() => {
            return getDay === 0 || getDay === 6
            ? builder.embedBuilder(Codes.weekendMsg)
            : builder.embedBuilder(meals)
        })()
        // Send to all of the endpoints
        await Promise.all(config.meal_alert_endpoints.map(x => {
            return axios.post(x,embed)
        }))
    }catch(err){
        console.error(err)
        const embed = builder.errorEmbedBuilder(err.message)
        await Promise.all(config.meal_alert_endpoints.map(x => {
            return axios.post(x,embed)
        }))
    }
}

const scheduler = async() => {
    try{
        const scheduleObject = schedule.scheduleJob(config.scheduler_expression,async() => {
            await scheduledTask()
        })
    }catch(err){
        console.error(err)
    }
}

scheduler()