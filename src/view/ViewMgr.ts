import ConfigView from "@/view/config/View";
import ConfirmView from "@/view/confirm/View";
import LinkView from "@/view/link/View";
import SessionView from "@/view/session/View";
import TipView from "@/view/tip/View";

import { DialogType } from "@/view/base/DialogType";

const ViewMap: {[key: string]: any} = {
    "tip": [TipView, false],
    "confirm": [ConfirmView, false],
    "link": [LinkView, true],
    "session": [SessionView, true],
    "config": [ConfigView, true]
};

export default class ViewMgr {
    private zIndex: number;
    private viewCaches: any;
    private openedViews: any[];

    public constructor() {
        this.zIndex = 100;
        this.viewCaches = {};
        this.openedViews = [];
    }

    public show(name: string, parentEle: HTMLElement, type: DialogType, data: any) {
        let inst;

        if (!this.viewCaches[name]) {
            const conf = ViewMap[name];
            const mod = conf[0];
            const needCache = conf[1];
            inst = new mod(parentEle, type);
            if (needCache) {
                this.viewCaches[name] = inst;
            }
        } else {
            inst = this.viewCaches[name];
        }
        inst.init(data);
        inst.show((this.zIndex++).toString());
        this.openedViews.push(inst);
        return inst;
    }

    public closeCurrent() {
        const inst = this.openedViews.pop();
        inst.close();
    }

    public isDialogOpen() {
        return this.openedViews.length > 0;
    }
}
