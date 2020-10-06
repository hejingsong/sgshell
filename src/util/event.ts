export default class Event {
    private events: any = {};

    public add(eventName: string|number, callback: CallableFunction): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    public emit(eventName: string|number, ...args: any[]): void {
        if (!this.events[eventName]) {
            return;
        }
        for (const fun of this.events[eventName]) {
            fun(...args);
        }
    }

    public del(eventName: string|number) {
        delete this.events[eventName];
    }
}
