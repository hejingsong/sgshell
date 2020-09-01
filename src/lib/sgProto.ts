const sgCore = require("./sgProto.node");

export class SgProto {
    public constructor(protoFile: string) {
        sgCore.parseFile(protoFile);
    }

    public encode(protoName: string, data: any): ArrayBuffer {
        const code = sgCore.encode(protoName, data);
        return sgCore.pack(code);
    }

    public decode(data: ArrayBuffer): any[] {
        const code = sgCore.unpack(data);
        return sgCore.decode(code);
    }

    public destory() {
        sgCore.destory();
    }
}
