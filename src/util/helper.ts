import { Model as ConfirmModel } from "../classes/dialog/confirm/model";
import { Model as DialogModel } from "../classes/dialog/tip/model";
import { DialogType } from "../classes/dialog/type";
const dialogModel: DialogModel = new DialogModel();
const confirmModel: ConfirmModel = new ConfirmModel();

let zIndex = 1000;

export function success(title: string, message: string) {
    zIndex++;
    dialogModel.open(DialogType.INFO, title, message, zIndex);
}

export function warning(title: string, message: string) {
    zIndex++;
    dialogModel.open(DialogType.WARNING, title, message, zIndex);
}

export function error(title: string, message: string) {
    zIndex++;
    dialogModel.open(DialogType.ERROR, title, message, zIndex);
}

export function confirmSuccess(title: string, message: string, confirmCb: CallableFunction) {
    zIndex++;
    confirmModel.open(DialogType.INFO, title, message, confirmCb, zIndex);
}

export function confirmWarning(title: string, message: string, confirmCb: CallableFunction) {
    zIndex++;
    confirmModel.open(DialogType.WARNING, title, message, confirmCb, zIndex);
}

export function confirmError(title: string, message: string, confirmCb: CallableFunction) {
    zIndex++;
    confirmModel.open(DialogType.ERROR, title, message, confirmCb, zIndex);
}

export function incrZIndex() {
    return ++zIndex;
}
