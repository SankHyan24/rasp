const form = [...document.querySelector('.index_temperature_form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i * 100);
})

var newest_id = 0;
var former_id = 0;

const updateTemperatureFrom = () => {
    fetch('/temp-get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        })
    })
        .then(res => res.json())
        .then(data => {
            // if (data == 'Error')
            //     alertBox(data);
            data = data.map(item => {
                return {
                    Id: item.id,
                    Time: item.timestamp,
                    Temperature: item.temperature
                }
            })
            newest_id = data[data.length - 1].Id;

            data_for_list = data.map(item => {
                return {
                    'time': item.Time,
                    'temp': item.Temperature
                }
            });

            vm.gridData = data_for_list;
            data_for_chart = data.map(item => {
                return {
                    x: item.time,
                    y: item.temp
                }
            });


            lowerst_id = data[0].Id
            lowerst_id = former_id > lowerst_id ? former_id: lowerst_id;
            console.log(chartc.data.datasets)
            
            for(let i = lowerst_id; i < newest_id; i++){
                console.log(i)
                temperature_form_index = data.findIndex(item => item.Id == i);
                temperature_form = {x:data[temperature_form_index].Time,y:data[temperature_form_index].Temperature}
                console.log(temperature_form);
                chartc.data.datasets.forEach((dataset) => {
                    dataset.data.push(temperature_form);
                });
            }
            // chartc.options.scales.y.min = 25
            chartc.data.labels.sort(); 
            chartc.update()

            former_id = newest_id;

        })
}
window.onload = () => {
    updateTemperatureFrom();
}
const intervalId = setInterval(updateTemperatureFrom, 20000);
