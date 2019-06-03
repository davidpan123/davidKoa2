# davidKoa2
>基于KOA2封装的前端框架(封装了rest、token...一些中间件), 使用前: 配置数据库和redis连接。
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3333
npm run dev
```

## 写一个模块的API步骤:  
1. Migrations新建一个表
2. model文件下使用sequelize的ORM新建一个model
3. api文件夹下新建api

## Migrations管理数据库的变更工具
1. 初始化Migrations
a.安装
npm i sequelize sequelize-cli -S
b.初始化 Migrations 配置文件和目录
npx sequelize init:config
npx sequelize init:migrations
2. 完善数据库配置
3. 初始化数据库表
npx sequelize migration:generate --name=init-users
4. 修改users表
5. 执行 migrate 进行数据库变更
npx sequelize db:migrate
npx sequelize db:migrate:undo 回退一个变更
db:migrate:undo:all 回退到初始状态

## Redis 使用redis作常量和缓存数据库
在 Ubuntu 系统安装 Redis 可以使用以下命令:
$sudo apt-get update
$sudo apt-get install redis-server
``` bash
# 如果需要安装成服务的话执行
```
$ sudo systemctl enable redis-server.service
启动 Redis
$ redis-server
查看 redis 是否启动？
$ redis-cli
以上命令将打开以下终端：
redis 127.0.0.1:6379>

简单配置可供远程访问:
1. sudo vim /etc/redis/redis.conf
2. 修改配置
``` bash
# 把以下注释掉（前面加#）
```
bind 127.0.0.1 ::1
``` bash
# 以下改为 yes → no
```
protected-mode no
3. 允许外网访问端口
sudo ufw allow 6379
4. 重启
sudo service redis-server restart

5.常用命令: 
用这些命令前提是：需要安装成服务 sudo systemctl enable redis-server.service
sudo service redis-server stop
sudo service redis-server start

## 文件目录结构
1. api------------API定义
2. database-------数据库配置
3. middleware-----中间件封装
4. model----------模型定义
5. tool-----------工具封装
6. test.http------api的单元测试
