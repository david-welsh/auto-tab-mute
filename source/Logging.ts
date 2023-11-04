import Browser from 'webextension-polyfill';

export class Logging {
  static trace(message?: unknown, ...optional: unknown[]): void {
    this.logIfEnabled(() => console.trace(message, optional));
  }

  static info(message?: unknown, ...optional: unknown[]): void {
    this.logIfEnabled(() => console.info(message, optional));
  }

  static warn(message?: unknown, ...optional: unknown[]): void {
    this.logIfEnabled(() => console.warn(message, optional));
  }

  static error(message?: unknown, ...optional: unknown[]): void {
    this.logIfEnabled(() => console.error(message, optional));
  }

  static logIfEnabled(f: () => void): void {
    Browser.storage.local.get('loggingEnabled').then(({ loggingEnabled }) => {
      if (loggingEnabled) {
        f();
      }
    });
  }
}
