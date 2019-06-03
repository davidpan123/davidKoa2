const {isTokenValid} = require('../tool/common')
module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                // 登录注册不需要验证token
                if (ctx.request.url === '/api/users/login' || ctx.request.url === '/api/users/register') {
                    ctx.rest = (data) => {
                        ctx.response.type = 'application/json';
                        ctx.response.body = data;
                    }
                } else {
                    // 其他接口需要登录验证
                    let token = ctx.request.header.autoToken
                    let valid = await isTokenValid(token, ctx.redisClient)
                    if (!token || !valid) {
                        ctx.response.status = 401;
                        ctx.response.type = 'application/json';
                        ctx.response.body = {
                            code: 401,
                            message: 'need login!'
                        };

                        return 
                    } else {
                        ctx.response.type = 'application/json';
                        ctx.response.body = data;
                    }
                }

                try {
                    await next();
                } catch (e) {
                    console.log('Process API error...');
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};