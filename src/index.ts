import { Connector, ConnectorTypeEnum } from "./classes/connector";
import { TerminalState } from "./classes/defines";
import CTerminal from "./classes/terminal/terminal";
import { TerminalType } from "./classes/terminalManager";
import { SgProto } from "./lib/sgProto";
import {
    eventMgr,
    linkModel,
    PROTOCOL,
    termContainer,
    terminalMgr,
} from "./preload";
import { confirmWarning, error } from "./util/helper";

declare var nw: any;

const gui = require("nw.gui");
const path = require("path");
const shell = gui.Shell;
const nwWin = nw.Window.get();
const clipboard = gui.Clipboard.get();
const baseDir = path.dirname(process.execPath);
const backendName = "/backend/webSocketServer.exe";
const sgProto = new SgProto("./proto/sgshell.proto");
let connector: Connector = null;
let contextMenu: any;

function closeCurrentDialog() {
    if (!connector.isReady()) {
        return;
    }

    const masks = document.getElementsByClassName("mask");
    const len = masks.length;
    let maxZIndex = 0;
    let matchMask = null;
    for (let i = 0; i < len; ++i) {
        if (i === 3) {
            continue;
        }
        const mask = masks[i] as HTMLElement;
        if (mask.style.display === "none") {
            continue;
        }
        const zIndex = parseInt(mask.style.zIndex, 10);
        console.log(mask.style.zIndex);
        console.log(zIndex);
        if (zIndex > maxZIndex) {
            maxZIndex = zIndex;
            matchMask = mask;
        }
    }
    if (!matchMask) {
        return;
    }
    matchMask.style.display = "none";
}

function copyText() {
    const term = terminalMgr.getCurrentTerm();
    if (!term) {
        return;
    }
    const selectedText = term.getSelection();
    if (!selectedText) {
        return;
    }
    clipboard.set(selectedText, "text");
}

function pasteText() {
    const term = terminalMgr.getCurrentTerm();
    if (!term) {
        return;
    }
    const text = clipboard.get("text");
    if (!text) {
        return;
    }
    term.pasteText(text);
}

function initContextMenu() {
    contextMenu = new nw.Menu({ type: "contextmenu" });
    contextMenu.append(new nw.MenuItem({
        label: "复制",
        click: () => {
            copyText();
        }
    }));
    contextMenu.append(new nw.MenuItem({
        label: "黏贴",
        click: () => {
            pasteText();
        }
    }));
}

function initMenu() {
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

function initShortCut() {
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
            closeCurrentDialog();
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

function initNet() {
    connector = new Connector(
        "ws://127.0.0.1:12345",
        onNetOpen,
        onNetData,
        onNetClose,
        onNetError,
    );
    connector.init(ConnectorTypeEnum.BINARY);
    const maskBox = document.getElementsByClassName("mask")[3] as HTMLElement;
    maskBox.style.display = "block";
}

function onNetOpen() {
    const maskBox = document.getElementsByClassName("mask")[3] as HTMLElement;
    maskBox.style.display = "none";
}

function onNetError() {
    initNet();
}

function onNetClose() {
    // initNet();
}

function onNetData(buffer: ArrayBuffer) {
    const uint8Array = new Uint8Array(buffer);
    const [proIdx, data] = sgProto.decode(uint8Array);
    eventMgr.emit(proIdx, data);
}

function logout(termId: number) {
    const data = sgProto.encode("logout", { termId });
    connector.send(data);
}

function createTerminal(host: string, port: number, user: string, passwd: string, type: number, key: string) {
    const term = terminalMgr.createTerminal(TerminalType.XTERM, termContainer, host);
    const termSize = term.getSize();
    const nav = term.getNav();
    const [row, col] = termSize;
    const data = {
        "termId": term.getTermId(),
        host,
        port,
        user,
        passwd,
        type,
        key,
        row,
        col
    };
    nav.setData(data);
    const code = sgProto.encode("login", data);
    connector.send(code);
    term.focus();
}

function newLink() {
    if (!connector.isReady()) {
        return;
    }
    linkModel.openDialog();
}

function closeCurrentTerminal() {
    const term = terminalMgr.getCurrentTerm();
    if (!term) {
        return;
    }
    const termId = term.getTermId();
    if (!term.isLogin()) {
        terminalMgr.destory(termId);
        return;
    }
    confirmWarning("提示", "该会话还未结束，是否关闭？", () => {
        logout(termId);
        terminalMgr.destory(termId);
        return true;
    });
}

initNet();
initMenu();
initContextMenu();
initShortCut();

terminalMgr.setOnData((term: CTerminal, msg: string) => {
    const termId = term.getTermId();
    const data = sgProto.encode("session", { termId, msg });
    connector.send(data);
});
terminalMgr.setOnClickClose((termId: number) => {
    const term = terminalMgr.getTerm(termId);
    if (!term) {
        return;
    }
    if (!term.isLogin()) {
        terminalMgr.destory(termId);
        return;
    }
    confirmWarning("提示", "该会话还未结束，是否关闭？", () => {
        logout(termId);
        terminalMgr.destory(termId);
        return true;
    });
});
terminalMgr.setOndblclickCb((data: any) => {
    createTerminal(
        data.host,
        data.port,
        data.user,
        data.passwd,
        data.type,
        data.key
    );
});

linkModel.setConfirmCb(() => {
    linkModel.closeDialog();
    createTerminal(
        linkModel.host,
        linkModel.port,
        linkModel.username,
        linkModel.password,
        linkModel.loginType,
        linkModel.key
    );
});

eventMgr.add("file/new", () => {
    newLink();
});
eventMgr.add("file/close", () => {
    closeCurrentTerminal();
});
eventMgr.add("file/open", () => {
    // open dialog
});
eventMgr.add("resize", () => {
    const size = terminalMgr.onResize();
    if (!size) {
        return;
    }
    const [row, col] = size;
    const data = sgProto.encode("resize", { row, col });
    connector.send(data);
});
eventMgr.add(PROTOCOL.loginResponse, (data: any) => {
    if (data.code === -1) {
        error("连接错误", data.msg);
        terminalMgr.destory(data.termId);
        return;
    }
    terminalMgr.changeState(data.termId, TerminalState.SUCCESS);
});
eventMgr.add(PROTOCOL.session, (data: any) => {
    const termId = data.termId;
    const msg = data.msg;
    const term = terminalMgr.getTerm(termId);
    if (!term) {
        return;
    }
    term.write(msg);
});
eventMgr.add(PROTOCOL.logout, (data: any) => {
    const termId = data.termId;
    terminalMgr.changeState(termId, TerminalState.FAILURE);
});

window.onresize = () => {
    eventMgr.emit("resize");
};

document.body.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    return false;
});

termContainer.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    contextMenu.popup(ev.x, ev.y);
    return false;
});

if (process.env.NODE_ENV === "development") {
    nwWin.showDevTools();
} else {
    shell.openItem(baseDir + backendName);
}
