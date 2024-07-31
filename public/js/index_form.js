Vue.component('demo-grid', {
    template: 
    `<table>
        <thead>
        <tr>
            <th v-for="key in columns"
            @click="sortBy(key)"
            :class="{active: sortKey == key}">
            {{key | capitalize}}
            <span class="arrow"
                :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
            </span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="
            entry in data
            | filterBy filterKey
            | orderBy sortKey sortOrders[sortKey]">
            <td v-for="key in columns">
            {{entry[key]}}
            </td>
        </tr>
        </tbody>
    </table>`,
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
          sortOrders[key] = 1
        })
        return {
          sortKey: '',
          sortOrders: sortOrders
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})
var vm = new Vue({
    el: '#demo',
    data: {
        searchQuery: '',
        gridColumns: [ 'time','temp'],
        gridData: [
        ]
    }
})

//

const ctx = document.getElementById('myChart');
  
const Utils = {
    months: function ({ count }) {
        const now = new Date();
        return Array.from({ length: count }, (_, i) => {
            return new Date(now.getFullYear(), i, 1).toLocaleDateString('en', { month: 'short' });
        });
    },
    rand: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    CHART_COLORS: {
        red: 'rgb(255, 99, 132)',
        blue: 'rgb(54, 162, 235)',
        green: 'rgb(75, 192, 192)',
        orange: 'rgb(255, 159, 64)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    }
};

const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

const labels = Utils.months({count: 7});


var temperature_form = [];

var chartc = new Chart(ctx, {
    type: 'bar',
    data: {
        // labels: labels,
        datasets: [{
            data1: [],
            data2: []
          }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Temperature'
            }
        },
        scales: {
            y: {
                min: 26,
                // ticks: {
                //     beginAtZero: false
                // }
            }
        }
    }
});
chartc.update()