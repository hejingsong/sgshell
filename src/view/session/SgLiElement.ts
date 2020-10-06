class SgLiElement {
    public data: any;
    public ele: HTMLLIElement;

    public init(name: string, host: string, port: number, data: any): void {
        this.ele = document.createElement("li");
        const nameSpan = document.createElement("span");
        const hostSpan = document.createElement("span");
        const portSpan = document.createElement("span");

        nameSpan.innerHTML = name;
        hostSpan.innerHTML = host;
        portSpan.innerHTML = port.toString();

        nameSpan.className = "name";
        hostSpan.className = "host";
        portSpan.className = "port";

        this.ele.append(nameSpan, hostSpan, portSpan);
        this.data = data;
    }

    public setActive(): void {
        this.ele.className = "active";
    }

    public setUnActive(): void {
        this.ele.className = "";
    }

    public attach(parent: HTMLElement) {
        parent.append(this.ele);
    }
}

export default SgLiElement;
