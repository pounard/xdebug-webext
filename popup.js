import { XDEBUG_COOKIE_SESSION, XDEBUG_COOKIE_PROFILE, XDEBUG_COOKIE_TRACE, setError, setIconAsIdle, setIconAsWorking } from "./api";
const debugButton = document.querySelector("#debug");
const profileButton = document.querySelector("#profile");
const traceButton = document.querySelector("#trace");
function toggleCookieInCurrenTab(name, enabled, button) {
    browser.tabs.query({ active: true }).then(tabs => {
        for (let tab of tabs) {
            if (!tab.url) {
                setState();
                continue;
            }
            if (enabled) {
                browser.cookies
                    .set({ url: tab.url, name: name, value: "1" })
                    .then(setState, (error) => {
                    setError(error, name);
                    button.checked = false;
                })
                    .catch((error) => setError(error, name));
            }
            else {
                browser.tabs.query({ active: true }).then(tabs => {
                    browser.cookies
                        .remove({ url: tab.url, name: name })
                        .then(setState, (error) => {
                        setError(error, name);
                        button.checked = false;
                    })
                        .catch((error) => setError(error, name));
                });
            }
        }
    });
}
function setState() {
    let isDebugging = false, isProfiling = false, isTracing = false;
    function updateState() {
        debugButton.checked = isDebugging;
        profileButton.checked = isProfiling;
        traceButton.checked = isTracing;
        if (isDebugging || isProfiling || isTracing) {
            setIconAsWorking();
        }
        else {
            setIconAsIdle();
        }
    }
    browser.tabs.query({ active: true }).then(tabs => {
        for (let tab of tabs) {
            if (!tab.url) {
                updateState();
                continue;
            }
            const readDebugCookie = browser.cookies
                .get({ url: tab.url, name: XDEBUG_COOKIE_SESSION })
                .then((cookie) => { if (cookie) {
                isDebugging = true;
            } }, setError)
                .catch(setError);
            const readProfileCookie = browser.cookies
                .get({ url: tab.url, name: XDEBUG_COOKIE_PROFILE })
                .then((cookie) => { if (cookie) {
                isProfiling = true;
            } }, setError)
                .catch(setError);
            const readTraceCookie = browser.cookies
                .get({ url: tab.url, name: XDEBUG_COOKIE_TRACE })
                .then((cookie) => { if (cookie) {
                isTracing = true;
            } }, setError)
                .catch(setError);
            Promise.all([readDebugCookie, readProfileCookie, readTraceCookie])
                .then(updateState, setError)
                .catch(setError);
        }
    });
}
debugButton.addEventListener("change", function () {
    toggleCookieInCurrenTab(XDEBUG_COOKIE_SESSION, this.checked, this);
});
profileButton.addEventListener("change", function () {
    toggleCookieInCurrenTab(XDEBUG_COOKIE_PROFILE, this.checked, this);
});
traceButton.addEventListener("change", function () {
    toggleCookieInCurrenTab(XDEBUG_COOKIE_TRACE, this.checked, this);
});
setState();
