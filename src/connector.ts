export enum ConnectorEvent {
    EVT_READ = 1,
    EVT_CLOSE = 2,
    EVT_ERROR = 3,
    EVT_MESSAGE = 4,
}

export enum ConnectorTypeEnum {
    STRING = 1,
    BINARY,
}

export class Connector {
    private wsUrl: string;
    private wsObj: WebSocket;
    private onDataCb: CallableFunction;
    private onOpenCb: CallableFunction;
    private onCloseCb: CallableFunction;
    private onErrorCb: CallableFunction;

    public constructor(
        wsUrl: string,
        openCb: CallableFunction,
        dataCb: CallableFunction,
        closeCb: CallableFunction,
        errorCb: CallableFunction
    ) {
        this.wsObj = null;
        this.wsUrl = wsUrl;
        this.onOpenCb = openCb;
        this.onDataCb = dataCb;
        this.onCloseCb = closeCb;
        this.onErrorCb = errorCb;
    }

    public init(type: ConnectorTypeEnum): void {
        this.wsObj = new WebSocket(this.wsUrl);
        if (type === ConnectorTypeEnum.BINARY) {
            this.wsObj.binaryType = "arraybuffer";
        }
        this.wsObj.onopen = () => { this.onOpenCb(); };
        this.wsObj.onclose = (ev: CloseEvent) => { this.onCloseCb(); };
        this.wsObj.onerror = (ev: Event) => { this.onErrorCb(); };
        this.wsObj.onmessage = (evt: MessageEvent) => { this.onDataCb(evt.data); };
    }

    public send(data: ArrayBuffer) {
        this.wsObj.send(data);
    }

    public close() {
        this.wsObj.close();
    }

    public isReady() {
        return this.wsObj && this.wsObj.readyState === WebSocket.OPEN;
    }
}
