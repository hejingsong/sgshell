export default class Nav {
    private title: string;
    private navElem: HTMLElement;
    private container: HTMLElement;
    private titleElem: HTMLElement;
    private stateElem: HTMLImageElement;
    private closeElem: HTMLImageElement;
    private clickCb: CallableFunction;
    private closeCb: CallableFunction;
    private dblclickCb: CallableFunction;
    private sshData: any;

    public constructor(title: string, container: HTMLElement) {
        this.title = title;
        this.container = container;
        this.navElem = null;
        this.titleElem = null;
        this.stateElem = null;
        this.closeElem = null;
        this.clickCb = null;
        this.closeCb = null;
        this.dblclickCb = null;
        this.sshData = null;
    }

    public init() {
        this.navElem = document.createElement("div");
        this.stateElem = document.createElement("img") as HTMLImageElement;
        this.titleElem = document.createElement("span");
        this.closeElem = document.createElement("img") as HTMLImageElement;

        this.titleElem.innerHTML = this.title;
        this.closeElem.src = "./img/close.png";
        this.stateElem.src = "./img/load.png";

        this.navElem.className = "nav-item";
        this.stateElem.className = "nav-state";
        this.closeElem.className = "nav-close";
        this.titleElem.className = "nav-title";

        this.navElem.append(
            this.stateElem,
            this.titleElem,
            this.closeElem,
        );

        this.navElem.onclick = (event) => {
            event.stopPropagation();
            this.clickCb(this);
        };

        this.navElem.ondblclick = () => {
            event.stopPropagation();
            this.dblclickCb(this.sshData);
        };

        this.closeElem.onclick = () => {
            this.closeCb();
        };

        this.container.append(this.navElem);
    }

    public destory() {
        this.navElem.remove();
    }

    public changeStateIcon(icon: string) {
        this.stateElem.src = icon;
    }

    public setClickCb(cb: CallableFunction) {
        this.clickCb = cb;
    }

    public setCloseCb(cb: CallableFunction) {
        this.closeCb = cb;
    }

    public setOndblclickCb(cb: CallableFunction) {
        this.dblclickCb = cb;
    }

    public setData(data: any) {
        this.sshData = data;
    }

    public focus() {
        this.navElem.className = "nav-item nav-item-active";
    }

    public unFocus() {
        this.navElem.className = "nav-item";
    }
}
