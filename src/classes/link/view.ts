import { error, incrZIndex } from "../../util/helper";
import { moveBox } from "../defines";

export class View {
    private parent: HTMLElement;
    private mask: HTMLElement;
    private box: HTMLElement;
    private header: HTMLElement;
    private hostInput: HTMLInputElement;
    private portInput: HTMLInputElement;
    private userInput: HTMLInputElement;
    private passInput: HTMLInputElement;
    private passRadio: HTMLInputElement;
    private keyInput: HTMLInputElement;
    private onConfirmFun: CallableFunction;
    private keyLine: HTMLElement;

    public constructor() {
        const parents = document.getElementsByTagName("body");
        this.parent = parents[0];
        this.init();
    }

    public open(onConfirmFun: CallableFunction) {
        const zIndex = incrZIndex();
        this.mask.style.zIndex = zIndex.toString();
        this.mask.style.display = "block";
        this.hostInput.value = "";
        this.portInput.value = "";
        this.userInput.value = "";
        this.passInput.value = "";
        this.passRadio.checked = true;
        this.keyInput.value = "";
        this.onConfirmFun = onConfirmFun;
        this.keyLine.style.display = "none";
    }

    public close() {
        this.mask.style.display = "none";
    }

    private init() {
        this.initMask();
        this.initBox();
        this.initHeader();
        this.initBody();
    }

    private initMask() {
        this.mask = document.getElementsByClassName("mask")[0] as HTMLElement;
    }

    private initBox() {
        this.box = document.getElementsByClassName("link-box")[0] as HTMLElement;
    }

    private initHeader() {
        this.header = document.getElementsByClassName("link-header")[0] as HTMLElement;
        const closeImgBtn = this.header.getElementsByTagName("img")[0];
        closeImgBtn.onclick = () => {
            this.close();
        };

        this.header.addEventListener("mousedown", (evt) => {
            moveBox(this.header, this.box, this.parent, evt);
        });
    }

    private initBody() {
        this.hostInput = document.getElementsByClassName("link-host")[0] as HTMLInputElement;
        this.portInput = document.getElementsByClassName("link-port")[0] as HTMLInputElement;
        this.userInput = document.getElementsByClassName("link-user")[0] as HTMLInputElement;
        this.passInput = document.getElementsByClassName("link-passwd")[0] as HTMLInputElement;
        this.passRadio = document.getElementsByName("link-loginType")[0] as HTMLInputElement;
        this.keyInput = document.getElementsByClassName("link-key")[0] as HTMLInputElement;
        this.keyLine = document.getElementsByClassName("key-input-line")[0] as HTMLElement;
        const confirmBtn = document.getElementsByClassName("link-confirm")[0] as HTMLElement;
        const cancelBtn = document.getElementsByClassName("link-cancel")[0] as HTMLElement;
        const keyRadio = document.getElementsByName("link-loginType")[1] as HTMLInputElement;
        const passLine = document.getElementsByClassName("pass-input-line")[0] as HTMLElement;
        const selectKey = this.keyLine.getElementsByClassName("link-select-key")[0] as HTMLButtonElement;
        const fileInput = this.keyLine.getElementsByClassName("link-key-file")[0] as HTMLInputElement;

        this.keyInput.disabled = true;

        selectKey.onclick = () => {
            fileInput.click();
        };

        fileInput.onchange = () => {
            this.keyInput.value = fileInput.value;
        };

        keyRadio.onclick = () => {
            passLine.style.display = "block";
            this.keyLine.style.display = "block";
        };

        this.passRadio.onclick = () => {
            this.keyLine.style.display = "none";
            passLine.style.display = "block";
        };

        confirmBtn.onclick = () => {
            const host = this.hostInput.value;
            const port = parseInt(this.portInput.value, 10);
            const user = this.userInput.value;
            const passwd = this.passInput.value;
            const type = this.passRadio.checked ? 1 : 2;
            const key = this.keyInput.value;
            if (host === "" || port < 0 || port > 65535 || user === "") {
                error("输入错误", "输入不合法");
                return;
            }
            if ((type === 2) && (key === "")) {
                error("输入错误", "输入不合法");
                return;
            }
            this.onConfirmFun({
                host,
                port,
                user,
                passwd,
                type,
                key,
            });
        };

        cancelBtn.onclick = () => {
            this.close();
        };
    }
}
