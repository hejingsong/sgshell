const sgCore = require("./sgProto.node");

export class SgProto {
    public constructor(protoFile: string) {
        sgCore.parseFromFile(protoFile);
    }

    public encode(protoName: string, data: any): ArrayBuffer {
        return sgCore.encode(protoName, data);
    }

    public decode(data: ArrayBuffer): any[] {
        return sgCore.decode(data);
    }

    public destory() {
        sgCore.destory();
    }
}
