import { View } from "./view";

export class Model {
    private view: View;
    private data: any;

    public constructor() {
        this.view = null;
    }

    public setConfirmCb(cb: CallableFunction) {
        this.view.setConfirmFun(cb);
    }

    public openDialog(title: string) {
        if (!this.view) {
            this.view = new View();
        }
        this.view.open(title);
    }

    public setData(data: any) {
        this.data = data;
        this.view.setData(data);
    }

    public closeDialog() {
        this.view.close();
    }
}
