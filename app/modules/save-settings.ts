/**
 * add the ability to autosave onto the given settings every time the input changes value.
 *
 * @param settings inputs settings object
 */
function saveSettings(settings: object) {
  let cbEventListener = (ev: Event) => {
    let input = <HTMLInputElement>ev.target;
    let type = input.id.match(/(?<=-)[^-]*$/)[0];

    settings[input.id.replace(`-${type}`, '')][type] = input.checked;
  };

  let inputEventListener = (ev: KeyboardEvent) => {
    let input = <HTMLInputElement>ev.target;
    settings[input.id]['value'] = input.value;
  };

  Array.from(document.getElementsByTagName('input')).forEach(input => {
    if (input.type == 'checkbox') input.onchange = cbEventListener;
    else {
      input.onkeyup = inputEventListener;
      if (input.classList.contains('textfieldable'))
        input.onchange = inputEventListener;
    }
  });
}

module.exports = saveSettings;