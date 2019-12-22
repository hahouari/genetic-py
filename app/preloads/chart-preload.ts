import { ipcRenderer, remote } from 'electron';
import { Chart } from 'highcharts';

/**
 * set to true if app on development, false in production.
 *
 * NOTE: app needs to be packed on asar (by default) to detect production mode
 * if you don't set asar to false on electron-builder.json you're good to go
 */
const isDev = remote.app.getAppPath().indexOf('.asar') === -1;
/**
 * allows communication between this webview & renderer process
 */
window['ipcRenderer'] = ipcRenderer;

/**
 * initialize a chart and pass it options
 * @param containerId id of html div tag that is going to contain chart
 * @param options chart options
 *
 * @returns set up chart
 */
window['createChart'] = require('../modules/create-chart');
/**
 * enables or disable the hover settings for the passed chart
 * @param enable decides if to disable hover settings or enable them.
 * @param chart chart to apply hover settings on
 */
window['enableChartHover'] = (enable: boolean, chart: Chart) => {
  chart.update(
    {
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
    },
    true,
    false,
    false
  );
};

/**
 * clears chart data and xAxis if needed and redraw instantly
 * @param chart chart to clear its data and xAxis
 * @param categories whether to clear categories, default is false
 */
window['clearChart'] = (chart: Chart, categories: boolean = false) => {
  if (categories) chart.xAxis[0].setCategories([]);
  chart.series[0].setData([], true);
};

if (isDev)
  window.addEventListener(
    'keyup',
    (event: KeyboardEvent) => {
      if (event.code == 'Backquote')
        if (event.ctrlKey)
          if (event.shiftKey) ipcRenderer.sendToHost('devTools', 'secondary');
          else ipcRenderer.sendToHost('devTools', 'primary');
    },
    true
  );