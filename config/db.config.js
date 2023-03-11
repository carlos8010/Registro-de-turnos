'user strict';

const mysql = require('mysql');

//local mysql db connection
const dbConn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port     : '3306',
  database : 'gestioningresos'
});
dbConn.connect(function(err) {
  if (err) throw err;
  console.log("¡Database Connected!");
});
//consultas sql

module.exports = dbConn;
