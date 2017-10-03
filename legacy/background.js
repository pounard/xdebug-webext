
const XDEBUG_SESSION_COOKIE = 'XDEBUG_SESSION';
const XDEBUG_PROFILE_COOKIE = 'XDEBUG_PROFILE';

function setIconAsWorking() {
  browser.browserAction.setIcon({path: "icons/working.svg"});
}

function setIconAsIdle() {
  browser.browserAction.setIcon({path: "icons/icon.svg"});
}

function updateIconFromCurrentTab() {
  browser.tabs.query({active: true}).then(tabs => {
    Promise
      .all([
        browser.cookies.get({url: tabs[0].url, name: XDEBUG_SESSION_COOKIE}),
        browser.cookies.get({url: tabs[0].url, name: XDEBUG_PROFILE_COOKIE})
      ])
      .then(
        values => {
          if (values.some(value => !!value)) {
            setIconAsWorking();
          } else {
            setIconAsIdle();
          }
        },
        error => {
          console.log(`xdebug: error while setting cookie ${name}`);
          setIconAsIdle();
        }
      )
    ;
  });
}

if (!browser.tabs.onActivated.hasListener(updateIconFromCurrentTab)) {
  browser.tabs.onActivated.addListener(updateIconFromCurrentTab);
}
