// Temperature Monitor
// Use this script to launch the temperature monitor
// This will update the database every 60 seconds

const temp_monitor = require('./apps/temp_monitor');

setInterval(temp_monitor.updateTempDB_, 60000);

// nohup node monitor.js > logm.txt &