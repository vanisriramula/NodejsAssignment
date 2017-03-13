var mysql = require('mysql');
var data = [];
var fs = require('fs')
  , ini = require('ini');

exports.app = function()
{  
	var config_app = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
	config = config_app['section'];
	delete global;
	global = [];
	global.database = config['database'];
	global.dbconfig = {
		  host : global.database.host,
		  user : global.database.user,
		  password: global.database.password,
		};
	function handleDisconnect()
	{	
		global.connect = mysql.createConnection(global.dbconfig); 
		global.connect.connect();
		global.connect.query('use '+global.database.database);
		global.connect.on('close', function (err) {
		  handleDisconnect();
		});
		global.connect.on('end', function (err) {
		  handleDisconnect();
		});
		global.connect.on('error', function(err) {
	      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
	          handleDisconnect();                        
		    } 
		    else {                            
			  throw err;                
			}
		});
		global.mysql = global.connect;
    }

	handleDisconnect();

    return global;
    
