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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["g"] = setError;
/* harmony export (immutable) */ __webpack_exports__["f"] = isCookieEnabled;
/* harmony export (immutable) */ __webpack_exports__["e"] = cookieSet;
/* harmony export (immutable) */ __webpack_exports__["d"] = cookieDelete;
/* harmony export (immutable) */ __webpack_exports__["i"] = setIconAsWorking;
/* harmony export (immutable) */ __webpack_exports__["h"] = setIconAsIdle;
/* harmony export (immutable) */ __webpack_exports__["j"] = updateStateWithTab;
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
async function isCookieEnabled(tab, name) {
    return await browser.cookies.get({
        url: tab.url,
        name: name,
        storeId: tab.cookieStoreId,
    }).then((cookie) => {
        return new Promise((resolve, reject) => {
            console.log(`${name} for ${tab.url} is ${cookie}`);
            if (cookie && cookie.value !== "0") {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}
function extractHostname(url) {
    const matches = url.match(/^([^:]+:\/\/[^/]+)/gm);
    if (matches && matches.length) {
        return matches[0];
    }
    return url;
}
async function cookieSet(tab, name) {
    console.log(`xdebug: set cookie ${name} for url ${tab.url} in store ${tab.cookieStoreId}`);
    return await browser.cookies.set({
        url: extractHostname(tab.url),
        name: name,
        value: "1",
        path: "/",
        storeId: tab.cookieStoreId,
    });
}
async function cookieDelete(tab, name) {
    console.log(`xdebug: remove cookie ${name} for url ${tab.url} in store ${tab.cookieStoreId}`);
    return await browser.cookies.remove({
        url: extractHostname(tab.url),
        name: name,
        storeId: tab.cookieStoreId,
    });
}
function setIconAsWorking() {
    browser.browserAction.setIcon({ path: "../icons/working.svg" }).catch(setError);
}
function setIconAsIdle() {
    browser.browserAction.setIcon({ path: "../icons/icon.svg" }).catch(setError);
}
function updateStateWithTab(tab) {
    const promises = [];
    for (let name of XDEBUG_COOKIE_ALL) {
        promises.push(isCookieEnabled(tab, name));
    }
    Promise.all(promises).then((enabled) => {
        console.log(enabled);
        if (enabled.some(value => value)) {
            setIconAsWorking();
        }
        else {
            setIconAsIdle();
        }
    }).catch(error => {
        setError(error, name);
        setIconAsIdle();
    });
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(0);

let currentTab;
function onActivatedTab(activeInfo) {
    browser.tabs.get(activeInfo.tabId).then(tab => {
        if (tab.url) {
            currentTab = tab;
            __WEBPACK_IMPORTED_MODULE_0__api__["j" /* updateStateWithTab */](tab);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_0__api__["h" /* setIconAsIdle */]();
        }
    }).catch(error => {
        __WEBPACK_IMPORTED_MODULE_0__api__["g" /* setError */](error);
        __WEBPACK_IMPORTED_MODULE_0__api__["h" /* setIconAsIdle */]();
    });
}
function onCommand(command) {
    if (currentTab) {
        switch (command) {
            case "toggle_debug_session":
                const name = __WEBPACK_IMPORTED_MODULE_0__api__["b" /* XDEBUG_COOKIE_SESSION */];
                __WEBPACK_IMPORTED_MODULE_0__api__["f" /* isCookieEnabled */](currentTab, name).then(enabled => {
                    if (enabled) {
                        __WEBPACK_IMPORTED_MODULE_0__api__["d" /* cookieDelete */](currentTab, name).then(_ => {
                            __WEBPACK_IMPORTED_MODULE_0__api__["j" /* updateStateWithTab */](currentTab);
                        }).catch(error => {
                            __WEBPACK_IMPORTED_MODULE_0__api__["g" /* setError */](error, name);
                        });
                        ;
                    }
                    else {
                        __WEBPACK_IMPORTED_MODULE_0__api__["e" /* cookieSet */](currentTab, name).then(_ => {
                            __WEBPACK_IMPORTED_MODULE_0__api__["i" /* setIconAsWorking */]();
                        }).catch(error => {
                            __WEBPACK_IMPORTED_MODULE_0__api__["g" /* setError */](error, name);
                        });
                    }
                });
                break;
            default:
                console.log(`xdebug: unhandled command: ${command}`);
                break;
        }
    }
    else {
        console.log(`xdebug: cannot run: ${command} without an active tab`);
    }
}
if (!browser.tabs.onActivated.hasListener(onActivatedTab)) {
    browser.tabs.onActivated.addListener(onActivatedTab);
}
if (!browser.commands.onCommand.hasListener(onCommand)) {
    browser.commands.onCommand.addListener(onCommand);
}


/***/ })
/******/ ]);