"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let ipcRenderer = window['ipcRenderer'];
let validatePath = window['validatePath'];
let browseBtn = document.getElementById('browse-btn');
let ffPath = document.getElementById('ff-path');
browseBtn.onclick = () => {
    ipcRenderer.once('browsed-path', (_ev, result) => {
        if (result.canceled)
            return;
        ffPath.value = result.filePaths[0];
        checkPath(result.filePaths[0]);
    });
    ipcRenderer.send('browse');
};
ffPath.onkeydown = () => checkPath(ffPath.value);
let checkPath = (path) => {
    let checkCode = validatePath(path);
    switch (checkCode) {
        case -1:
            console.log("path doesn't exist.");
            break;
        case -2:
            console.log('path should be absolute, found relative path.');
            break;
        case -3:
            console.log("the path doesn't point to a file.");
            break;
        case -4:
            console.log('path should point to a python file (ends with .py).');
            break;
        default:
            console.log('possible.');
            break;
    }
};
//# sourceMappingURL=conf-ga.js.map