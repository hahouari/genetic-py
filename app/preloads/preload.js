"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const { app } = electron_1.remote;
window['ipcRenderer'] = electron_1.ipcRenderer;
window['webFrame'] = electron_1.webFrame;
window['ready'] = require(path_1.join(__dirname, '..', 'modules', 'ready.js'));
window['loaded'] = require(path_1.join(__dirname, '..', 'modules', 'loaded.js'));
window['border'] = require(path_1.join(__dirname, '..', 'modules', 'border.js'));
electron_1.ipcRenderer.once('mode', (_ev, isDev) => {
    if (isDev)
        window['k-shorts'] = require(path_1.join(__dirname, '..', 'modules', 'k-shorts.js'));
    const pyshell = require(path_1.join(__dirname, '..', 'modules', 'create-pyshell.js'))(app);
    window['pyshell'] = pyshell;
    window['sendSig'] = (signal) => pyshell.stdin.write(`${signal}\n`);
});
//# sourceMappingURL=preload.js.map