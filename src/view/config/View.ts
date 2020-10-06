import Dialog from "@/view/base/Dialog";

export default class View extends Dialog {
    private sessionInput: HTMLInputElement;
    private hostInput: HTMLInputElement;
    private portInput: HTMLInputElement;
    private userInput: HTMLInputElement;
    private pwdInput: HTMLInputElement;
    private keyInput: HTMLInputElement;
    private methodPwdInput: HTMLInputElement;
    private methodKeyInput: HTMLInputElement;
    private fileBtn: HTMLButtonElement;
    private fileInput: HTMLInputElement;
    private confirmBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private pwdBoxEle: HTMLElement;
    private keyBoxEle: HTMLElement;
    private confData: any;

    public init(data: any = {}) {
        if (!this.initialized) {
            this.eventMgr.add("confirm", data.confirm);
            delete data.confirm;
        }
        this.confData = data;
    }

    public initUI() {
        super.initUI();
        this.boxEle = document.createElement("div");
        this.headEle = document.createElement("div");
        const titleSpan = document.createElement("span");
        const bodyEle = document.createElement("div");
        const sessionEle = document.createElement("div");
        const sessionSpan = document.createElement("span");
        const sessionInput = document.createElement("input");
        const hostEle = document.createElement("div");
        const hostSpan = document.createElement("span");
        const hostInput = document.createElement("input");
        const portSpan = document.createElement("span");
        const portInput = document.createElement("input");
        const userEle = document.createElement("div");
        const userSpan = document.createElement("span");
        const userInput = document.createElement("input");
        const methodEle = document.createElement("div");
        const methodSpan = document.createElement("span");
        const methodPwdInput = document.createElement("input");
        const methodKeyInput = document.createElement("input");
        const methodPwdSpan = document.createElement("span");
        const methodKeySpan = document.createElement("span");
        const keyEle = document.createElement("div");
        const keySpan = document.createElement("span");
        const keyInput = document.createElement("input");
        const fileInput = document.createElement("input");
        const fileBtn = document.createElement("button");
        const pwdEle = document.createElement("div");
        const pwdSpan = document.createElement("span");
        const pwdInput = document.createElement("input");
        const bottomEle = document.createElement("div");
        const confirmBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        this.boxEle.className = "session-config-box";
        this.headEle.className = "header";

        bodyEle.className = "body";
        sessionEle.className = "input-line";
        sessionSpan.innerHTML = "会话名";
        sessionInput.className = "session-name";
        sessionInput.type = "text";
        sessionInput.placeholder = "会话名";

        hostEle.className = "input-line";
        hostSpan.innerHTML = "主机";
        hostInput.className = "link-host";
        hostInput.type = "text";
        hostInput.style.width = "250px";
        hostInput.placeholder = "主机";
        portSpan.innerHTML = "端口";
        portInput.className = "link-port";
        portInput.type = "text";
        portInput.style.width = "50px";
        portInput.placeholder = "端口";

        userEle.className = "input-line";
        userSpan.innerHTML = "用户名";
        userInput.className = "link-user";
        userInput.type = "text";
        userInput.placeholder = "用户名";

        methodEle.className = "input-line";
        methodSpan.innerHTML = "方法";
        methodPwdInput.className = "type-passwd";
        methodPwdInput.type = "radio";
        methodPwdInput.name = "link-loginType";
        methodPwdInput.value = "1";
        methodPwdSpan.innerHTML = "密码";
        methodKeyInput.className = "type-key";
        methodKeyInput.type = "radio";
        methodKeyInput.name = "link-loginType";
        methodKeyInput.value = "2";
        methodKeySpan.innerHTML = "密钥";

        keyEle.className = "input-line key-input-line";
        keySpan.innerHTML = "密钥";
        keyInput.className = "link-key";
        keyInput.type = "text";
        keyInput.placeholder = "密钥";
        fileInput.className = "link-key-file";
        fileInput.type = "file";
        fileInput.style.display = "none";
        fileBtn.className = "link-select-key key-btn";
        fileBtn.innerHTML = "...";

        pwdEle.className = "input-line pass-input-line";
        pwdSpan.innerHTML = "密码";
        pwdInput.className = "link-passwd";
        pwdInput.type = "password";
        pwdInput.placeholder = "密码";

        bottomEle.className = "bottom-line";
        confirmBtn.className = "confirm";
        cancelBtn.className = "cancel";
        confirmBtn.innerHTML = "确认";
        cancelBtn.innerHTML = "取消";

        this.headEle.append(titleSpan, this.closeBtn);
        sessionEle.append(sessionSpan, sessionInput);
        hostEle.append(hostSpan, hostInput, portSpan, portInput);
        userEle.append(userSpan, userInput);
        methodEle.append(methodSpan, methodPwdInput, methodPwdSpan, methodKeyInput, methodKeySpan);
        keyEle.append(keySpan, keyInput, fileInput, fileBtn);
        pwdEle.append(pwdSpan, pwdInput);
        bottomEle.append(confirmBtn, cancelBtn);
        bodyEle.append(sessionEle, hostEle, userEle, methodEle, keyEle, pwdEle, bottomEle);
        this.boxEle.append(this.headEle, bodyEle);
        this.markEle.append(this.boxEle);
        this.parentEle.append(this.markEle);

        this.sessionInput = sessionInput;
        this.hostInput = hostInput;
        this.portInput = portInput;
        this.userInput = userInput;
        this.methodPwdInput = methodPwdInput;
        this.methodKeyInput = methodKeyInput;
        this.pwdInput = pwdInput;
        this.keyInput = keyInput;
        this.confirmBtn = confirmBtn;
        this.cancelBtn = cancelBtn;
        this.pwdBoxEle = pwdEle;
        this.keyBoxEle = keyEle;
        this.fileBtn = fileBtn;
        this.fileInput = fileInput;

        this.initEvent();
    }

