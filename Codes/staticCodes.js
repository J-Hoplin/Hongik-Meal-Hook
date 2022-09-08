const pf = require('./statusCode')
const convention = require('./codeConvention').convention

// If today is weekend
module.exports.weekendMsg = convention(pf.weekend,"주말에는 학식을 운영하지 않습니다!")