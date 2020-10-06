import Dialog from "@/view/base/Dialog";

export default class View extends Dialog {
    private hostInput: HTMLInputElement;
    private portInput: HTMLInputElement;
    private userInput: HTMLInputElement;
    private pwdInput: HTMLInputElement;
    private keyInput: HTMLInputElement;
    private methodPwdInput: HTMLInputElement;
    private methodKeyInput: HTMLInputElement;
    private keyBtn: HTMLButtonElement;
    private fileInput: HTMLInputElement;
    private confirmBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private pwdBoxEle: HTMLElement;
    private keyBoxEle: HTMLElement;

    public init(data: any) {
        if (!this.initialized) {
            this.eventMgr.add("error", data.error);
            this.eventMgr.add("confirm", data.confirm);
        }
    }

    public initUI() {
        super.initUI();
        this.boxEle = document.createElement("div");
        this.headEle = document.createElement("div");

        const titleSpan = document.createElement("span");

        const bodyEle = document.createElement("div");
        const hostBoxEle = document.createElement("div");
        const hostSpan = document.createElement("span");
        const portSpan = document.createElement("span");
        const hostInput = document.createElement("input");
        const portInput = document.createElement("input");

        const userBoxEle = document.createElement("div");
        const userSpan = document.createElement("span");
        const userInput = document.createElement("input");

        const methodBoxEle = document.createElement("div");
        const methodSpan = document.createElement("span");
        const methodPwdInput = document.createElement("input");
        const methodPwdSpan = document.createElement("span");
        const methodKeyInput = document.createElement("input");
        const methodKeySpan = document.createElement("span");

        const keyBoxEle = document.createElement("div");
        const keySpan = document.createElement("span");
        const keyInput = document.createElement("input");
        const fileInput = document.createElement("input");
        const keyBtn = document.createElement("button");

        const pwdBoxEle = document.createElement("div");
        const pwdSpan = document.createElement("span");
        const pwdInput = document.createElement("input");

        const bottomEle = document.createElement("div");
        const confirmBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        titleSpan.innerHTML = "快速连接";
        this.boxEle.className = "link-box";
        this.headEle.className = "link-header";
        bodyEle.className = "link-body";
        hostBoxEle.className = "input-line";
        hostSpan.innerHTML = "主机";
        portSpan.innerHTML = "端口";
        portSpan.style.width = "35px";
        hostInput.type = "text";
        hostInput.className = "link-host";
        hostInput.style.width = "250px";
        hostInput.placeholder = "主机";
        hostInput.autofocus = true;
        portInput.className = "link-port";
        portInput.type = "text";
        portInput.placeholder = "用户名";
        portInput.style.width = "50px";

        userBoxEle.className = "input-line";
        userSpan.innerHTML = "用户名";
        userInput.className = "link-user";
        userInput.type = "text";
        userInput.placeholder = "用户名";

        methodBoxEle.className = "input-line";
        methodSpan.innerHTML = "方法";
        methodPwdInput.type = "radio";
        methodPwdInput.name = "link-loginType";
        methodPwdInput.value = "1";
        methodPwdInput.checked = true;
        methodKeyInput.type = "radio";
        methodKeyInput.name = "link-loginType";
        methodKeyInput.value = "2";
        methodPwdSpan.innerHTML = "密码";
        methodKeySpan.innerHTML = "密钥";

        keyBoxEle.className = "input-line key-input-line";
        keySpan.innerHTML = "密钥";
        keyInput.className = "link-key";
        keyInput.type = "text";
        keyInput.placeholder = "密钥";
        keyInput.readOnly = true;
        fileInput.className = "link-key-file";
        fileInput.type = "file";
        fileInput.style.display = "none";
        keyBtn.className = "link-select-key key-btn";
        keyBtn.innerHTML = "...";

        pwdBoxEle.className = "input-line pass-input-line";
        pwdSpan.innerHTML = "密码";
        pwdInput.className = "link-passwd";
        pwdInput.type = "password";
        pwdInput.placeholder = "密码";

        bottomEle.className = "bottom-line";
        confirmBtn.innerHTML = "确定";
        confirmBtn.className = "link-confirm";
        cancelBtn.className = "link-cancel";
        cancelBtn.innerHTML = "取消";

        keyBoxEle.style.display = "none";

        hostBoxEle.append(hostSpan, hostInput, portSpan, portInput);
        userBoxEle.append(userSpan, userInput);
        methodBoxEle.append(methodSpan, methodPwdInput, methodPwdSpan, methodKeyInput, methodKeySpan);
        keyBoxEle.append(keySpan, keyInput, fileInput, keyBtn);
        pwdBoxEle.append(pwdSpan, pwdInput);
        bottomEle.append(confirmBtn, cancelBtn);

        this.headEle.append(titleSpan, this.closeBtn);
        bodyEle.append(hostBoxEle, userBoxEle, methodBoxEle, pwdBoxEle, keyBoxEle, bottomEle);
        this.boxEle.append(this.headEle, bodyEle);
        this.markEle.append(this.boxEle);
        this.parentEle.append(this.markEle);

        this.hostInput = hostInput;
        this.portInput = portInput;
        this.userInput = userInput;
        this.methodPwdInput = methodPwdInput;
        this.methodKeyInput = methodKeyInput;
        this.pwdInput = pwdInput;
        this.keyInput = keyInput;
        this.confirmBtn = confirmBtn;
        this.cancelBtn = cancelBtn;
        this.pwdBoxEle = pwdBoxEle;
        this.keyBoxEle = keyBoxEle;
        this.keyBtn = keyBtn;
        this.fileInput = fileInput;

        this.initEvent();
    }

    protected initEvent() {
        this.confirmBtn.onclick = () => {
            const host = this.hostInput.value;
            const port = parseInt(this.portInput.value, 10);
            const user = this.userInput.value;
            const passwd = this.pwdInput.value;
            const type = this.methodPwdInput.checked ? 1 : 2;
            const key = this.keyInput.value;
            if (host === "" || !port || port <= 0 || port > 65535 || user === "") {
                this.eventMgr.emit("error", {title: "输入错误", message: "输入不合法"});
                return;
            }
            if ((type === 2) && (key === "")) {
                this.eventMgr.emit("error", {title: "输入错误", message: "输入不合法"});
                return;
            }
            const data = {host, port, user, passwd, type, key};
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
        this.keyBtn.onclick = () => {
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
        this.hostInput.value = "";
        this.portInput.value = "";
        this.userInput.value = "";
        this.pwdInput.value = "";
        this.keyInput.value = "";
        this.methodPwdInput.checked = true;
        this.methodKeyInput.checked = false;
        this.methodPwdInput.click();
    }
}
