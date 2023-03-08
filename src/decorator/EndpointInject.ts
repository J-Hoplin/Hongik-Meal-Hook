import logger from "../log";
import { Campus } from '../types'
import { Endpoints } from "../constant";

function EndpointInject(type: Campus) {
    return function decoration(prototype: any, methodName: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function (...args: any[]) {
            try {
                prototype.endpoint = Endpoints[type]
                let result = method.apply(prototype, args)
                return result
            } catch (err) {
                console.error(err)
                logger.error(err)
                return false
            }
        }
        return descriptor
    }
}

export default EndpointInject
