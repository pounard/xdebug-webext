declare type Tab = browser.tabs.Tab;

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

export async function isCookieEnabled(tab: Tab, name: string): Promise<boolean> {
    return await browser.cookies.get({
        url: <string>tab.url,
        name: name,
        storeId: tab.cookieStoreId,
    }).then((cookie: browser.cookies.Cookie | null) => {
        return new Promise<boolean>((resolve, reject) => {
            console.log(`${name} for ${tab.url} is ${cookie}`);
            if (cookie && cookie.value !== "0") {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

function extractHostname(url: string): string {
    const matches = url.match(/^([^:]+:\/\/[^/]+)/gm);
    if (matches && matches.length) {
        return matches[0];
    }
    return url;
}

export async function cookieSet(tab: Tab, name: string) {
    console.log(`xdebug: set cookie ${name} for url ${tab.url} in store ${tab.cookieStoreId}`);
    return await browser.cookies.set(<any>{
        url: extractHostname(<string>tab.url),
        name: name,
        value: "1",
        path: "/",
        storeId: tab.cookieStoreId,
        // Without expire, expiry will set to the session, but in container
        // tabs Firefox will not send the cookie (ouate de phoque).
        // expirationDate: Date.now() + DEFAULT_COOKIE_EXPIRY
    });
}

export async function cookieDelete(tab: Tab, name: string) {
    console.log(`xdebug: remove cookie ${name} for url ${tab.url} in store ${tab.cookieStoreId}`);
    return await browser.cookies.remove(<any>{
        url: extractHostname(<string>tab.url),
        name: name,
        storeId: tab.cookieStoreId,
    });
}

export function setIconAsWorking(): void {
    browser.browserAction.setIcon({path: "../icons/working.svg"}).catch(setError);
}

export function setIconAsIdle(): void {
    browser.browserAction.setIcon({path: "../icons/icon.svg"}).catch(setError);
}

export function updateStateWithTab(tab: Tab) {
    const promises: Promise<boolean>[] = [];

    for (let name of XDEBUG_COOKIE_ALL) {
        promises.push(isCookieEnabled(tab, name));
    }

    Promise.all(promises).then((enabled: boolean[]) => {
        console.log(enabled);
        if (enabled.some(value => value)) {
            setIconAsWorking();
        } else {
            setIconAsIdle();
        }
    }).catch(error => {
        setError(error, name);
        setIconAsIdle();
    });
}
