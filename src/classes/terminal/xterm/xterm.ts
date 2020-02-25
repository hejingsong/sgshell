import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import Nav from "../../nav";
import CTerminal from "../terminal";

class XTerm extends CTerminal {
    private fit: FitAddon;
    private term: Terminal;
    private container: HTMLElement;

    public constructor(container: HTMLElement) {
        super();
        this.container = container;
    }

    public create(termId: number, nav: Nav) {
        super.create(termId, nav);
        this.fit = new FitAddon();
        this.term = new Terminal({
            rendererType: "dom",
            rightClickSelectsWord: true,
        });
        this.term.loadAddon(this.fit);
        this.term.open(this.container);
        this.fit.fit();
    }

    public getSize() {
        return [this.term.rows, this.term.cols];
    }

    public onResize() {
        this.fit.fit();
    }

    public destory() {
        this.term = null;
        this.nav.destory();
        this.container.remove();
    }

    public write(msg: string) {
        this.term.write(msg);
    }

    public setOnDataCb(cb: CallableFunction) {
        this.term.onData((data: any) => {
            cb(this, data);
        });
    }

    public focus() {
        this.container.style.zIndex = "2";
        this.term.focus();
        this.nav.focus();
    }

    public unFocus() {
        this.container.style.zIndex = "1";
        this.nav.unFocus();
    }

    public size(): number[] {
        return [this.term.rows, this.term.cols];
    }

    public getSelection() {
        return this.term.getSelection();
    }

    public pasteText(text: string) {
        this.term.paste(text);
    }
}

export default XTerm;
