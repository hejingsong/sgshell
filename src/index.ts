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

const framework = require("./classes/framework");
const path = require("path");
const baseDir = path.dirname(process.execPath);
const backendName = "/backend/webSocketServer.exe";
const sgProto = new SgProto("./proto/sgshell.proto");
let connector: Connector = null;

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
    framework.setClipboard(selectedText);
}

function pasteText() {
    const term = terminalMgr.getCurrentTerm();
    if (!term) {
        return;
    }
    const text = framework.getClipboard();
    if (!text) {
        return;
    }
    term.pasteText(text);
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
framework.initMenu();
framework.initContextMenu();
framework.initShortCut();

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
eventMgr.add("contextmenu/copy", () => {
    copyText();
});
eventMgr.add("contextmenu/paste", () => {
    pasteText();
});
eventMgr.add("app/esc", () => {
    closeCurrentDialog();
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
    framework.showContextMenu(ev.x, ev.y);
    return false;
});

if (process.env.NODE_ENV === "development") {
    framework.showDevTool();
} else {
    framework.exec(baseDir + backendName);
}
