// # INITIAL CONFIGS
var pointerList = 1;

var guestsList = JSON.parse(localStorage.getItem('guestsList')) || [];

var getList = function() {
  guestsList = JSON.parse(localStorage.getItem('guestsList')) || [];
  return guestsList;
}

var setList = function() {
  localStorage.setItem('guestsList', JSON.stringify(guestsList));
}

var getItemList = function(item) {
  guestsList = (localStorage.getItem('guestsList') || []);
  return guestsList;
}

var setItemList = function(item) {
  guestsList.push(item)
  setList();
}

var elList = document.getElementById('lc-list');
var elListItem = document.createElement('li');
var buttonAdd = document.getElementById('lc-button-add');

var createInput = function(name='', type='text') {
  var elTextInput = document.createElement('input')
  elTextInput.setAttribute('name', name);
  elTextInput.setAttribute('type', type);
  return elTextInput;
}

var createButtonActionGuest = function(id, title="edit", callbackFunction=null){
  var elButton = document.createElement('button');

  elButton.innerHTML = title;
  elButton.onclick = callbackFunction;
  elButton.setAttribute('id', `guest-field-buttonEdit-${id}`);
  elButton.setAttribute('data-id', id);
  elButton.setAttribute('type', 'button');

  return elButton;
}

var initSystem = function() {
  setHTMLGuestList();
  buttonAdd.onclick = setGuestInListFromHTML;
}

// - CREATE: ADD GUEST TO THE GUEST'S LIST
var setGuestInListFromHTML = function() {
  var inputName = document.getElementById('lc-field-guest-name');
  var inputAge = document.getElementById('lc-field-guest-age');

  var newGuest = {id: pointerList++, name: inputName.value, age: inputAge.value};
  setItemList(newGuest);
  setHTMLGuestList();

  inputName.value = "";
  inputAge.value = "";

  return newGuest;
}

var setHTMLGuestList = function() {
  elList.innerHTML = "";
  for(const guest of getGuestsList()){
    var elButtonUpdate = createButtonActionGuest(guest.id, 'Edit', enableUpdateFields.bind(this, guest));
    var elButtonDelete = createButtonActionGuest(guest.id, 'Delete', confirmationDelete.bind(this, guest));
    var elItemListGuest = elListItem.cloneNode(true);
    var elItemTextGuest = document.createTextNode(`${guest.id} - ${guest.name} [${guest.age}] years old | `);

    elItemListGuest.appendChild(elItemTextGuest);
    elItemListGuest.appendChild(elButtonUpdate);
    elItemListGuest.appendChild(elButtonDelete);
    elList.appendChild(elItemListGuest);

    setGuestsUpdateInputs(guest, elItemListGuest);
  }
}

// - READ: GUEST'S LIST
var getGuestsList = function() {
  return getList();
};

// - UPDATE: UPDATE GUEST IN GUEST'S LIST
var setGuestsUpdateInputs = function(guest, elItem) {
  var elWrapFields = document.createElement('div');
  var elNameInput = createInput(`guest-field-name-${guest.id}`);
  var elAgeInput = createInput(`guest-field-age-${guest.id}`, 'number');
  var elButtonSaveChange = createButtonActionGuest(guest.id, 'Save Changes', updateGuestInListFromHTML);

  elWrapFields.setAttribute('id', `guest-fields-update-${guest.id}`);

  elButtonSaveChange.setAttribute('id', `guest-field-buttonSave-${guest.id}`);

  elNameInput.setAttribute('id', `guest-field-name-${guest.id}`);
  elNameInput.setAttribute('placeholder', `Nome do Convidado`);
  elNameInput.setAttribute('value', `${guest.name}`);

  elAgeInput.setAttribute('id', `guest-field-age-${guest.id}`);
  elAgeInput.setAttribute('placeholder', `Idade`);
  elAgeInput.setAttribute('value', `${guest.age}`);

  elWrapFields.setAttribute('style', `display:none`);

  elWrapFields.appendChild(elNameInput);
  elWrapFields.appendChild(elAgeInput);
  elWrapFields.appendChild(elButtonSaveChange);
  elItem.appendChild(elWrapFields);

  return elItem;
}

var updateGuestInListFromHTML = function(e) {
  var buttonUpdate = e.target
  var dataId = buttonUpdate.dataset['id'];
  var inputName = document.getElementById(`guest-field-name-${dataId}`);
  var inputAge = document.getElementById(`guest-field-age-${dataId}`);
  var guest = getGuestsList().filter(function(item, i) {return item.id == Number(dataId)})[0]
  if(guest) {
    guest.name = inputName.value;
    guest.age = inputAge.value;
    setList();
    setHTMLGuestList();
  }

  return guest;
}

var enableUpdateFields = function(guest) {
  var elWrapFields = document.getElementById(`guest-fields-update-${guest.id}`);
  var _display = elWrapFields.style.display == 'none' ? 'block' : 'none';

  elWrapFields.setAttribute('style', `display:${_display}`);

};

// - DELETE: DELETE GUEST IN THE GUEST'S LIST
var confirmationDelete = function(guest, e) {
  if (window.confirm("Você realmente quer deletar este convidado?")) {
    deleteGuest(guest);
  }
}

var deleteGuest = function(guest) {
  var guestId = guest.id;
  guestsList = getGuestsList().filter(function(item, i) {return item.id != Number(guestId)})
  setList();
  setHTMLGuestList();
}

// # EXEC: EXECUTE THE PROGRAM;
initSystem();
