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
  classForVisibleState
) {
  if (!isPopupOpen(popup, classForVisibleState)) return;

  const target = e.target;

  if (popupContainerChildrenList.some((child) => child === target)) return;

  closePopup(popup, classForVisibleState);
}

function anyPopupOpen(popupsNodeList, popupClassForVisibleState) {
  const popupsArray = Array.from(popupsNodeList);
  return popupsArray.some((popup) =>
    isPopupOpen(popup, popupClassForVisibleState)
  );
}

export function handleEditorOverlayClick(
  e,
  popupsNodeList,
  editorClassForVisibleState,
  popupClassForVisibleState
) {
  const { target, currentTarget: overlay } = e;

  if (
    target === overlay &&
    !anyPopupOpen(popupsNodeList, popupClassForVisibleState)
  ) {
    closePopup(overlay, editorClassForVisibleState);
  }
}

export function disableAddButton(addButton) {
  addButton.setAttribute('disabled', true);
}

function enableAddButton(addButton) {
  addButton.removeAttribute('disabled');
}

export function isFormValid(inputs) {
  const inputsArray = Array.from(inputs);

  return inputsArray.every((input) => input.validity.valid);
}

export function toggleAddButtonDisabledState(formValid, addButton) {
  if (formValid) {
    enableAddButton(addButton);
  } else {
    disableAddButton(addButton);
  }
}

export function showTick(tick, tickItemClassForVisibleState) {
  tick.classList.add(tickItemClassForVisibleState);
}

export function hideTicks(ticks, tickItemClassForVisibleState) {
  ticks.forEach((tick) => {
    tick.classList.remove(tickItemClassForVisibleState);
  });
}
