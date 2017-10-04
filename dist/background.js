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
            console.log(`${name} is ${cookie}`);
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
    browser.browserAction.setIcon({ path: "../icons/working.svg" }).catch(setError);
}
function setIconAsIdle() {
    browser.browserAction.setIcon({ path: "../icons/icon.svg" }).catch(setError);
}
function updateStateWithTab(tab) {
    const promises = [];
    for (let name of XDEBUG_COOKIE_ALL) {
        promises.push(isCookieEnabled(tab.url, name));
    }
    Promise.all(promises).then((enabled) => {
        console.log(enabled);
        if (enabled.some(value => value)) {
            setIconAsWorking();
        }
        else {
            setIconAsIdle();
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(0);

function onActivatedTab(activeInfo) {
    Object(__WEBPACK_IMPORTED_MODULE_0__api__["h" /* updateState */])(activeInfo.tabId);
}
if (!browser.tabs.onActivated.hasListener(onActivatedTab)) {
    browser.tabs.onActivated.addListener(onActivatedTab);
}


/***/ })
/******/ ]);