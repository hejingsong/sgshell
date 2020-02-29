import { error, incrZIndex } from "../../util/helper";
import { moveBox } from "../defines";

export class View {
    private parent: HTMLElement;
    private mask: HTMLElement;
    private box: HTMLElement;
    private header: HTMLElement;
    private body: HTMLElement;
    private addBtn: HTMLButtonElement;
    private confBtn: HTMLButtonElement;
    private delBtn: HTMLButtonElement;
    private ulBox: HTMLElement;
    private onConfirmFun: CallableFunction;
    private onAddFun: CallableFunction;
    private onConfigFun: CallableFunction;
    private onDelFun: CallableFunction;
    private onDbClickFun: CallableFunction;
    private configModel: any;
    private activeInfo: {ele: HTMLElement, data: any};

    public constructor() {
        const parents = document.getElementsByTagName("body");
        this.parent = parents[0];
        this.activeInfo = {ele: null, data: null};
        this.init();
    }

    public open() {
        const zIndex = incrZIndex();
        this.mask.style.display = "block";
        this.mask.style.zIndex = zIndex.toString();
    }

    public setConfigModel(model: any) {
        this.configModel = model;
    }

    public setAddFun(cb: CallableFunction) {
        this.onAddFun = cb;
    }

    public setConfigFun(cb: CallableFunction) {
        this.onConfigFun = cb;
    }

    public setDelFun(cb: CallableFunction) {
        this.onDelFun = cb;
    }

    public setConfirmFun(cb: CallableFunction) {
        this.onConfirmFun = cb;
    }

    public setDbClickFun(cb: CallableFunction) {
        this.onDbClickFun = cb;
    }

    public createList(list: any[]) {
        for (const item of list) {
            const li = document.createElement("li");
            const nameSpan = document.createElement("span");
            const hostSpan = document.createElement("span");
            const portSpan = document.createElement("span");

            nameSpan.innerHTML = item.name;
            hostSpan.innerHTML = item.host;
            portSpan.innerHTML = item.port;
            nameSpan.className = "name";
            hostSpan.className = "host";
            portSpan.className = "port";

            li.append(nameSpan, hostSpan, portSpan);

            li.onclick = () => {
                if (this.activeInfo.ele) {
                    this.activeInfo.ele.className = "";
                    this.activeInfo.data = null;
                }
                this.activeInfo.ele = li;
                this.activeInfo.data = item;
                li.className = "active";
            };

            li.ondblclick = () => {
                this.onDbClickFun(item);
            };

            this.ulBox.append(li);
        }
    }

    private init() {
        this.mask = document.getElementsByClassName("mask")[4] as HTMLElement;
        this.box = document.getElementsByClassName("session-box")[0] as HTMLElement;
        this.initHeader();
        this.initBody();
        this.initBottom();
    }

    private initHeader() {
        this.header = document.getElementsByClassName("session-header")[0] as HTMLElement;
        const closeImgBtn = this.header.getElementsByTagName("img")[0];
        closeImgBtn.onclick = () => {
            this.close();
        };

        this.header.addEventListener("mousedown", (evt) => {
            moveBox(this.header, this.box, this.parent, evt);
        });
    }

    private initBody() {
        this.body = document.getElementsByClassName("session-body")[0] as HTMLElement;
        this.addBtn = this.body.getElementsByClassName("add")[0] as HTMLButtonElement;
        this.confBtn = this.body.getElementsByClassName("config")[0] as HTMLButtonElement;
        this.delBtn = this.body.getElementsByClassName("del")[0] as HTMLButtonElement;
        this.ulBox = this.body.getElementsByTagName("ul")[0] as HTMLElement;

        this.addBtn.onclick = () => {
            this.configModel.openDialog("添加会话");
            this.configModel.setConfirmCb((data: any) => {
                const ret = this.onAddFun(data);
                if (!ret) {
                    error("错误", "该会话名称已存在。");
                    return;
                }
                this.createList([data]);
                this.configModel.closeDialog();
            });
        };

        this.confBtn.onclick = () => {
            if (!this.activeInfo.ele) {
                return;
            }

            this.configModel.setConfirmCb((data: any) => {
                const ret = this.onConfigFun(this.activeInfo.data, data);
                if (!ret) {
                    error("错误", "该会话名称已存在。");
                    return;
                }
                this.configActiveInfo(data);
                this.configModel.closeDialog();
            });
            this.configModel.setData(this.activeInfo.data);
            this.configModel.openDialog("配置会话");
        };

        this.delBtn.onclick = () => {
            const ret = this.onDelFun(this.activeInfo.data);
            if (!ret) {
                return;
            }
            this.removeActiveLi();
        };
    }

    private initBottom() {
        const confirmBtn = this.body.getElementsByClassName("session-confirm")[0] as HTMLButtonElement;
        const cancelBtn = this.body.getElementsByClassName("session-cancel")[0] as HTMLButtonElement;
        confirmBtn.onclick = () => {
            if (!this.activeInfo.ele) {
                return;
            }

            this.onConfirmFun(this.activeInfo.data);
        };
        cancelBtn.onclick = () => {
            this.close();
        };
    }

    private close() {
        this.mask.style.display = "none";
    }

    private configActiveInfo(data: any) {
        const ele = this.activeInfo.ele;
        if (!ele) {
            return;
        }
        const nameSpan = ele.getElementsByClassName("name")[0] as HTMLElement;
        const hostSpan = ele.getElementsByClassName("host")[0] as HTMLElement;
        const portSpan = ele.getElementsByClassName("port")[0] as HTMLElement;

        nameSpan.innerHTML = data.name;
        hostSpan.innerHTML = data.host;
        portSpan.innerHTML = data.port;

        this.activeInfo.data = data;
    }

    private removeActiveLi() {
        if (!this.activeInfo.ele) {
            return;
        }
        this.activeInfo.ele.remove();
        this.activeInfo.ele = null;
        this.activeInfo.data = null;
    }
}
