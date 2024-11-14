export const isPopupOpen = (popup, classForVisibleState) =>
  popup.classList.contains(classForVisibleState);

export function openPopup(popup, classForVisibleState) {
  popup.classList.add(classForVisibleState);
}

export function closePopup(popup, classForVisibleState) {
  popup.classList.remove(classForVisibleState);
}

export function togglePopup(popup, classForVisibleState) {
  popup.classList.toggle(classForVisibleState);
}

export function makeElementChildrenList(elementNode) {
  const listOfChildren = [];

  if (elementNode.children.length === 0) return elementNode;

  for (let child of elementNode.children) {
    listOfChildren.push(child, makeElementChildrenList(child));
  }

  return listOfChildren.flat(Infinity);
}

export function handleClickOutsidePopup(
  e,
  popup,
  popupContainerChildrenList,
  classForVisibleState,
) {
  if (!isPopupOpen(popup, classForVisibleState)) return;

  const target = e.target;

  if (popupContainerChildrenList.some((child) => child === target)) return;

  closePopup(popup, classForVisibleState);
}

function anyPopupOpen(popupsNodeList, popupClassForVisibleState) {
  const popupsArray = Array.from(popupsNodeList);
  return popupsArray.some((popup) => isPopupOpen(popup, popupClassForVisibleState));
}

export function handleEditorOverlayClick(
  e,
  popupsNodeList,
  editorClassForVisibleState,
  popupClassForVisibleState,
) {
  const { target, currentTarget: overlay } = e;

  console.log(target === anyPopupOpen(popupsNodeList, popupClassForVisibleState));
  if (target === overlay && !anyPopupOpen(popupsNodeList, popupClassForVisibleState)) {
    closePopup(overlay, editorClassForVisibleState);
  }
}

function disableAddButton(addButton) {
  addButton.setAttribute('disabled', true);
}

function enableAddButton(addButton) {
  addButton.removeAttribute('disabled');
}

function allInputsValid(inputs) {
  if (typeof inputs !== 'array') return inputs.value !== '';

  const inputsArray = Array.from(inputs);
  const filteredInputsArray = inputsArray.filter((input) => input.name !== 'description');

  return filteredInputsArray.every((input) => input.value !== '');
}

function toggleAddButtonDisabledState(allInputsValid, addButton) {
  if (allInputsValid) {
    enableAddButton(addButton);
  } else {
    disableAddButton(addButton);
  }
}

export function handleInputChange(e, newDataValues, addButton, inputs) {
  const input = e.currentTarget;
  const valueName = input.name;
  newDataValues[valueName] = input.value;

  toggleAddButtonDisabledState(allInputsValid(inputs), addButton);
}

export function showTick(tick, tickItemClassForVisibleState) {
  tick.classList.add(tickItemClassForVisibleState);
}

function hideTicks(ticks, tickItemClassForVisibleState) {
  ticks.forEach((tick) => {
    tick.classList.remove(tickItemClassForVisibleState);
  });
}

export function handlePopupItemClick(
  valueName,
  newValue,
  popupButtonTextElement,
  popupButtonIconElement,
  updatePopupButtonTextElement,
  updatePopupButtonIconElement,
  updateNewDataValues,
  ticks,
  currentTick,
  tickItemClassForVisibleState,
) {
  updateNewDataValues(valueName, newValue);

  updatePopupButtonTextElement(popupButtonTextElement, valueName);
  updatePopupButtonIconElement(popupButtonIconElement, valueName);

  hideTicks(ticks, tickItemClassForVisibleState);
  showTick(currentTick, tickItemClassForVisibleState);
}

export function handleCancelButtonClick(
  popup,
  updatePopupButtonTextElements,
  updatePopupButtonIconElements,
  popupClassForVisibleState,
  clearAllInputsValues,
  resetNewDataValues,
  allTicks,
  itemTickClassForVisibleState,
) {
  clearAllInputsValues();
  resetNewDataValues();

  for (let tickNodeList in allTicks) {
    hideTicks(allTicks[tickNodeList], itemTickClassForVisibleState);
  }

  for (let tickNodeList in allTicks) {
    showTick(allTicks[tickNodeList][0], itemTickClassForVisibleState);
  }

  updatePopupButtonTextElements();
  updatePopupButtonIconElements();

  closePopup(popup, popupClassForVisibleState);
}
