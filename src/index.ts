import { scheduleJob } from 'node-schedule'
import logger from './log'
import { scheduler as cron } from '../app-config.json'
import task from './platform/disocrd'

function scheduler() {
    logger.info(`Scheduler start! : ${cron}`)
    try {
        const schedule = scheduleJob(cron, async () => {
            logger.info("Task now running...")
            await task()
            logger.info("Task end...")
        })
    } catch (err) {
        logger.error(err)
    }
}

scheduler()