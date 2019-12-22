"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const isDev = electron_1.remote.app.getAppPath().indexOf('.asar') === -1;
window['ipcRenderer'] = electron_1.ipcRenderer;
window['createChart'] = require('../modules/create-chart');
window['enableChartHover'] = (enable, chart) => {
    chart.update({
        tooltip: {
            enabled: enable
        },
        navigator: {
            enabled: enable
        },
        xAxis: {
            crosshair: enable
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: enable,
                    radius: enable ? 2 : null
                },
                states: {
                    hover: {
                        halo: {
                            opacity: enable ? 0.5 : 0
                        }
                    }
                }
            }
        }
    }, true, false, false);
};
window['clearChart'] = (chart, categories = false) => {
    if (categories)
        chart.xAxis[0].setCategories([]);
    chart.series[0].setData([], true);
};
if (isDev)
    window.addEventListener('keyup', (event) => {
        if (event.code == 'Backquote')
            if (event.ctrlKey)
                if (event.shiftKey)
                    electron_1.ipcRenderer.sendToHost('devTools', 'secondary');
                else
                    electron_1.ipcRenderer.sendToHost('devTools', 'primary');
    }, true);
//# sourceMappingURL=chart-preload.js.map