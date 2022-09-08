const errors = require('./errorCode')
const status = require('./statusCode')
const convention = require('./codeConvention')
const static = require('./staticCodes')

module.exports = {
    ...errors,
    ...status,
    ...convention,
    ...static
}