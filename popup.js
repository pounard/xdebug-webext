
const XDEBUG_SESSION_COOKIE = 'XDEBUG_SESSION';
const XDEBUG_PROFILE_COOKIE = 'XDEBUG_PROFILE';

function setIconAsWorking() {
  console.log("xdebug: icon set as working");
  browser.browserAction.setIcon({path: "icons/working.svg"});
}

function setIconAsIdle() {
  console.log("xdebug: icon set as idle");
  browser.browserAction.setIcon({path: "icons/icon.svg"});
}

const debugButton = document.querySelector("#debug");
const profileButton = document.querySelector("#profile");

function toggleCookieInCurrenTab(name, enabled, button) {
  if (enabled) {
    browser.tabs.query({active: true}).then(tabs => {
      browser.cookies
        .set({url: tabs[0].url, name: name, value: "1"})
        .then(setState, () => {
          console.log(`xdebug: error while setting cookie ${name}`);
          button.checked = "";
        })
      ;
    });
  } else {
    browser.tabs.query({active: true}).then(tabs => {
      browser.cookies
        .remove({url: tabs[0].url, name: name})
        .then(setState, () => {
          console.log(`xdebug: error while removing cookie ${name}`);
          button.checked = "";
        })
      ;
    });
  }
}

function setState() {

  var isDebugging = false, isProfiling = false;

  function updateState() {
    debugButton.checked = isDebugging ? "checked" : "";
    profileButton.checked = isProfiling ? "checked" : "";
    if (isDebugging || isProfiling) {
      setIconAsWorking();
    } else {
      setIconAsIdle();
    }
  }

  browser.tabs.query({active: true}).then(tabs => {
    if (tabs.length) {

      var readDebugCookie = browser.cookies
        .get({url: tabs[0].url, name: XDEBUG_SESSION_COOKIE})
        .then(cookie => {
          if (cookie) {
            isDebugging = true;
          }
        })
      ;

      var readProfileCookie = browser.cookies
        .get({url: tabs[0].url, name: XDEBUG_PROFILE_COOKIE})
        .then(cookie => {
          if (cookie) {
            isProfiling = true;
          }
        })
      ;

      Promise.all([readDebugCookie, readProfileCookie]).then(updateState, error => console.log(`xdebug: ${error}`));

    } else {
      console.log(`xdebug: there is no selected tab`);
      updateState();
    }
  });
}

document.querySelector("#debug").addEventListener("change", function () {
  if (this.checked) {
    toggleCookieInCurrenTab(XDEBUG_SESSION_COOKIE, true, this);
  } else {
    toggleCookieInCurrenTab(XDEBUG_SESSION_COOKIE, false, this);
  }
});

document.querySelector("#profile").addEventListener("change", function () {
  if (this.checked) {
    toggleCookieInCurrenTab(XDEBUG_PROFILE_COOKIE, true, this);
  } else {
    toggleCookieInCurrenTab(XDEBUG_PROFILE_COOKIE, false, this);
  }
});

setState();
