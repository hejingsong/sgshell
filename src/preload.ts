/** 全局变量和全局样式 */
import "xterm/css/xterm.css";
import { Event } from "./classes/event";
import { Model as LinkModel } from "./classes/link/model";
import { Model as SessionModel } from "./classes/session/model";
import { Model as ConfigModel } from "./classes/sessionConfig/model";
import { TerminalManager } from "./classes/terminalManager";

const navBar = document.getElementById("nav");

// terminal container
export const termContainer = document.getElementById("term-box");

// terminal manager
export const terminalMgr = new TerminalManager(navBar);

// event controller
export const eventMgr = new Event();

// link model
export const linkModel = new LinkModel();

export const sessionModel = new SessionModel();

export const configModel = new ConfigModel();

// protocol
export const PROTOCOL = {
    loginResponse: 2,
    session: 3,
    logout: 4,
};
