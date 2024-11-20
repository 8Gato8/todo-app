import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
  SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
} from './variables';

import {
  projects,
  projectNavigation,
  taskEditor,
  colors,
  chosenProject,
  addProjectToProjectsArray,
} from '../../..';

import createProjectWithUniqueId from '../../utils/createProjectWithUniqueId';

import {
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
  disableAddButton,
  resetAllTicks,
} from '../commonUtils';

export default function createProjectEditor() {
  /* query selectors */

  const projectEditorForm = document.querySelector('.project-editor');

  const projectEditorOverlay = document.querySelector('#project-editor-overlay');

  const projectEditorTitle = document.querySelector('.project-editor__title');

  const projectTitle = document.querySelector('#project-title');

  const projectEditorSelectColorButton = document.querySelector(
    '#project-editor-select-color-button',
  );

  const selectButtonIcons = document.querySelectorAll('.select-button-circle');
  const selectButtonTitles = document.querySelectorAll('.project-editor-select-button__title');

  const projectSelectColorContainer = document.querySelector(
    '#project-editor-select-color-container',
  );

  const projectEditorSelectColorPopup = document.querySelector(
    '#project-editor-select-color-popup',
  );

  const projectEditorSelectPopupsNodeList = document.querySelectorAll(
    '.project-editor__select-popup',
  );

  const projectEditorSelectColorList = document.querySelector('#project-editor-select-color-list');
  const projectEditorSelectListItemTemplate = document.querySelector(
    '#project-editor-select-item-template',
  );

  const selectButtonTitleElement = projectEditorSelectColorButton.querySelector(
    '.project-editor-select-button__title',
  );
  const selectButtonIconElement = projectEditorSelectColorButton.querySelector(
    '.project-editor__color-circle',
  );

  const inputs = document.querySelectorAll('.project-editor__input');

  const cancelButton = document.querySelector('#project-editor-cancel-button');
  const addTaskButton = document.querySelector('#project-editor-add-project-button');

  /* variables */

  const selectColorContainerChildrenList = makeElementChildrenList(projectSelectColorContainer);

  const defaultColor = colors[0];

  let projectDataValues = {
    title: '',
    color: defaultColor,
  };

  const allTicks = {
    color: [],
  };

  const valueName = projectEditorSelectColorList.dataset.name;

  /* utils */

  function updateDataValues(valueName, dataValue) {
    projectDataValues[valueName] = dataValue;
  }

  function updateSelectButtonUI(color, selectColorButtonTitle, selectColorButtonIcon) {
    selectColorButtonIcon.style.backgroundColor = color.hexCode;
    selectColorButtonTitle.textContent = color.title;
  }

  function updateEditorTitle(editorTitleText) {
    projectEditorTitle.textContent = editorTitleText;
  }

  function updateEditorSubmitButton(editorSubmitText) {
    addTaskButton.textContent = editorSubmitText;
  }

  function updateInputsValues(project) {
    inputs.forEach((input) => {
      input.value = project[input.name];
    });
  }

  function updateSelectButtonTextElements() {
    selectButtonTitles.forEach((selectButtonTitle) => {
      const valueName = selectButtonTitle.dataset.name;
      selectButtonTitle.textContent = projectDataValues[valueName].title;
    });
  }

  function updateSelectButtonIconElements() {
    selectButtonIcons.forEach((selectButtonIcon) => {
      const valueName = selectButtonIcon.dataset.name;
      selectButtonIcon.style.backgroundColor = projectDataValues[valueName].hexCode;
    });
  }

  function updateSelectButtonTextElement(
    buttonTitleElement,
    valueName,
    project = projectDataValues,
  ) {
    buttonTitleElement.textContent = project[valueName].title;
  }

  function updateSelectButtonIconElement(
    buttonIconElement,
    valueName,
    project = projectDataValues,
  ) {
    buttonIconElement.style.backgroundColor = project[valueName].hexCode;
  }

  function updateEditor(editorTitleText, editorSubmitText, project = projectDataValues) {
    updateEditorTitle(editorTitleText);
    updateEditorSubmitButton(editorSubmitText);
    updateInputsValues(project);
    updateSelectButtonTextElement(selectButtonTitleElement, valueName, project);
    updateSelectButtonIconElement(selectButtonIconElement, valueName, project);
    toggleAddButtonDisabledState(isFormValid(inputs), addTaskButton);
  }

  function resetProjectDataValues() {
    projectDataValues = {
      title: '',
      color: defaultColor,
    };
  }

  function clearAllInputsValues() {
    inputs.forEach((input) => {
      input.value = '';
    });
  }

  function reset() {
    resetProjectDataValues();
    clearAllInputsValues();
    disableAddButton(addTaskButton);

    for (let tickNodeList in allTicks) {
      hideTicks(allTicks[tickNodeList], SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
    }

    for (let tickNodeList in allTicks) {
      showTick(allTicks[tickNodeList][0], SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
    }

    updateSelectButtonTextElements();
    updateSelectButtonIconElements();
  }

  function renderSelectListItems() {
    const selectPopupTicks = allTicks[valueName];

    updateSelectButtonUI(defaultColor, selectButtonTitleElement, selectButtonIconElement);
    /* resetAllTicks(allTicks, valueName); */

    colors.forEach((color, index) => {
      const selectListItemClone = projectEditorSelectListItemTemplate.content.cloneNode(true);
      const selectListItem = selectListItemClone.querySelector('.project-editor__select-item');

      selectListItem.setAttribute('data-hexCode', color.hexCode);

      const selectListItemTick = selectListItem.querySelector('.project-editor-select-item__tick');

      selectPopupTicks.push(selectListItemTick);

      if (index === 0) {
        showTick(selectListItemTick, SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
      }

      const selectListItemColorCircle = selectListItem.querySelector(
        '.project-editor__color-circle',
      );
      selectListItemColorCircle.style.backgroundColor = color.hexCode;

      const selectListItemTitle = selectListItem.querySelector(
        '.project-editor-select-item__title',
      );

      selectListItemTitle.textContent = color.title;

      selectListItem.addEventListener('click', () =>
        handlePopupItemClick(
          valueName,
          color,
          selectButtonTitleElement,
          selectButtonIconElement,
          updateSelectButtonTextElement,
          updateSelectButtonIconElement,
          updateDataValues,
          selectPopupTicks,
          selectListItemTick,
          SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
        ),
      );

      projectEditorSelectColorList.append(selectListItem);
    });
  }

  /* event's handlers */

  function handleCancelButtonClick(popup, classForVisibleState) {
    closePopup(popup, classForVisibleState);

    reset();
  }

  function handleInputChange(e, addButton, inputs) {
    const input = e.currentTarget;
    const valueName = input.name;
    projectDataValues[valueName] = input.value;

    toggleAddButtonDisabledState(isFormValid(inputs), addButton);
  }

  function addProject() {
    const project = createProjectWithUniqueId(projectDataValues);
    addProjectToProjectsArray(project);
  }

  function editProject() {
    chosenProject.edit(projectDataValues);
  }

  function handleAddTaskButtonClick(e, popup, classForVisibleState) {
    e.preventDefault();

    if (addTaskButton.textContent === 'Добавить') {
      addProject();
    } else {
      editProject();
    }

    projectNavigation.clear();
    projectNavigation.render();

    taskEditor.clear();
    taskEditor.render();

    closePopup(popup, classForVisibleState);

    reset();
  }

  /* event's listeners */

  projectTitle.addEventListener('input', (e) => handleInputChange(e, addTaskButton, projectTitle));

  projectEditorSelectColorButton.addEventListener('click', () =>
    togglePopup(projectEditorSelectColorPopup, SELECT_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  addTaskButton.addEventListener('submit', (e) => {
    handleAddTaskButtonClick(e, projectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE, projects);
  });

  projectEditorForm.addEventListener('submit', (e) =>
    handleAddTaskButtonClick(e, projectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE, projects),
  );

  projectEditorOverlay.addEventListener('mousedown', (e) =>
    handleEditorOverlayClick(
      e,
      projectEditorSelectPopupsNodeList,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      projectEditorSelectColorPopup,
      selectColorContainerChildrenList,
      SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(projectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  /* render functions */

  renderSelectListItems(
    projectEditorSelectColorList,
    projectEditorSelectColorButton,
    SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    colors,
  );

  return {
    renderListItems: renderSelectListItems,
    updateEditor,
  };
}
