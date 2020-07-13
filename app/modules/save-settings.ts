/**
 * add the ability to autosave onto the given settings every time the input changes value.
 *
 * @param settings inputs settings object
 */
function saveSettings(settings: object) {
  let cbEventListener = (ev: Event) => {
    let input = <HTMLInputElement>ev.target;
    let type = input.id.match(/(?<=-)[^-]*$/)[0];

    try {
      settings[input.id.replace(`-${type}`, '')][type] = input.checked;
    } catch (e) {
      console.log('input available but is not registered in settings.json or registered in wrong way');
      console.log(input);
    }
  };

  let inputEventListener = (ev: Event) => {
    let input = <HTMLInputElement>ev.target;
    try {
      settings[input.id]['value'] = input.value;
    } catch (e) {
      console.log('input available but is not registered in settings.json or registered in wrong way');
      console.log(input);
    }
  };

  let radioEventListener = (ev: KeyboardEvent) => {
    let input = <HTMLInputElement>ev.target;
    try {
      settings[input.name.replace('_', '-')]['value'] = input.value;
    } catch (e) {
      console.log('input available but is not registered in settings.json or registered in wrong way');
      console.log(input);
    }

    if (input.name != 'co_type') return;
    let coRate = <HTMLInputElement>document.getElementById('co-rate');
    coRate.disabled = input.value == '2';
    coRate.classList.toggle('disabled', input.value == '2');
    coRate.parentElement.parentElement.title = coRate.disabled ? 'Disabled if crossover type set to Uniform' : '';
    (<HTMLButtonElement>coRate.parentElement.nextElementSibling.firstElementChild).disabled = coRate.disabled;
  };

  Array.from(document.getElementsByTagName('input')).forEach(input => {
    if (input.type == 'radio') {
      input.onchange = radioEventListener;
    } else if (input.type == 'checkbox') input.onchange = cbEventListener;
    else {
      input.onkeyup = inputEventListener;
      if (input.classList.contains('load-path') && input['isGACP'])
        input.addEventListener('browsedPath', ev => inputEventListener(ev));
      if (input.classList.contains('textfieldable')) input.onchange = inputEventListener;
    }
  });
}

module.exports = saveSettings;
