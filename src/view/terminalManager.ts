import Nav from "@/view/component/Nav";
import { StateIcon, TerminalState } from "@/view/defines";
import Terminal from "@/view/terminal/terminal";
import XTerm from "@/view/terminal/xterm/xterm";

export enum TerminalType {
    XTERM = 1,
}

export class TerminalManager {
    private termId: number;
    private termMap: { [key: number]: Terminal; };
    private navBar: HTMLElement;
    private onDataCb: CallableFunction;
    private onClickClose: CallableFunction;
    private ondblclickCb: CallableFunction;
    private lastTerm: Terminal;

    public constructor(navBar: HTMLElement) {
        this.navBar = navBar;
        this.termId = 1;
        this.termMap = {};
        this.onDataCb = null;
        this.onClickClose = null;
        this.lastTerm = null;
    }

    public createTerminal(type: TerminalType, container: HTMLElement, title: string) {
        let term;
        let termBox;

        if (type === TerminalType.XTERM) {
            termBox = document.createElement("div");
            termBox.id = "term" + this.termId;
            termBox.className = "term-container";
            container.append(termBox);
            term = new XTerm(termBox);
        }

        if (!term) {
            return term;
        }
        const nav = this.createNav(title, this.termId);
        term.create(this.termId, nav);
        term.setOnDataCb(this.onDataCb);
        this.termMap[this.termId] = term;
        this.onNavClick(this.termId);
        ++this.termId;
        return term;
    }

    public onResize() {
        let term = null;
        for (const termId in this.termMap) {
            term = this.termMap[termId];
            term.onResize();
        }
        if (!term) {
            return false;
        }
        return term.size();
    }

    public destory(termId: number) {
        const term = this.termMap[termId];
        if (!term) {
            return;
        }
        term.destory();
        delete this.termMap[termId];
        if (termId === this.lastTerm.getTermId()) {
            this.lastTerm = null;
        }
        this.selectTerm();
    }

    public getTerm(termId: number) {
        return this.termMap[termId];
    }

    public setOnData(cb: CallableFunction) {
        this.onDataCb = cb;
    }

    public setOnClickClose(cb: CallableFunction) {
        this.onClickClose = cb;
    }

    public setOndblclickCb(cb: CallableFunction) {
        this.ondblclickCb = cb;
    }

    public changeState(termId: number, state: TerminalState) {
        const term = this.termMap[termId];
        if (!term) {
            return;
        }
        const nav = term.getNav();
        term.changeState(state);
        nav.changeStateIcon(StateIcon[state]);
    }

    public getCurrentTerm() {
        return this.lastTerm;
    }

    private onNavClick(termId: number) {
        const term = this.termMap[termId];
        if (!term) {
            return;
        }
        if (this.lastTerm) {
            this.lastTerm.unFocus();
        }
        term.focus();
        this.lastTerm = term;
    }

    private createNav(title: string, termId: number): Nav {
        const nav = new Nav(title, this.navBar);
        nav.init();
        nav.on("click", () => {
            this.onNavClick(termId);
        });
        nav.on("close", () => {
            this.onClickClose(termId);
        });
        nav.on("dbclick", this.ondblclickCb);
        return nav;
    }

    private selectTerm() {
        if (this.lastTerm) {
            return;
        }
        let termId;
        for (termId in this.termMap) {
            break;
        }
        if (!termId) {
            return;
        }
        this.onNavClick(parseInt(termId, 10));
    }
}
