
export const XDEBUG_COOKIE_SESSION = "XDEBUG_SESSION";
export const XDEBUG_COOKIE_PROFILE = "XDEBUG_PROFILE";
export const XDEBUG_COOKIE_TRACE = "XDEBUG_TRACE";
export const XDEBUG_COOKIE_ALL = [XDEBUG_COOKIE_SESSION, XDEBUG_COOKIE_PROFILE, XDEBUG_COOKIE_TRACE];

export function setError(error?: any, name?: string): void {
    if (name && error) {
        console.log(`xdebug: error while setting cookie ${name}: ${error}`);
    } else if (name) {
        console.log(`xdebug: error while setting cookie ${name}`);
    } else if (error) {
        console.log(`xdebug: error: ${error}`);
    }
}

export async function isCookieEnabled(url: string, name: string): Promise<boolean> {
    return await browser.cookies.get({url: url, name: name}).then((cookie: browser.cookies.Cookie | null) => {
        return new Promise<boolean>((resolve, reject) => {
            console.log(`${name} is ${cookie}`);
            if (cookie && cookie.value == "1") {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export function setIconAsWorking(): void {
    browser.browserAction.setIcon({path: "../icons/working.svg"}).catch(setError);
}

export function setIconAsIdle(): void {
    browser.browserAction.setIcon({path: "../icons/icon.svg"}).catch(setError);
}

export function updateStateWithTab(tab: browser.tabs.Tab) {
    const promises: Promise<boolean>[] = [];

    for (let name of XDEBUG_COOKIE_ALL) {
        promises.push(isCookieEnabled(<string>tab.url, name));
    }

    Promise.all(promises).then((enabled: boolean[]) => {
        console.log(enabled);
        if (enabled.some(value => value)) {
            setIconAsWorking();
        } else {
            setIconAsIdle();
        }
    }, error => {
        setError(error, name);
        setIconAsIdle();
    }).catch(error => {
        setError(error, name);
        setIconAsIdle();
    });
}

export function updateState(tabId: number): void {
    browser.tabs.get(tabId).then(tab => {
        updateStateWithTab(tab);
    }, error => {
        setError(error, name);
        setIconAsIdle();
    }).catch(error => {
        setError(error, name);
        setIconAsIdle();
    });
}
