/** 全局变量和全局样式 */
import Event from "@/util/event";
import { TerminalManager } from "@/view/terminalManager";
import ViewMgr from "@/view/ViewMgr";
import "xterm/css/xterm.css";

const navBar = document.getElementById("nav");

// terminal container
export const termContainer = document.getElementById("term-box");

export const elementParent = document.getElementsByTagName("body")[0];

// terminal manager
export const terminalMgr = new TerminalManager(navBar);

// event controller
export const eventMgr = new Event();

export const viewMgr = new ViewMgr();

// protocol
export const PROTOCOL = {
    loginResponse: 2,
    session: 3,
    logout: 4,
};
