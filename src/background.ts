
import { updateState } from "./api";

function onActivatedTab(activeInfo: any) {
    updateState(<number>activeInfo.tabId);
}

if (!browser.tabs.onActivated.hasListener(onActivatedTab)) {
    browser.tabs.onActivated.addListener(onActivatedTab);
}
