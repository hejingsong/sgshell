import Dialog from "@/view/base/Dialog";
import { DialogTypeImg } from "@/view/base/DialogType";

export default class View extends Dialog {
    private title: string;
    private message: string;

    public init(data: any) {
        this.title = data.title;
        this.message = data.message;
    }

    public initUI() {
        super.initUI();
        const titleSpan = document.createElement("span");
        const typeImg = document.createElement("img");
        const msgSpan = document.createElement("span");
        const bodyEle = document.createElement("div");
        this.headEle = document.createElement("div");
        this.boxEle = document.createElement("div");

        titleSpan.innerHTML = this.title;
        msgSpan.innerHTML = this.message;
        typeImg.src = DialogTypeImg[this.type];

        this.boxEle.className = "message-box";
        this.headEle.className = "message-header";
        bodyEle.className = "message-body";
        typeImg.className = "message-icon";

        this.headEle.append(titleSpan, this.closeBtn);
        bodyEle.append(typeImg, msgSpan);
        this.boxEle.append(this.headEle, bodyEle);
        this.markEle.append(this.boxEle);
        this.parentEle.append(this.markEle);
        this.enableMoveable();
    }

    protected onClose(): void {}
    protected cleanData(): void {}
    protected initEvent(): void {}
}
