'use strict';
const db = require('../config/db');
module.exports = db.defineModel('users', {
  name: db.STRING(30),
  password: db.STRING(200)
});
