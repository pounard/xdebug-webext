export const XDEBUG_COOKIE_SESSION = "XDEBUG_SESSION";
export const XDEBUG_COOKIE_PROFILE = "XDEBUG_PROFILE";
export const XDEBUG_COOKIE_TRACE = "XDEBUG_TRACE";
export function setError(error, name) {
    if (name && error) {
        console.log(`xdebug: error while setting cookie ${name}: ${error}`);
    }
    else if (name) {
        console.log(`xdebug: error while setting cookie ${name}`);
    }
    else if (error) {
        console.log(`xdebug: error: ${error}`);
    }
    setIconAsIdle();
}
export function setIconAsWorking() {
    browser.browserAction.setIcon({ path: "icons/working.svg" }).catch(error => setError(undefined, error));
}
export function setIconAsIdle() {
    browser.browserAction.setIcon({ path: "icons/icon.svg" }).catch(error => setError(undefined, error));
}
