/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["e"] = setError;
/* harmony export (immutable) */ __webpack_exports__["d"] = isCookieEnabled;
/* harmony export (immutable) */ __webpack_exports__["g"] = setIconAsWorking;
/* harmony export (immutable) */ __webpack_exports__["f"] = setIconAsIdle;
/* harmony export (immutable) */ __webpack_exports__["i"] = updateStateWithTab;
/* harmony export (immutable) */ __webpack_exports__["h"] = updateState;
const XDEBUG_COOKIE_SESSION = "XDEBUG_SESSION";
/* harmony export (immutable) */ __webpack_exports__["b"] = XDEBUG_COOKIE_SESSION;

const XDEBUG_COOKIE_PROFILE = "XDEBUG_PROFILE";
/* harmony export (immutable) */ __webpack_exports__["a"] = XDEBUG_COOKIE_PROFILE;

const XDEBUG_COOKIE_TRACE = "XDEBUG_TRACE";
/* harmony export (immutable) */ __webpack_exports__["c"] = XDEBUG_COOKIE_TRACE;

const XDEBUG_COOKIE_ALL = [XDEBUG_COOKIE_SESSION, XDEBUG_COOKIE_PROFILE, XDEBUG_COOKIE_TRACE];
/* unused harmony export XDEBUG_COOKIE_ALL */

function setError(error, name) {
    if (name && error) {
        console.log(`xdebug: error while setting cookie ${name}: ${error}`);
    }
    else if (name) {
        console.log(`xdebug: error while setting cookie ${name}`);
    }
    else if (error) {
        console.log(`xdebug: error: ${error}`);
    }
}
async function isCookieEnabled(url, name) {
    return await browser.cookies.get({ url: url, name: name }).then((cookie) => {
        return new Promise((resolve, reject) => {
            if (cookie && cookie.value == "1") {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}
function setIconAsWorking() {
    browser.browserAction.setIcon({ path: "icons/working.svg" }).catch(setError);
}
function setIconAsIdle() {
    browser.browserAction.setIcon({ path: "icons/icon.svg" }).catch(setError);
}
function updateStateWithTab(tab) {
    const promises = [];
    for (let name of XDEBUG_COOKIE_ALL) {
        promises.push(isCookieEnabled(tab.url, name));
    }
    Promise.all(promises).then((enabled) => {
        if (enabled.some(value => value)) {
            setIconAsIdle();
        }
        else {
            setIconAsWorking();
        }
    }, error => {
        setError(error, name);
        setIconAsIdle();
    }).catch(error => {
        setError(error, name);
        setIconAsIdle();
    });
}
function updateState(tabId) {
    browser.tabs.get(tabId).then(tab => {
        updateStateWithTab(tab);
    }, error => {
        setError(error, name);
        setIconAsIdle();
    }).catch(error => {
        setError(error, name);
        setIconAsIdle();
    });
}


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(0);

const buttons = {
    "debug": __WEBPACK_IMPORTED_MODULE_0__api__["b" /* XDEBUG_COOKIE_SESSION */],
    "profile": __WEBPACK_IMPORTED_MODULE_0__api__["a" /* XDEBUG_COOKIE_PROFILE */],
    "trace": __WEBPACK_IMPORTED_MODULE_0__api__["c" /* XDEBUG_COOKIE_TRACE */]
};
const DEFAULT_COOKIE_EXPIRY = 3600;
function extractHostname(url) {
    const matches = url.match(/^([^:]+:\/\/[^/]+)/gm);
    if (matches && matches.length) {
        return matches[0];
    }
    return url;
}
async function cookieSet(url, name) {
    console.log(`xdebug: set cookie ${name} for url ${url}`);
    return await browser.cookies.set({
        url: extractHostname(url),
        name: name,
        value: "1",
        path: "/",
        expirationDate: Date.now() + DEFAULT_COOKIE_EXPIRY
    });
}
async function cookieDelete(url, name) {
    console.log(`xdebug: remove cookie ${name} for url ${url}`);
    return await browser.cookies.remove({ url: url, name: name });
}
function toggleCheckboxState(tab, name, button) {
    let promise;
    if (button.checked) {
        promise = cookieSet(tab.url, name);
    }
    else {
        promise = cookieDelete(tab.url, name);
    }
    promise.then(_ => {
        if (button.checked) {
            __WEBPACK_IMPORTED_MODULE_0__api__["g" /* setIconAsWorking */]();
        }
        else {
            __WEBPACK_IMPORTED_MODULE_0__api__["i" /* updateStateWithTab */](tab);
        }
    }, error => {
        __WEBPACK_IMPORTED_MODULE_0__api__["e" /* setError */](error, name);
        button.checked = false;
    }).catch(error => {
        __WEBPACK_IMPORTED_MODULE_0__api__["e" /* setError */](error, name);
        button.checked = false;
    });
}
function initializeButton(tab, id, name) {
    let button = document.querySelector("#" + id);
    if (!button) {
        return __WEBPACK_IMPORTED_MODULE_0__api__["e" /* setError */](`could not find button ${id}`);
    }
    button.addEventListener("change", () => toggleCheckboxState(tab, name, button));
    __WEBPACK_IMPORTED_MODULE_0__api__["d" /* isCookieEnabled */](tab.url, name).then(enabled => {
        button.checked = enabled;
        __WEBPACK_IMPORTED_MODULE_0__api__["g" /* setIconAsWorking */]();
    }, error => {
        __WEBPACK_IMPORTED_MODULE_0__api__["e" /* setError */](error, name);
        button.checked = false;
    }).catch(error => {
        __WEBPACK_IMPORTED_MODULE_0__api__["e" /* setError */](error, name);
        button.checked = false;
    });
}
__WEBPACK_IMPORTED_MODULE_0__api__["f" /* setIconAsIdle */]();
browser.tabs.query({ active: true }).then(tabs => {
    for (let tab of tabs) {
        if (tab.url) {
            for (let id in buttons) {
                initializeButton(tab, id, buttons[id]);
            }
        }
    }
});


/***/ })
/******/ ]);