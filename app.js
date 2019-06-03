const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
const Server = require('./server');
let server = new Server(config);
server.start()
