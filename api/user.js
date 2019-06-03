
const model = require('../config/modelConfig');

const APIError = require('../middleware/rest').APIError;
const md5 = require('../tool/md5');
const config = require('../config/config.json');
 
module.exports = {
    'GET /api/users': async (ctx, next) => {
        let id = ctx.request.query.id
        const user = await model.User.findOne({
            where: {
                id: id
            }
        })
        ctx.rest({
            users: user
        });
    },

    'GET /api/userList': async (ctx, next) => {
        let offset = ctx.request.query.offset || 0
        let limit = ctx.request.query.limit || 10
        const user = await model.User.findAndCountAll({
            offset,
            limit,
            order: [[ 'createdAt', 'desc' ], [ 'id', 'desc' ]],
        })
        ctx.rest({
            users: user
        });
    },

    'PUT /api/users': async (ctx, next) => {
        let id = ctx.request.query.id
        const user = await model.User.findOne({
            where: {
                id: id
            }
        })

        if (!user) {
            throw new APIError('400', 'user not found by id:' + id);
        }
        else {
            let newUser = await model.User.update(ctx.request.body, {
                where: {
                    id: id
                }
            })
            if (newUser) {
                let newUserObj = {id: id}
                if (ctx.request.body.name) {
                    newUserObj.name = ctx.request.body.name
                }
                
                if (ctx.request.body.password) {
                    newUserObj.password = ctx.request.body.password
                }

                ctx.rest({
                    users: newUserObj
                });
            }
            else {
                throw new APIError('500', 'server error!');
            }
        }
    },
 
    'POST /api/users': async (ctx, next) => {
        let userParam = {
            name: ctx.request.body.name,
            password: ctx.request.body.password
        }
        let user = await model.User.create(userParam);
        ctx.rest(user);
    },
    
    // 用户注册
    'POST /api/users/register': async (ctx, next) => {
        let name = ctx.request.body.name
        const user = await model.User.findOne({
            where: {
                name: name
            }
        })
        
        if (user) {
            let resObj = {code: '1001', msg: '用户已存在!'}
            ctx.rest(resObj);
        } else {
            let userParam = {
                name: name,
                password: md5.getMd5(ctx.request.body.password)
            }
            let newUser = await model.User.create(userParam);
            if (newUser) {
                let resObj = {code: '200', msg: `${name}注册成功!`}
                ctx.rest(resObj);
            }
        }
    },

    // 用户登录
    'POST /api/users/login': async (ctx, next) => {
        let name = ctx.request.body.name
        const user = await model.User.findOne({
            where: {
                name: name
            }
        })
        
        if (!user) {
            let resObj = {code: '1002', msg: '用户不存在!'}
            ctx.rest(resObj);
        } else {
            if (user.password !== md5.getMd5(ctx.request.body.password)) {
                let resObj = {code: '1003', msg: '密码错误!'}
                ctx.rest(resObj);
            } else {
                // token处理：token存储在redis且返回
                let token = `${user.id}-${Date.now()}`
                let tokenObj = {userId: user.id, expires: config.expires, creatTime: Date.now()}
                ctx.redisClient.hmset(token, tokenObj)
                let resObj = {code: '200', token: token}
                ctx.rest(resObj);
            }
        }
    },
 
    'DELETE /api/users/:id': async (ctx, next) => {
        console.log(`delete user ${ctx.params.id}...`);
        let id = ctx.params.id
        if (!id) {
            throw new APIError('400', 'delete user need id.');
        }

        const user = await model.User.destroy({
            where: {
                id: id
            }
        })
        
        ctx.rest({
            users: user
        });
    }
};