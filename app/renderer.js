"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const Highcharts = require("highcharts");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
function isDev() {
    return process.mainModule.filename.indexOf('.asar') === -1;
}
let playBtn = document.getElementById('play-btn');
let stopBtn = document.getElementById('stop-btn');
let toStartBtn = document.getElementById('to-start-btn');
let stepFBtn = document.getElementById('step-forward-btn');
let progressChart;
let fittestChart;
let currentChart;
let mostFittest = { fitness: -1 };
let fittestsHistory = [];
const initChart = (containerId, options) => {
    return Highcharts.chart(containerId, {
        title: {
            text: options.title.text,
            style: {
                padding: '80px'
            }
        },
        xAxis: {
            title: {
                text: options.xAxis.title.text,
                align: 'high'
            }
        },
        yAxis: {
            title: {
                text: options.yAxis.title.text,
                align: 'high',
                rotation: 0,
                y: -20,
                x: -5,
                offset: -35
            }
        },
        series: options.series,
        legend: {
            enabled: false
        },
        tooltip: {
            animation: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });
};
progressChart = initChart('progress-chart', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Fittest Fitness per Generation'
    },
    xAxis: {
        title: {
            text: 'Generation'
        }
    },
    yAxis: {
        title: {
            text: 'Fitness value'
        }
    },
    series: [
        {
            name: 'CGA',
            data: []
        }
    ],
    plotOptions: {
        series: {
            animation: false
        }
    }
});
fittestChart = initChart('fittest-chart', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Best Fittest'
    },
    xAxis: {
        title: {
            text: 'Genes'
        }
    },
    yAxis: {
        title: {
            text: 'Gene value'
        }
    },
    series: [
        {
            data: []
        }
    ]
});
currentChart = initChart('current-chart', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Current Generation Fittest'
    },
    xAxis: {
        title: {
            text: 'Genes'
        }
    },
    series: [
        {
            data: []
        }
    ],
    yAxis: {
        title: {
            text: 'Gene value'
        }
    }
});
const settingXaxis = (args, ...charts) => {
    const genes = [...Array(args['genesNum']).keys()].map(v => `${++v}`);
    charts.forEach(chart => {
        chart.xAxis[0].setCategories(genes);
    });
};
const clearChart = (chart, categories = true) => {
    if (categories)
        chart.xAxis[0].setCategories([]);
    chart.series[0].setData([]);
    chart.redraw();
};
let isRunning = false;
let pyshell;
const addToChart = (args) => {
    if (args['generation'] !== undefined &&
        args['fitness'] !== undefined &&
        args['genes'] !== undefined) {
        progressChart.series[0].addPoint(parseInt(args['fitness']), true, false, false);
        currentChart.series[0].setData(args['genes'], true, false);
        fittestsHistory.push(args['genes']);
        if (mostFittest['fitness'] < args['fitness']) {
            mostFittest['fitness'] = args['fitness'];
            mostFittest['individuals'] = [
                {
                    generation: args['generation'],
                    genes: args['genes']
                }
            ];
            fittestChart.series[0].setData(mostFittest.individuals[0].genes, true, false);
        }
        else if (mostFittest['fitness'] == args['fitness']) {
            mostFittest['individuals'].unshift({
                generation: args['generation'],
                genes: args['genes']
            });
            fittestChart.series[0].setData(mostFittest.individuals[0].genes, true, false);
        }
    }
    else if (args['started'] && args['genesNum'] !== undefined) {
        clearChart(progressChart);
        clearChart(fittestChart);
        clearChart(currentChart);
        fittestsHistory = [];
        mostFittest = { fitness: -1 };
        settingXaxis(args, currentChart, fittestChart);
        setClickable();
    }
};
if (isDev()) {
    pyshell = child_process_1.spawn(`python3`, [path_1.join(__dirname, 'python', 'ga.py')]);
}
else {
    fs_1.copyFileSync(path_1.join(__dirname, 'python', 'dist', 'ga'), path_1.join(electron_1.remote.app.getPath('temp'), 'ga'));
    pyshell = child_process_1.spawn(`${path_1.join(electron_1.remote.app.getPath('temp'), 'ga')}`);
}
pyshell.stdout.on('data', (passedArgs) => {
    passedArgs
        .toString()
        .split('\n')
        .forEach((args) => {
        if (args)
            addToChart(JSON.parse(args));
    });
});
pyshell.on('error', (err) => console.error(`error trace: ${err}`));
const play = () => {
    pyshell.stdin.write('"play"\n');
};
const pause = () => {
    pyshell.stdin.write('"pause"\n');
};
const stop = () => {
    pyshell.stdin.write('"stop"\n');
};
const replay = () => {
    pyshell.stdin.write('"replay"\n');
};
const stepForward = () => {
    pyshell.stdin.write('"step_f"\n');
};
const exit = () => {
    pyshell.stdin.write('"exit"\n');
};
const switchBtn = () => {
    if (isRunning) {
        playBtn.querySelector('.play').style.display = 'none';
        playBtn.querySelector('.pause').style.display = 'block';
    }
    else {
        playBtn.querySelector('.play').style.display = 'block';
        playBtn.querySelector('.pause').style.display = 'none';
    }
};
const setClickable = (clickable = true) => {
    Array.from(document.querySelector('.controls').children).forEach((element, index) => {
        if ([0, 4].includes(index))
            return;
        if (clickable)
            element.classList.remove('disabled-btn');
        else
            element.classList.add('disabled-btn');
        element.disabled = !clickable;
    });
};
playBtn.onclick = () => {
    isRunning = !isRunning;
    if (isRunning) {
        play();
    }
    else {
        pause();
    }
    switchBtn();
};
stopBtn.onclick = () => {
    setClickable(false);
    stop();
    isRunning = false;
    switchBtn();
};
toStartBtn.onclick = () => {
    replay();
    isRunning = true;
    switchBtn();
};
stepFBtn.onclick = () => {
    stepForward();
    isRunning = false;
    switchBtn();
};
electron_1.ipcRenderer.on('pyshell', () => {
    exit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUErQztBQUMvQywrQkFBNEI7QUFDNUIseUNBQXlDO0FBQ3pDLGlEQUFvRDtBQUNwRCwyQkFBa0M7QUFPbEMsU0FBUyxLQUFLO0lBQ1osT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUtELElBQUksT0FBTyxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JFLElBQUksT0FBTyxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXJFLElBQUksVUFBVSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBSTVFLElBQUksUUFBUSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFLOUUsSUFBSSxhQUErQixDQUFDO0FBRXBDLElBQUksWUFBOEIsQ0FBQztBQUVuQyxJQUFJLFlBQThCLENBQUM7QUFHbkMsSUFBSSxXQUFXLEdBUVgsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVwQixJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFFekIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxXQUFtQixFQUFFLE9BQTJCLEVBQUUsRUFBRTtJQUNyRSxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ25DLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUk7WUFDeEIsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxNQUFNO2FBQ2hCO1NBQ0Y7UUFDRCxLQUFLLEVBQUU7WUFDTCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUE0QixP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