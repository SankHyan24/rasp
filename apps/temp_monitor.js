const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/temperature.db');
const deviceNum = "28-3348d446e2c9";
const deviceFile = '/sys/bus/w1/devices/' + deviceNum + '/w1_slave';

//
function readDeviceFile() {
    try {
        const data = fs.readFileSync(deviceFile, 'utf8');
        return data;
    } catch (err) {
        console.error('SC_Error Read file error:', err);
    }
}

//
function readTemp() {   
    lines = readDeviceFile().split('\n');
    tempC = -273.15;
    {
        first_line = lines[0]
        if (first_line.slice(-3) != 'YES') {
            console.log('Waiting for device to be ready');
            setTimeout(readTemp, 200);
            return tempC;
        }
        second_line = lines[1];
        temp = second_line.split('=')[1];
        tempC = parseFloat(temp) / 1000.0;
    }
    return tempC;
}

//
function updateTempDB() {
    temp = readTemp();
    if (temp == -273.15) {
        console.log('SC_Error Read temperature error');
        return;
    }
    time_stamp = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
    // console.log('SC_Info Current temperature:', temp);
    // console.log('SC_Info Current time:', time_stamp);
    db.all('SELECT * FROM temperatures', (err, rows) => {
        if (err) {
            console.error('SC_Error Read from DB:', err);
         
        }else
        if (rows.length >= 1440) {
            db.run('DELETE FROM temperatures WHERE timestamp = ?', [rows[0].timestamp], (err) => {
                if (err)
                    console.error('SC_Error deleting temperature', err);
                // else
                //     console.log('SC_Info Delete the first data:',rows[0]);
            });
        }
    });
    db.run('INSERT INTO temperatures (temperature, timestamp) VALUES (?, ?)', [temp, time_stamp], (err) => {
        if (err) {
            console.error('SC_Error inserting temperature', err);
        }
    });
}

function getDBdataRaw() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM temperatures', (err, rows) => {
            if (err) {
                reject('Error getting temperatures: ' + err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    updateTempDB_: function(){
        updateTempDB();
    },
    getDBData_: function(req,res){
        console.log('SC_Info Post_(getDBData_)');
        getDBdataRaw().then((rows) => {
            // console.log(rows);
            res.json(rows);
        }
        ).catch((err) => {
            res.json(err);
        });
    }
}
// 25261