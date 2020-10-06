import { Connector, ConnectorTypeEnum } from "@/connector";
import { SgProto } from "@/lib/sgProto";
import {
    elementParent,
    eventMgr,
    PROTOCOL,
    termContainer,
    terminalMgr,
    viewMgr
} from "@/preload";
import { DialogType } from "@/view/base/DialogType";
import { TerminalState } from "@/view/defines";
import CTerminal from "@/view/terminal/terminal";
import { TerminalType } from "@/view/terminalManager";

const fs = require("fs");
const framework = require("./view/framework");
const path = require("path");
const baseDir = path.dirname(process.execPath);
const userDir = baseDir + "/user";
const sessionFile = userDir + "/session";
const backendName = "/backend/webSocketServer.exe";
const sgProto = new SgProto("./proto/sgshell.proto");
let connector: Connector = null;
let gSessions: any[] = [];

function tipError(data: any) {
    viewMgr.show("tip", elementParent, DialogType.ERR, data);
}

function closeCurrentDialog() {
    if (!connector.isReady()) {
        return;
    }

    viewMgr.closeCurrent();
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

function writeUserData() {
    const buffer = sgProto.encode("sessions", { list: gSessions });
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
    }
    fs.writeFileSync(sessionFile, buffer);
}

function initUserData() {
    fs.readFile(sessionFile, (err: Error, data: any) => {
        if (err) {
            gSessions = [];
            return;
        }
        if (!data) {
            gSessions = [];
            return;
        }
        const [protoIdx, session] = sgProto.decode(data);
        gSessions = session.list;
    });
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

function createTerminal(
    host: string,
    port: number,
    user: string,
    passwd: string,
    type: number,
    key: string,
    name: string = ""
) {
    name = name ? name : host;
    const term = terminalMgr.createTerminal(TerminalType.XTERM, termContainer, name);
    const termSize = term.getSize();
    const nav = term.getNav();
    const [row, col] = termSize;
    const data = {
        "termId": term.getTermId(),
        name,
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
    viewMgr.show("link", elementParent, DialogType.OTHER, {
        error: tipError,
        confirm: confirmLink
    });
}

function confirmLink(data: any) {
    createTerminal(
        data.host,
        data.port,
        data.user,
        data.passwd,
        data.type,
        data.key,
        data.name || data.host
    );
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
    viewMgr.show("confirm", elementParent, DialogType.WARN, {
        title: "提示",
        message: "该会话还未结束，是否关闭？",
        confirm: () => {
            logout(termId);
            terminalMgr.destory(termId);
            return true;
        }
    });
}

function openConfigDialog(data: any) {
    data = data || {};
    const idx = gSessions.indexOf(data);
    data.idx = idx;
    data.confirm = addSession;
    viewMgr.show("config", elementParent, DialogType.OTHER, data);
}

function addSession(data: any) {
    if (data.idx >= 0) {
        gSessions[data.idx] = data;
    } else {
        const idx = gSessions.push(data) - 1;
        data.idx = idx;
    }
    viewMgr.show("session", elementParent, DialogType.OTHER, {list: gSessions});
}

function delSession(data: any) {
    const idx = gSessions.indexOf(data);
    gSessions.splice(idx, 1);
    viewMgr.show("session", elementParent, DialogType.OTHER, {list: gSessions});
}

initNet();
initUserData();
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
    viewMgr.show("confirm", elementParent, DialogType.WARN, {
        title: "提示",
        message: "该会话还未结束，是否关闭？",
        confirm: () => {
            logout(termId);
            terminalMgr.destory(termId);
            return true;
        }
    });
});
terminalMgr.setOndblclickCb((data: any) => {
    confirmLink(data);
});

eventMgr.add("file/new", () => {
    newLink();
});
eventMgr.add("file/close", () => {
    closeCurrentTerminal();
});
eventMgr.add("file/open", () => {
    viewMgr.show("session", elementParent, DialogType.OTHER, {
        confirm: confirmLink,
        add: openConfigDialog,
        config: openConfigDialog,
        del: delSession,
        error: tipError,
        list: gSessions
    });
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
    if (viewMgr.isDialogOpen()) {
        closeCurrentDialog();
        return;
    }
    const term = terminalMgr.getCurrentTerm();
    if (!term) {
        return;
    }
    const termId = term.getTermId();
    const msg = String.fromCharCode(0x1b);
    const data = sgProto.encode("session", { termId, msg });
    connector.send(data);
});
eventMgr.add(PROTOCOL.loginResponse, (data: any) => {
    if (data.code === -1) {
        tipError({
            title: "错误",
            message: "连接错误"
        });
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

framework.onWinClose(() => {
    writeUserData();
});

if (process.env.NODE_ENV === "development") {
    framework.showDevTool();
} else {
    framework.exec(baseDir + backendName);
}
