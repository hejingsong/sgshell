import { moveBox } from "../../defines";
import { DialogType } from "../type";

export class View {
    private title: HTMLElement;
    private message: HTMLElement;
    private mask: HTMLElement;
    private messageIcon: HTMLImageElement;
    private iconMap: any;

    public constructor() {
        const parent = document.getElementsByTagName("body")[0] as HTMLElement;
        const box = document.getElementsByClassName("message-box")[0] as HTMLElement;
        const header = document.getElementsByClassName("message-header")[0] as HTMLElement;
        const body = document.getElementsByClassName("message-body")[0] as HTMLElement;
        const closeBtn = header.getElementsByTagName("img")[0];
        const icon = body.getElementsByClassName("message-icon")[0] as HTMLImageElement;
        closeBtn.onclick = () => {
            this.close();
        };
        header.addEventListener("mousedown", (evt) => {
            moveBox(header, box, parent, evt);
        });
        this.mask = document.getElementsByClassName("mask")[1] as HTMLElement;
        this.title = header.getElementsByTagName("span")[0] as HTMLElement;
        this.message = body.getElementsByTagName("span")[0] as HTMLElement;
        this.messageIcon = icon;
        this.iconMap = {
            [DialogType.INFO]: "./img/true.png",
            [DialogType.WARNING]: "./img/warning.png",
            [DialogType.ERROR]: "./img/false.png",
        };
    }

    public open(type: DialogType, title: string, message: string, zIndex: number) {
        this.title.innerHTML = title;
        this.message.innerHTML = message;
        this.messageIcon.src = this.iconMap[type];
        this.mask.style.display = "block";
        this.mask.style.zIndex = zIndex.toString();
    }

    public close() {
        this.mask.style.display = "none";
    }
}
