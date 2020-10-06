import Dialog from "@/view/base/Dialog";
import { DialogTypeImg } from "@/view/base/DialogType";

export default class View extends Dialog {
    private title: string;
    private message: string;
    private cancelBtn: HTMLButtonElement;
    private confirmBtn: HTMLButtonElement;

    public init(data: any) {
        this.title = data.title;
        this.message = data.message;
        this.eventMgr.add("confirm", data.confirm);
    }

    public initUI() {
        super.initUI();
        const titleSpan = document.createElement("span");
        const typeImg = document.createElement("img");
        const msgSpan = document.createElement("span");
        const bodyEle = document.createElement("div");
        const btnLineEle = document.createElement("div");
        this.cancelBtn = document.createElement("button");
        this.confirmBtn = document.createElement("button");
        this.headEle = document.createElement("div");
        this.boxEle = document.createElement("div");

        titleSpan.innerHTML = this.title;
        msgSpan.innerHTML = this.message;
        typeImg.src = DialogTypeImg[this.type];
        this.confirmBtn.innerHTML = "确定";
        this.cancelBtn.innerHTML = "取消";

        this.boxEle.className = "message-box";
        this.headEle.className = "message-header";
        bodyEle.className = "message-body";
        typeImg.className = "message-icon";
        btnLineEle.className = "message-bottom";
        this.confirmBtn.className = "message-confirm";
        this.cancelBtn.className = "message-cancel";

        this.initEvent();

        btnLineEle.append(this.confirmBtn, this.cancelBtn);
        this.headEle.append(titleSpan, this.closeBtn);
        bodyEle.append(typeImg, msgSpan, btnLineEle);
        this.boxEle.append(this.headEle, bodyEle);
        this.markEle.append(this.boxEle);
        this.parentEle.append(this.markEle);
        this.enableMoveable();
    }

    protected onClose(): void {}
    protected cleanData(): void {}

    protected initEvent() {
        this.confirmBtn.onclick = () => {
            this.eventMgr.emit("confirm");
            this.close();
        };
        this.cancelBtn.onclick = () => {
            this.eventMgr.emit("cancel");
            this.close();
        };
    }
}
