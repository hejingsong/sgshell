import { moveBox } from "../../defines";
import { DialogIcon, DialogType } from "../type";

export class View {
    private title: HTMLElement;
    private message: HTMLElement;
    private mask: HTMLElement;
    private messageIcon: HTMLImageElement;
    private confirmBtn: HTMLButtonElement;

    public constructor() {
        const parent = document.getElementsByTagName("body")[0] as HTMLElement;
        const box = document.getElementsByClassName("message-box")[1] as HTMLElement;
        const header = box.getElementsByClassName("message-header")[0] as HTMLElement;
        const body = box.getElementsByClassName("message-body")[0] as HTMLElement;
        const bottom = box.getElementsByClassName("message-bottom")[0] as HTMLElement;
        const cancelBtn = bottom.getElementsByClassName("message-cancel")[0] as HTMLElement;
        const confirmBtn = bottom.getElementsByClassName("message-confirm")[0] as HTMLButtonElement;
        const closeBtn = header.getElementsByTagName("img")[0];
        const icon = body.getElementsByClassName("message-icon")[0] as HTMLImageElement;
        closeBtn.onclick = () => {
            this.close();
        };
        cancelBtn.onclick = () => {
            this.close();
        };
        header.addEventListener("mousedown", (evt) => {
            moveBox(header, box, parent, evt);
        });
        this.mask = document.getElementsByClassName("mask")[2] as HTMLElement;
        this.title = header.getElementsByTagName("span")[0] as HTMLElement;
        this.message = body.getElementsByTagName("span")[0] as HTMLElement;
        this.messageIcon = icon;
        this.confirmBtn = confirmBtn;
    }

    public open(type: DialogType, title: string, message: string, confirmCb: CallableFunction, zIndex: number) {
        this.title.innerHTML = title;
        this.message.innerHTML = message;
        this.messageIcon.src = DialogIcon[type];
        this.mask.style.zIndex = zIndex.toString();
        this.mask.style.display = "block";
        this.confirmBtn.onclick = () => {
            if (confirmCb()) {
                this.close();
            }
        };
    }

    public close() {
        this.mask.style.display = "none";
    }
}
