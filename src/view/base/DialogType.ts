enum DialogType {
    TIP = 1,
    WARN = 2,
    ERR = 3,
    OTHER = 4
}

const DialogTypeImg: { [key: number]: string} = {
    [DialogType.TIP]: "./img/true.png",
    [DialogType.WARN]: "./img/warning.png",
    [DialogType.ERR]: "./img/false.png"
};

export {
    DialogType,
    DialogTypeImg
};
