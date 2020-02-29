import { eventMgr } from "../preload";

declare var nw: any;

const gui = require("nw.gui");
const shell = gui.Shell;
const nwWin = nw.Window.get();
const clipboard = gui.Clipboard.get();

let contextMenu: any;

export function initContextMenu() {
    contextMenu = new nw.Menu({ type: "contextmenu" });
    contextMenu.append(new nw.MenuItem({
        label: "复制",
        click: () => {
            eventMgr.emit("contextmenu/copy");
        }
    }));
    contextMenu.append(new nw.MenuItem({
        label: "黏贴",
        click: () => {
            eventMgr.emit("contextmenu/paste");
        }
    }));
}

export function initMenu() {
    const menuBar = new nw.Menu({ type: "menubar" });
    const fileMenu = new nw.Menu();

    fileMenu.append(new nw.MenuItem({
        label: "新建",
        key: "N",
        modifiers: "alt",
        click: () => {
            eventMgr.emit("file/new");
        },
    }));
    fileMenu.append(new nw.MenuItem({
        label: "打开",
        key: "O",
        modifiers: "alt",
        click: () => {
            eventMgr.emit("file/open");
        },
    }));
    fileMenu.append(new nw.MenuItem({
        type: "separator"
    }));
    fileMenu.append(new nw.MenuItem({
        label: "断开",
        key: "C",
        modifiers: "alt",
        click: () => {
            eventMgr.emit("file/close");
        },
    }));
    fileMenu.append(new nw.MenuItem({
        type: "separator"
    }));
    fileMenu.append(new nw.MenuItem({
        label: "退出",
        click: () => {
            nwWin.close();
        },
    }));

    menuBar.append(new nw.MenuItem({
        label: "文件",
        submenu: fileMenu,
    }));

    nw.Window.get().menu = menuBar;
}

export function initShortCut() {
    const newLnkOpt = {
        key: "Alt+N",
        active: () => {
            eventMgr.emit("file/new");
        }
    };
    const openOpt = {
        key: "Alt+O",
        active: () => {
            eventMgr.emit("file/open");
        }
    };
    const closeOpt = {
        key: "Alt+C",
        active: () => {
            eventMgr.emit("file/close");
        }
    };
    const escOpt = {
        key: "Escape",
        active: () => {
            eventMgr.emit("app/esc");
        }
    };
    const newLnkSc = new nw.Shortcut(newLnkOpt);
    const openSc = new nw.Shortcut(openOpt);
    const closeSc = new nw.Shortcut(closeOpt);
    const escSc = new nw.Shortcut(escOpt);
    nw.App.registerGlobalHotKey(newLnkSc);
    nw.App.registerGlobalHotKey(openSc);
    nw.App.registerGlobalHotKey(closeSc);
    nw.App.registerGlobalHotKey(escSc);
}

export function exec(process: string) {
    shell.openItem(process);
}

export function showDevTool() {
    nwWin.showDevTools();
}

export function showContextMenu(x: number, y: number) {
    contextMenu.popup(x, y);
}

export function setClipboard(text: string) {
    clipboard.set(text, "text");
}

export function getClipboard() {
    return clipboard.get("text");
}

export function onWinClose(cb: CallableFunction) {
    nwWin.on("close", () => {
        cb();
        nwWin.close(true);
    });
}
