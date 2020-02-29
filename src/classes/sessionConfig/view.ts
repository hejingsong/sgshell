import { error, incrZIndex } from "../../util/helper";
import { moveBox } from "../defines";

export class View {
    private parent: HTMLElement;
    private mask: HTMLElement;
    private box: HTMLElement;
    private header: HTMLElement;
    private titleElem: HTMLElement;
    private passRadio: HTMLInputElement;
    private keyRadio: HTMLInputElement;
    private passLine: HTMLElement;
    private keyLine: HTMLElement;
    private onConfirmFun: CallableFunction;
    private nameInput: HTMLInputElement;
    private hostInput: HTMLInputElement;
    private portInput: HTMLInputElement;
    private userInput: HTMLInputElement;
    private keyInput: HTMLInputElement;
    private passInput: HTMLInputElement;

    public constructor() {
        const parents = document.getElementsByTagName("body");
        this.onConfirmFun = null;
        this.parent = parents[0];
        this.init();
    }

    public open(title: string) {
        const zIndex = incrZIndex();
        this.mask.style.display = "block";
        this.mask.style.zIndex = zIndex.toString();
        this.titleElem.innerHTML = title;
        this.passRadio.checked = true;
        this.passLine.style.display = "block";
        this.keyLine.style.display = "none";
    }

    public close() {
        this.mask.style.display = "none";
        this.clean();
    }

    public setConfirmFun(cb: CallableFunction) {
        this.onConfirmFun = cb;
    }

    public setData(data: any) {
        if (data.key) {
            this.keyRadio.checked = true;
            this.passRadio.checked = false;
            this.passLine.style.display = "block";
            this.keyLine.style.display = "block";
        } else {
            this.passLine.style.display = "block";
            this.keyLine.style.display = "none";
            this.passRadio.checked = true;
            this.keyRadio.checked = false;
        }
        this.nameInput.value = data.name;
        this.hostInput.value = data.host;
        this.portInput.value = data.port;
        this.userInput.value = data.user;
        this.keyInput.value = data.key;
        this.passInput.value = data.passwd;
    }

    private init() {
        this.mask = document.getElementsByClassName("mask")[5] as HTMLElement;
        this.box = document.getElementsByClassName("session-config-box")[0] as HTMLElement;
        this.initHeader();
        this.initBody();
    }

    private initHeader() {
        this.header = this.box.getElementsByClassName("header")[0] as HTMLElement;
        this.titleElem  = this.header.getElementsByTagName("span")[0] as HTMLElement;
        const closeImgBtn = this.header.getElementsByTagName("img")[0];
        closeImgBtn.onclick = () => {
            this.close();
        };

        this.header.addEventListener("mousedown", (evt) => {
            moveBox(this.header, this.box, this.parent, evt);
        });
    }

    private initBody() {
        const body = this.box.getElementsByClassName("body")[0] as Element;
        const nameInput = body.getElementsByClassName("session-name")[0] as HTMLInputElement;
        const hostInput = body.getElementsByClassName("link-host")[0] as HTMLInputElement;
        const portInput = body.getElementsByClassName("link-port")[0] as HTMLInputElement;
        const userInput = body.getElementsByClassName("link-user")[0] as HTMLInputElement;
        const passwdType = body.getElementsByClassName("type-passwd")[0] as HTMLInputElement;
        const keyType = body.getElementsByClassName("type-key")[0] as HTMLInputElement;
        const keyInput = body.getElementsByClassName("link-key")[0] as HTMLInputElement;
        const keyFile = body.getElementsByClassName("link-key-file")[0] as HTMLInputElement;
        const keyFileBtn = body.getElementsByClassName("link-select-key")[0] as HTMLButtonElement;
        const passInput = body.getElementsByClassName("link-passwd")[0] as HTMLInputElement;
        const confirmBtn = body.getElementsByClassName("confirm")[0] as HTMLButtonElement;
        const cancelBtn = body.getElementsByClassName("cancel")[0] as HTMLButtonElement;
        const keyLine = body.getElementsByClassName("key-input-line")[0] as HTMLElement;
        const passLine = body.getElementsByClassName("pass-input-line")[0] as HTMLElement;

        keyInput.disabled = true;

        keyFileBtn.onclick = () => {
            keyFile.click();
        };

        keyFile.onchange = () => {
            keyInput.value = keyFile.value;
        };

        passwdType.onclick = () => {
            keyLine.style.display = "none";
            passLine.style.display = "block";
        };

        keyType.onclick = () => {
            keyLine.style.display = "block";
            passLine.style.display = "block";
        };

        cancelBtn.onclick = () => {
            this.close();
        };

        confirmBtn.onclick = () => {
            const name = nameInput.value;
            const host = hostInput.value;
            const port = parseInt(portInput.value, 10);
            const user = userInput.value;
            const passwd = passInput.value;
            const type = passwdType.checked ? 1 : 2;
            const key = keyInput.value;

            this.onConfirmFun({
                name,
                host,
                port,
                user,
                passwd,
                type,
                key,
            });
        };

        this.passRadio = passwdType;
        this.passLine = passLine;
        this.keyLine = keyLine;
        this.nameInput = nameInput;
        this.hostInput = hostInput;
        this.portInput = portInput;
        this.keyInput = keyInput;
        this.userInput = userInput;
        this.passInput = passInput;
        this.keyRadio = keyType;
    }

    private clean() {
        this.passRadio.checked = true;
        this.passLine.style.display = "block";
        this.keyLine.style.display = "none";
        this.nameInput.value = "";
        this.hostInput.value = "";
        this.portInput.value = "";
        this.userInput.value = "";
        this.keyInput.value = "";
        this.passInput.value = "";
    }
}
