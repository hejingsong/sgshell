import Dialog from "@/view/base/Dialog";
import SgLiElement from "@/view/session/SgLiElement";

export default class View extends Dialog {
    private addBtn: HTMLButtonElement;
    private confBtn: HTMLButtonElement;
    private delBtn: HTMLButtonElement;
    private listUl: HTMLUListElement;
    private confirmBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private showList: any[];
    private activeLi: SgLiElement;

    public init(data: any) {
        if (!this.initialized) {
            this.eventMgr.add("confirm", data.confirm);
            this.eventMgr.add("error", data.error);
            this.eventMgr.add("add", data.add);
            this.eventMgr.add("config", data.config);
            this.eventMgr.add("del", data.del);
        }
        this.showList = data.list;
    }

    public initUI() {
        super.initUI();
        this.boxEle = document.createElement("div");
        this.headEle = document.createElement("div");

        const titleSpan = document.createElement("span");

        const bodyEle = document.createElement("div");
        const optEle = document.createElement("div");
        const addBtn = document.createElement("button");
        const addImg = document.createElement("img");
        const confBtn = document.createElement("button");
        const confImg = document.createElement("img");
        const delBtn = document.createElement("button");
        const delImg = document.createElement("img");

        const listEle = document.createElement("div");
        const listUl = document.createElement("ul");

        const bottomEle = document.createElement("div");
        const confirmBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        this.boxEle.className = "session-box";

        this.headEle.className = "session-header";
        titleSpan.innerHTML = "会话列表";

        bodyEle.className = "session-body";
        optEle.className = "session-option";
        addBtn.className = "add";
        addImg.src = "./img/add.png";
        addImg.alt = "添加";
        confBtn.className = "config";
        confImg.src = "./img/config.png";
        confImg.alt = "配置";
        delBtn.className = "del";
        delImg.src = "./img/close.png";
        delImg.alt = "删除";
        confirmBtn.innerHTML = "确定";
        cancelBtn.innerHTML = "取消";

        listEle.className = "session-list";

        bottomEle.className = "session-bottom";
        confirmBtn.className = "session-confirm";
        cancelBtn.className = "session-cancel";

        addBtn.append(addImg);
        confBtn.append(confImg);
        delBtn.append(delImg);
        listEle.append(listUl);
        bottomEle.append(confirmBtn, cancelBtn);

        this.headEle.append(titleSpan, this.closeBtn);
        optEle.append(addBtn, confBtn, delBtn);
        bodyEle.append(optEle, listEle, bottomEle);
        this.boxEle.append(this.headEle, bodyEle);
        this.markEle.append(this.boxEle);
        this.parentEle.append(this.markEle);

        this.addBtn = addBtn;
        this.confBtn = confBtn;
        this.delBtn = delBtn;
        this.listUl = listUl;
        this.confirmBtn = confirmBtn;
        this.cancelBtn = cancelBtn;

        this.initEvent();
    }

    protected initEvent() {
        this.addBtn.onclick = () => {
            this.eventMgr.emit("add");
        };
        this.confBtn.onclick = () => {
            const node = this.getActiveNode();
            if (!node) {
                this.eventMgr.emit("error", {title: "错误", message: "请选择节点"});
                return;
            }
            this.eventMgr.emit("config", node.data);
        };
        this.delBtn.onclick = () => {
            const node = this.getActiveNode();
            if (!node) {
                this.eventMgr.emit("error", {title: "错误", message: "请选择节点"});
                return;
            }
            this.eventMgr.emit("del", node.data);
        };
        this.confirmBtn.onclick = () => {
            const node = this.getActiveNode();
            if (!node) {
                this.eventMgr.emit("error", {title: "错误", message: "请选择节点"});
                return;
            }
            this.eventMgr.emit("confirm", node.data);
        };
        this.cancelBtn.onclick = () => {
            this.close();
        };
        super.enableMoveable();
    }

    protected onClose() {
    }

    protected cleanData() {
        this.createList(this.showList);
    }

    private getActiveNode(): SgLiElement {
        return this.activeLi;
    }

    private createList(list: any[]) {
        while (this.listUl.hasChildNodes()) {
            this.listUl.removeChild(this.listUl.firstChild);
        }
        this.activeLi = null;
        for (const item of list) {
            const li = new SgLiElement();
            li.init(item.name, item.host, item.port, item);
            li.ele.onclick = () => {
                if (this.activeLi) {
                    this.activeLi.setUnActive();
                }
                this.activeLi = li;
                li.setActive();
            };
            li.ele.ondblclick = () => {
                this.eventMgr.emit("confirm", li.data);
            };
            li.attach(this.listUl);
        }
    }
}
