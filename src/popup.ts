declare type Tab = browser.tabs.Tab;

import * as Api from "./api";

const buttons: any = {
    "debug": Api.XDEBUG_COOKIE_SESSION,
    "profile": Api.XDEBUG_COOKIE_PROFILE,
    "trace": Api.XDEBUG_COOKIE_TRACE
};

function toggleCheckboxState(tab: Tab, name: string, button: HTMLInputElement): void {
    let promise: Promise<any>;

    if (button.checked) {
        promise = Api.cookieSet(tab, name);
    } else {
        promise = Api.cookieDelete(tab, name);
    }

    promise.then(_ => {
        if (button.checked) {
            // No need to update whole state, we have at least one lit item
            Api.setIconAsWorking();
        } else {
            Api.updateStateWithTab(tab);
        }
    }).catch(error => {
        Api.setError(error, name);
        button.checked = false;
    });
}

function initializeButton(tab: Tab, id: string, name: string) {
    let button = <HTMLInputElement>document.querySelector("#" + id);

    if (!button) {
        return Api.setError(`could not find button ${id}`);
    }

    button.addEventListener("change", () => toggleCheckboxState(tab, name, button));

    Api.isCookieEnabled(tab, name).then(enabled => {
        button.checked = enabled;
        if (enabled) {
            Api.setIconAsWorking();
        }
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
