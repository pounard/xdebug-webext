
import { XDEBUG_COOKIE_SESSION, XDEBUG_COOKIE_PROFILE, XDEBUG_COOKIE_TRACE, setError, setIconAsIdle, setIconAsWorking } from "./api";

function updateIconFromCurrentTab() {
    browser.tabs.query({active: true}).then(tabs => {
        for (let tab of tabs) {

            if (!tab.url) {
                setIconAsIdle();
                continue;
            }

            for (let name of [XDEBUG_COOKIE_SESSION, XDEBUG_COOKIE_PROFILE, XDEBUG_COOKIE_TRACE]) {
                browser.cookies
                    .get({
                        url: tab.url,
                        name: name
                    })
                    .then(
                        value => value ? setIconAsWorking() : setIconAsIdle(),
                        error => setError(name, error)
                    )
                    .catch(
                        error => setError(name, error)
                    )
                ;
            }
        }
    });
}

if (!browser.tabs.onActivated.hasListener(updateIconFromCurrentTab)) {
    browser.tabs.onActivated.addListener(updateIconFromCurrentTab);
}
