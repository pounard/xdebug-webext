
const PREF_IDEKEY = 'idekey';
const PREF_IDEKEY_DEFAULT = 'netbeans-ide';

const keyInput = <HTMLInputElement>document.querySelector("#idekey");
const formElement = <HTMLFormElement>document.querySelector("form");

function saveOptions(event: Event) {
  browser.storage.sync.set({
      idekey: keyInput.value
  });
  event.preventDefault();
}

function restoreOptions() {
    browser.storage.sync.get('colour').then(result => {
        keyInput.value = result.value || PREF_IDEKEY_DEFAULT;
    }).catch(error => {
        console.log(`error while setting `);
        keyInput.value = PREF_IDEKEY_DEFAULT;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
formElement.addEventListener("submit", saveOptions);
