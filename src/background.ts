
import * as Api from "./api";

let currentTab: browser.tabs.Tab | null;

function onActivatedTab(activeInfo: any) {
    browser.tabs.get(activeInfo.tabId).then(tab => {
        if (tab.url) {
            currentTab = tab;
            Api.updateStateWithTab(tab);
        } else {
            Api.setIconAsIdle();
        }
    }).catch(error => {
        Api.setError(error);
        Api.setIconAsIdle();
    });
}

function onCommand(command: string): void {
    if (currentTab) {

        const url = <string>currentTab.url;

        switch (command) {

            case "toggle_debug_session":
                const name = Api.XDEBUG_COOKIE_SESSION;
                Api.isCookieEnabled(url, name).then(enabled => {
                    if (enabled) {
                        Api.cookieDelete(url, name).then(_ => {
                            Api.updateStateWithTab(<browser.tabs.Tab>currentTab);
                        }).catch(error => {
                            Api.setError(error, name)
                        });;
                    } else {
                        Api.cookieSet(url, name).then(_ => {
                            Api.setIconAsWorking();
                        }).catch(error => {
                            Api.setError(error, name)
                        });
                    }
                });
                break;

            default:
                console.log(`xdebug: unhandled command: ${command}`);
                break;
        }
    } else {
        console.log(`xdebug: cannot run: ${command} without an active tab`);
    }
}

if (!browser.tabs.onActivated.hasListener(onActivatedTab)) {
    browser.tabs.onActivated.addListener(onActivatedTab);
}

if (!browser.commands.onCommand.hasListener(onCommand)) {
    browser.commands.onCommand.addListener(onCommand);
}
