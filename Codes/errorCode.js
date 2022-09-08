const pf = require('./statusCode')
const convention = require('./codeConvention').convention

// axios request error
module.exports.requestError = convention(pf.fail,"Something went wrong while making request")

// cheerio parsing error
module.exports.parsingError = convention(pf.fail,"Something went wrong while paring data")
