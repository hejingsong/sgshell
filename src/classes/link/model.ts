import { View } from "./view";

export class Model {
    public host: string;
    public port: number;
    public username: string;
    public password: string;
    public loginType: number;
    public key: string;
    public cb: CallableFunction;

    private view: View;

    public constructor() {
        this.host = "";
        this.port = 0;
        this.username = "";
        this.password = "";
        this.loginType = 0;
        this.key = "";
        this.view = null;
        this.cb = null;
    }

    public setConfirmCb(cb: CallableFunction) {
        this.cb = cb;
    }

    public openDialog() {
        if (!this.view) {
            this.view = new View();
        }
        this.view.open((data: any) => {
            this.onConfirm(data);
        });
    }

    public onConfirm(data: any) {
        this.host = data.host;
        this.port = data.port;
        this.username = data.user;
        this.password = data.passwd;
        this.loginType = data.type;
        this.key = data.key;
        this.cb();
    }

    public closeDialog() {
        this.view.close();
    }
}
