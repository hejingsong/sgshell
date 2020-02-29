import { View } from "./view";

export class Model {
    private view: View;
    private sessions: any[];

    public constructor() {
        this.sessions = null;
        this.view = new View();
        this.view.setAddFun((data: any) => {
            return this.onAddSession(data);
        });
        this.view.setConfigFun((oldData: any, data: any) => {
            return this.onConfigSession(oldData, data);
        });
        this.view.setDelFun((data: any) => {
            return this.onDelSession(data);
        });
    }

    public setSessions(list: any[]) {
        this.sessions = list;
        this.view.createList(list);
    }

    public getSessions() {
        return this.sessions;
    }

    public openDialog() {
        this.view.open();
    }

    public setConfigModel(model: any) {
        this.view.setConfigModel(model);
    }

    public setConfirmFun(cb: CallableFunction) {
        this.view.setConfirmFun(cb);
    }

    public setDbClickFun(cb: CallableFunction) {
        this.view.setDbClickFun(cb);
    }

    private onAddSession(data: any) {
        const idx = this.findIndex(data);
        if (idx !== -1) {
            return false;
        }
        this.sessions.push(data);
        return true;
    }

    private onConfigSession(oldData: any, data: any) {
        const idx = this.findIndex(oldData);
        if (idx === -1) {
            return false;
        }
        if (oldData.name !== data.name) {
            const newIdx = this.findIndex(data);
            if (newIdx !== -1) {
                return false;
            }
        }
        this.sessions[idx] = data;
        return true;
    }

    private onDelSession(data: any) {
        const idx = this.findIndex(data);
        if (idx === -1) {
            return false;
        }
        this.sessions.splice(idx, 1);
        return true;
    }

    private findIndex(data: any): number {
        let idx;
        for (idx in this.sessions) {
            const item = this.sessions[idx];
            if (item.name === data.name) {
                return parseInt(idx, 10);
            }
        }
        return -1;
    }
}
