import Browser from "webextension-polyfill";

export class Logging {
    static trace(message?: any, ...optional: any[]): void {
        this.logIfEnabled(() => console.trace(message, optional));
    }

    static info(message?: any, ...optional: any[]): void {
        this.logIfEnabled(() => console.info(message, optional));
    }
    
    static warn(message?: any, ...optional: any[]): void {
        this.logIfEnabled(() => console.warn(message, optional));
    }

    static error(message?: any, ...optional: any[]): void {
        this.logIfEnabled(() => console.error(message, optional));
    }

    static logIfEnabled(f: () => void): void {
        Browser.storage.local.get("loggingEnabled").then(({loggingEnabled}) => {
            if (loggingEnabled) {
                f();
            }
        });
    }
}