import Event from "@/util/event";

export default class Nav {
    private title: string;
    private navElem: HTMLElement;
    private container: HTMLElement;
    private titleElem: HTMLElement;
    private stateElem: HTMLImageElement;
    private closeElem: HTMLImageElement;
    private eventMgr: Event;
    private sshData: any;

    public constructor(title: string, container: HTMLElement) {
        this.title = title;
        this.container = container;
        this.eventMgr = new Event();
        this.navElem = null;
        this.titleElem = null;
        this.stateElem = null;
        this.closeElem = null;
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
            this.eventMgr.emit("click", [this]);
        };

        this.navElem.ondblclick = (event) => {
            event.stopPropagation();
            this.eventMgr.emit("dbclick", [this]);
        };

        this.closeElem.onclick = () => {
            this.eventMgr.emit("close", [this]);
        };

        this.container.append(this.navElem);
    }

    public on(eventName: string, cb: CallableFunction) {
        this.eventMgr.add(eventName, cb);
    }

    public destory() {
        this.navElem.remove();
    }

    public changeStateIcon(icon: string) {
        this.stateElem.src = icon;
    }

    public setData(data: any) {
        this.sshData = data;
    }

    public getData() {
        return this.sshData;
    }

    public focus() {
        this.navElem.className = "nav-item nav-item-active";
    }

    public unFocus() {
        this.navElem.className = "nav-item";
    }
}
