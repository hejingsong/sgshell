import { DialogType } from "../type";
import { View } from "./view";

export class Model {
    private view: View;

    public constructor() {
        this.view = new View();
    }

    public open(type: DialogType, title: string, message: string, zIndex: number) {
        this.view.open(type, title, message, zIndex);
    }
}
