const crypto=require('crypto');

function getMd5(str) {
    let obj=crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex')
}

module.exports = {
    getMd5: getMd5
};