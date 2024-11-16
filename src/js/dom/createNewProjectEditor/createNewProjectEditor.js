import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
  SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
} from './variables';

import { projects, projectNavigation, colors } from '../../..';

import createProjectWithUniqueId from '../../utils/createProjectWithUniqueId';

import {
  openPopup,
  closePopup,
  togglePopup,
  makeElementChildrenList,
  handleClickOutsidePopup,
  showTick,
  hideTicks,
  handlePopupItemClick,
  handleEditorOverlayClick,
  isFormValid,
  toggleAddButtonDisabledState,
} from '../commonUtils';

export default function createNewProjectEditor() {
  /* query selectors */

  const newProjectEditorOverlay = document.querySelector('#new-project-editor-overlay');

  const addNewProjectButton = document.querySelector(
    '.project-navigation__open-new-project-popup-button',
  );

  const newProjectTitle = document.querySelector('#new-project-title');

  const newProjectEditorSelectColorButton = document.querySelector(
    '#new-project-editor-select-color-button',
  );

  const selectButtonIcons = document.querySelectorAll('.select-button-circle');
  const selectButtonTitles = document.querySelectorAll('.new-project-editor-select-button__title');

  const newProjectSelectColorContainer = document.querySelector(
    '#new-project-editor-select-color-container',
  );

  const newProjectEditorSelectColorPopup = document.querySelector(
    '#new-project-editor-select-color-popup',
  );

  const newProjectEditorSelectPopupsNodeList = document.querySelectorAll(
    '.new-project-editor__select-popup',
  );

  const newProjectEditorSelectColorList = document.querySelector(
    '#new-project-editor-select-color-list',
  );
  const newProjectEditorSelectListItemTemplate = document.querySelector(
    '#new-project-editor-select-item-template',
  );

  const inputs = document.querySelectorAll('.new-project-editor__input');

  const cancelButton = document.querySelector('#new-project-editor-cancel-button');
  const addTaskButton = document.querySelector('#new-project-editor-add-project-button');

  /* variables */

  const selectColorContainerChildrenList = makeElementChildrenList(newProjectSelectColorContainer);

  const defaultColor = colors[0];

  let newProjectDataValues = {
    title: '',
    color: defaultColor,
  };

  const allTicks = {
    color: [],
  };

  /* utils */

  function updateNewDataValues(valueName, dataValue) {
    newProjectDataValues[valueName] = dataValue;
  }

  function renderInitialSelectButtonUI(
    defaultColor,
    selectColorButtonTitle,
    selectColorButtonIcon,
  ) {
    selectColorButtonIcon.style.backgroundColor = defaultColor.hexCode;
    selectColorButtonTitle.textContent = defaultColor.title;
  }

  function renderSelectListItems() {
    const valueName = newProjectEditorSelectColorList.dataset.name;
    const selectPopupTicks = allTicks[valueName];

    const selectButtonTitleElement = newProjectEditorSelectColorButton.querySelector(
      '.new-project-editor-select-button__title',
    );
    const selectButtonIconElement = newProjectEditorSelectColorButton.querySelector(
      '.new-project-editor__color-circle',
    );

    renderInitialSelectButtonUI(defaultColor, selectButtonTitleElement, selectButtonIconElement);

    colors.forEach((color, index) => {
      const selectListItemClone = newProjectEditorSelectListItemTemplate.content.cloneNode(true);
      const selectListItem = selectListItemClone.querySelector('.new-project-editor__select-item');

      selectListItem.setAttribute('data-hexCode', color.hexCode);

      const selectListItemTick = selectListItem.querySelector(
        '.new-project-editor-select-item__tick',
      );

      selectPopupTicks.push(selectListItemTick);

      if (index === 0) {
        showTick(selectListItemTick, SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
      }

      const selectListItemColorCircle = selectListItem.querySelector(
        '.new-project-editor__color-circle',
      );
      selectListItemColorCircle.style.backgroundColor = color.hexCode;

      const selectListItemTitle = selectListItem.querySelector(
        '.new-project-editor-select-item__title',
      );

      selectListItemTitle.textContent = color.title;

      selectListItem.addEventListener('click', () =>
        handlePopupItemClick(
          valueName,
          color,
          selectButtonTitleElement,
          selectButtonIconElement,
          updatePopupButtonTextElement,
          updatePopupButtonIconElement,
          updateNewDataValues,
          selectPopupTicks,
          selectListItemTick,
          SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
        ),
      );

      newProjectEditorSelectColorList.append(selectListItem);
    });
  }

  function resetNewProjectDataValues() {
    newProjectDataValues = {
      title: '',
      color: defaultColor,
    };
  }

  function updatePopupButtonTextElements() {
    selectButtonTitles.forEach((selectButtonTitle) => {
      const valueName = selectButtonTitle.dataset.name;
      selectButtonTitle.textContent = newProjectDataValues[valueName].title;
    });
  }

  function updatePopupButtonIconElements() {
    selectButtonIcons.forEach((selectButtonIcon) => {
      const valueName = selectButtonIcon.dataset.name;
      selectButtonIcon.style.backgroundColor = newProjectDataValues[valueName].hexCode;
    });
  }

  function updatePopupButtonTextElement(popupButtonTextElement, valueName) {
    popupButtonTextElement.textContent = newProjectDataValues[valueName].title;
  }

  function updatePopupButtonIconElement(popupButtonIconElement, valueName) {
    popupButtonIconElement.style.backgroundColor = newProjectDataValues[valueName].hexCode;
  }

  function clearAllInputsValues() {
    inputs.forEach((input) => {
      input.value = '';
    });
  }

  function reset() {
    resetNewProjectDataValues();
    clearAllInputsValues();

    for (let tickNodeList in allTicks) {
      hideTicks(allTicks[tickNodeList], SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
    }

    for (let tickNodeList in allTicks) {
      showTick(allTicks[tickNodeList][0], SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
    }

    updatePopupButtonTextElements();
    updatePopupButtonIconElements();
  }

  /* event's handlers */

  function handleCancelButtonClick(popup, classForVisibleState) {
    closePopup(popup, classForVisibleState);

    reset();
  }

  function handleAddNewProjectButtonClick(newProjectEditorOverlay, editorClassForVisibleState) {
    openPopup(newProjectEditorOverlay, editorClassForVisibleState);
  }

  function handleInputChange(e, addButton, inputs) {
    const input = e.currentTarget;
    const valueName = input.name;
    newProjectDataValues[valueName] = input.value;

    toggleAddButtonDisabledState(isFormValid(inputs), addButton);
  }

  function handleAddTaskButtonClick(popup, classForVisibleState, projects) {
    const newProject = createProjectWithUniqueId(newProjectDataValues);
    projects.push(newProject);

    projectNavigation.clear();
    projectNavigation.render();

    closePopup(popup, classForVisibleState);

    reset();
  }

  /* event's listeners */

  addNewProjectButton.addEventListener('click', () =>
    handleAddNewProjectButtonClick(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  newProjectTitle.addEventListener('input', (e) =>
    handleInputChange(e, addTaskButton, newProjectTitle),
  );

  newProjectEditorSelectColorButton.addEventListener('click', () =>
    togglePopup(newProjectEditorSelectColorPopup, SELECT_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  addTaskButton.addEventListener('click', () => {
    handleAddTaskButtonClick(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE, projects);
  });

  newProjectEditorOverlay.addEventListener('mousedown', (e) =>
    handleEditorOverlayClick(
      e,
      newProjectEditorSelectPopupsNodeList,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      newProjectEditorSelectColorPopup,
      selectColorContainerChildrenList,
      SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  /* render functions */

  renderSelectListItems(
    newProjectEditorSelectColorList,
    newProjectEditorSelectColorButton,
    SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    colors,
  );

  return { render: renderSelectListItems };
}
