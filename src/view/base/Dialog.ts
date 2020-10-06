import Event from "@/util/event";
import { moveBox } from "@/util/UIHelper";
import { DialogType } from "@/view/base/DialogType";

export default abstract class Dialog {
    protected parentEle: HTMLElement;
    protected boxEle: HTMLElement;
    protected headEle: HTMLElement;
    protected markEle: HTMLElement;
    protected closeBtn: HTMLImageElement;
    protected type: DialogType;
    protected initialized: boolean;
    protected eventMgr: Event;

    public constructor(parentEle: HTMLElement, type: DialogType) {
        this.parentEle = parentEle;
        this.type = type;
        this.initialized = false;
        this.eventMgr = new Event();
    }

    public on(name: string, cb: CallableFunction) {
        this.eventMgr.add(name, cb);
    }

    public show(zIndex: string) {
        if (!this.initialized) {
            this.initUI();
            this.initialized = true;
        }

        this.markEle.style.zIndex = zIndex;
        this.markEle.style.display = "block";
        this.cleanData();
    }

    public initUI(): void {
        this.markEle = document.createElement("div");
        this.markEle.className = "mask";
        this.markEle.style.display = "none";
        this.closeBtn = document.createElement("img");
        this.closeBtn.src = "./img/close.png";
        this.closeBtn.className = "close-btn";
        this.closeBtn.onclick = () => {
            this.close();
        };
    }

    public close() {
        this.onClose();
        this.markEle.style.display = "none";
    }

    public enableMoveable() {
        this.headEle.addEventListener("mousedown", (event: MouseEvent) => {
            moveBox(this.headEle, this.boxEle, this.parentEle, event);
        });
    }

    public abstract init(data: any): void;
    protected abstract initEvent(): void;
    protected abstract onClose(): void;
    protected abstract cleanData(): void;
}
