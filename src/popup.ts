
import * as Api from "./api";

const buttons: any = {
    "debug": Api.XDEBUG_COOKIE_SESSION,
    "profile": Api.XDEBUG_COOKIE_PROFILE,
    "trace": Api.XDEBUG_COOKIE_TRACE
};

const DEFAULT_COOKIE_EXPIRY = 3600;

function extractHostname(url: string): string {
    const matches = url.match(/^([^:]+:\/\/[^/]+)/gm);
    if (matches && matches.length) {
        return matches[0];
    }
    return url;
}

async function cookieSet(url: string, name: string) {
    console.log(`xdebug: set cookie ${name} for url ${url}`);
    return await browser.cookies.set(<any>{
        url: extractHostname(url),
        name: name,
        value: "1",
        path: "/",
        // Without expire, expiry will set to the session, but in container
        // tabs Firefox will not send the cookie (ouate de phoque).
        expirationDate: Date.now() + DEFAULT_COOKIE_EXPIRY
    });
}

async function cookieDelete(url: string, name: string) {
    console.log(`xdebug: remove cookie ${name} for url ${url}`);
    return await browser.cookies.remove(<any>{url: url, name: name});
}

function toggleCheckboxState(tab: browser.tabs.Tab, name: string, button: HTMLInputElement): void {
    let promise: Promise<any>;

    if (button.checked) {
        promise = cookieSet(<string>tab.url, name);
    } else {
        promise = cookieDelete(<string>tab.url, name);
    }

    promise.then(_ => {
        if (button.checked) {
            // No need to update whole state, we have at least one lit item
            Api.setIconAsWorking();
        } else {
            Api.updateStateWithTab(tab);
        }
    }, error => {
        Api.setError(error, name);
        button.checked = false;
    }).catch(error => {
        Api.setError(error, name);
        button.checked = false;
    });
}

function initializeButton(tab: browser.tabs.Tab, id: string, name: string) {
    let button = <HTMLInputElement>document.querySelector("#" + id);

    if (!button) {
        return Api.setError(`could not find button ${id}`);
    }

    button.addEventListener("change", () => toggleCheckboxState(tab, name, button));

    Api.isCookieEnabled(<string>tab.url, name).then(enabled => {
        button.checked = enabled;
        if (enabled) {
            Api.setIconAsWorking();
        }
    }, error => {
        Api.setError(error, name);
        button.checked = false;
    }).catch(error => {
        Api.setError(error, name);
        button.checked = false;
    });
}

// On load restore buttons state
Api.setIconAsIdle();
browser.tabs.query({active: true}).then(tabs => {
    for (let tab of tabs) {
        if (tab.url) {
            for (let id in buttons) {
                initializeButton(tab, id, buttons[id]);
            }
        }
    }
})
