const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// local modules
const temp_monitor = require('./apps/temp_monitor');

// setup express
const app = express();
let intialPath = path.join(__dirname, "public");
app.use(bodyParser.json());
app.use(express.static(intialPath));

// Router
app.get('/', (req, res) => { res.sendFile(path.join(intialPath, "index.html")); })
// setInterval(temp_monitor.updateTempDB_, 10000); // move this to monitor.js
app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})

app.post('/temp-get', temp_monitor.getDBData_);

// nohup node server.js > log.txt &