/*********************************************
//文件：common
//作者：panshiliang
//时间：2019/5/10
//描述：处理公共方法
**********************************************/
'use strict';

module.exports = {
    isTokenValid: (token, client) => {
        return new Promise((resove, reject) => {
            client.hgetall(token, (err, value) => {
                if (err) {
                    resove(false)
                }
                else {
                    if (value) {
                        let {creatTime, expires} = value
                        let now = Date.now()
                        if (now - creatTime > expires) {
                            resove(false)
                        } else {
                            resove(true)
                        }
                    } else {
                        resove(false)
                    }
                }
            })
        }) 
    }
}