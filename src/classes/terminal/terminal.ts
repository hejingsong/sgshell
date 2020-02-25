import { TerminalState } from "../defines";
import Nav from "../nav";

abstract class CTerminal {
    protected termId: number;
    protected nav: Nav;
    protected state: TerminalState;

    public constructor() {
        this.termId = 0;
        this.nav = null;
    }

    public create(termId: number, nav: Nav) {
        this.termId = termId;
        this.nav = nav;
    }

    public getTermId() {
        return this.termId;
    }

    public getNav(): Nav {
        return this.nav;
    }

    public changeState(state: TerminalState) {
        this.state = state;
    }

    public isLogin(): boolean {
        return this.state !== TerminalState.FAILURE;
    }

    public abstract onResize(): void;
    public abstract destory(): void;
    public abstract write(msg: string): void;
    public abstract setOnDataCb(cb: CallableFunction): void;
    public abstract focus(): void;
    public abstract unFocus(): void;
    public abstract size(): number[];
    public abstract getSelection(): string;
    public abstract pasteText(text: string): void;
}

export default CTerminal;
