export const usernameKey = "username";
export const themeKey = "theme";

class LocalStorageManager {
    private readonly prefix = "fluid-chat";

    public set(key: string, value: string): void {
        window.localStorage.setItem(this.getStorageKey(key), value)
    }

    public get(key: string): string | undefined {
        const value = window.localStorage.getItem(this.getStorageKey(key));
        return value === null ? undefined : value;
    }

    public delete(key: string): void {
        window.localStorage.removeItem(this.getStorageKey(key));
    }

    public clear(): void {
        window.localStorage.clear();
    }

    private getStorageKey(key: string): string {
        return [this.prefix, key].join("-");
    }
}

export const localStorageManager = new LocalStorageManager();