    protected initEvent() {
        this.confirmBtn.onclick = () => {
            const idx = (this.confData.idx >= 0) ? this.confData.idx : -1;
            const name = this.sessionInput.value;
            const host = this.hostInput.value;
            const port = parseInt(this.portInput.value, 10);
            const user = this.userInput.value;
            const passwd = this.pwdInput.value;
            const type = this.methodPwdInput.checked ? 1 : 2;
            const key = this.keyInput.value;
            if (name === "" || host === "" || !port || port <= 0 || port > 65535 || user === "") {
                this.eventMgr.emit("error", "输入错误", "输入不合法");
                return;
            }
            if ((type === 2) && (key === "")) {
                this.eventMgr.emit("error", "输入错误", "输入不合法");
                return;
            }
            const data = {name, host, port, user, passwd, type, key, idx};
            this.close();
            this.eventMgr.emit("confirm", data);
        };
        this.cancelBtn.onclick = () => {
            this.close();
        };
        this.methodPwdInput.onclick = () => {
            this.pwdBoxEle.style.display = "block";
            this.keyBoxEle.style.display = "none";
        };
        this.methodKeyInput.onclick = () => {
            this.pwdBoxEle.style.display = "block";
            this.keyBoxEle.style.display = "block";
        };
        this.fileBtn.onclick = () => {
            this.fileInput.click();
        };
        this.fileInput.onchange = () => {
            this.keyInput.value = this.fileInput.value;
        };
        super.enableMoveable();
    }

    protected onClose() {
    }

    protected cleanData() {
        const type = this.confData.type || 1;
        const port = (this.confData.port) ? this.confData.port.toString() : "";
        this.sessionInput.value = this.confData.name || "";
        this.hostInput.value = this.confData.host || "";
        this.portInput.value = port;
        this.userInput.value = this.confData.user || "";
        this.pwdInput.value = this.confData.passwd || "";
        this.keyInput.value = this.confData.key || "";
        if (type === 1) {
            this.methodPwdInput.checked = true;
            this.methodKeyInput.checked = false;
            this.methodPwdInput.click();
        } else {
            this.methodKeyInput.checked = true;
            this.methodPwdInput.checked = false;
            this.methodKeyInput.click();
        }
    }
}
