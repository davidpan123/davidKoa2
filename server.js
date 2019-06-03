/*********************************************
//文件：server页面
//作者：davidpan
//时间：2019/5/10
//描述：处理server

**********************************************/
'use strict';

//cluster 集群
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//Redis
const redis = require('redis');

//Koa server
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const apiMapping = require('./middleware/apiMapping');
const rest = require('./middleware/rest');


class Server {
    constructor(option) {
        //服务 host 
        this.host = option.host;
        this.redisPort = option.redisPort;
        this.client = null
    }
    /* 连接Redis
    *  @params  无
    *  @return void
    */
   startRedis() {
        this.client = redis.createClient(this.redisPort, this.host);
        this.client.on('ready', err => {
            if (err) {
                console.err(err)
                return
            }

            console.log('redis is ready!')
            this.startServer();
        })
    }
    startServer () {
        if (cluster.isMaster) {
            // 衍生工作进程。
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} exit!\nA new worker fork now.`);
                cluster.fork();
            });
        } else {
            // parse request body:
            app.use(bodyParser());
            // bind .rest() for ctx:
            app.use(rest.restify());
            // add apiMapping:
            app.use(apiMapping());
            
            app.listen(3333);
            console.log('app started at port 3333...');

            // bind redisClient to ctx
            app.context.redisClient = this.client
        }
    }
    /* 开启服务
    *  @params  无
    *  @return void
    */
    start() {
        this.startRedis()
    }
}

module.exports = Server;