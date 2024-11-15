import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
} from './variables';

import {
  projects,
  inboxProject,
  priorities,
  createTaskWithUniqueId,
  addTaskToProject,
} from '../../..';

import {
  openPopup,
  closePopup,
  togglePopup,
  makeElementChildrenList,
  handleClickOutsidePopup,
  handleInputChange,
  handleCancelButtonClick,
  showTick,
  handlePopupItemClick,
  handleEditorOverlayClick,
  isFormValid,
  toggleAddButtonDisabledState,
} from '../commonUtils';

export default function taskEditor() {
  /* query selectors */

  const sidebarOpenTaskEditorButton = document.querySelector('.sidebar__open-task-editor-button');

  const taskEditorOverlay = document.querySelector('#task-editor-overlay');

  const choicePopupItemTemplate = document.querySelector('#choice-popup-item-template');

  const projectChoiceContainer = document.querySelector('#project-choice-container');
  const chooseProjectButton = document.querySelector('#choose-project-popup-button');
  const projectButtonText = document.querySelector('#project-button-text');
  const projectChoicePopup = document.querySelector('#project-choice-popup');

  const priorityChoiceContainer = document.querySelector('#priority-choice-container');
  const choosePriorityButton = document.querySelector('#choose-priority-popup-button');
  const priorityButtonText = document.querySelector('#priority-button-text');
  const priorityChoicePopup = document.querySelector('#priority-choice-popup');

  const choicePopupButtonsTextsObject = { projectButtonText, priorityButtonText };

  const projectChoicePopupList = document.querySelector('#project-choice-popup-list');
  const priorityChoicePopupList = document.querySelector('#priority-choice-popup-list');

  const choicePopupsNodeList = document.querySelectorAll('.choice-popup');

  const choicePopupButtonsTexts = document.querySelectorAll('.choice-popup-button__text');
  const choicePopupButtonsIcons = document.querySelectorAll('.choice-popup-button-icon');

  const cancelButton = document.querySelector('#cancel-button');
  const addTaskButton = document.querySelector('#add-task-button');

  const inputs = document.querySelectorAll('.editing-area-input');

  /* variables */

  const projectPopupContainerChildrenList = makeElementChildrenList(projectChoiceContainer);
  const priorityPopupContainerChildrenList = makeElementChildrenList(priorityChoiceContainer);

  const defaultPriority = priorities.find((priority) => priority.number === 1);

  const defaultChoicePopupsData = {
    project: inboxProject,
    priority: defaultPriority,
  };

  let newTaskDataValues = {
    title: '',
    description: '',
    dueTime: '',
    project: inboxProject,
    priority: defaultPriority,
  };

  const allTicks = {
    project: [],
    priority: [],
  };
  /* utils */

  function updateNewDataValues(valueName, dataValue) {
    newTaskDataValues[valueName] = dataValue;
  }

  function renderInitialPopupButtonUI(defaultChoicePopupData, popupButtonTitle, popupButtonIcon) {
    popupButtonIcon.style.fill = defaultChoicePopupData.color.hexCode;
    popupButtonTitle.textContent = defaultChoicePopupData.title;
  }

  function resetNewTaskDataValues() {
    newTaskDataValues = {
      title: '',
      description: '',
      dueTime: '',
      project: inboxProject,
      priority: priorities.find((priority) => priority.number === 1),
    };
  }

  function clearAllInputsValues() {
    inputs.forEach((input) => {
      input.value = '';
    });
  }

  function updatePopupButtonTextElements() {
    choicePopupButtonsTexts.forEach((choicePopupButtonsText) => {
      const valueName = choicePopupButtonsText.dataset.name;
      choicePopupButtonsText.textContent = newTaskDataValues[valueName].title;
    });
  }

  function updatePopupButtonIconElements() {
    choicePopupButtonsIcons.forEach((choicePopupButtonsIcon) => {
      const valueName = choicePopupButtonsIcon.dataset.name;
      choicePopupButtonsIcon.style.fill = newTaskDataValues[valueName].color.hexCode;
    });
  }

  function updatePopupButtonTextElement(popupButtonTextElement, valueName) {
    popupButtonTextElement.textContent = newTaskDataValues[valueName].title;
  }

  function updatePopupButtonIconElement(choicePopupButtonIcon, valueName) {
    choicePopupButtonIcon.style.fill = newTaskDataValues[valueName].color.hexCode;
  }

  function renderChoicePopupElements(
    choicePopupListElement,
    popupButton,
    tickItemClassForVisibleState,
    choicePopupItemTemplate,
    choicePopupData,
  ) {
    const choiceValueName = choicePopupListElement.dataset.name;
    const choicePopupItemTicks = allTicks[choiceValueName];

    const choicePopupButtonTitleElement = popupButton.querySelector('.choice-popup-button__text');
    const choicePopupButtonIconElement = popupButton.querySelector('.choice-popup-button-icon');

    const defaultChoicePopupData = defaultChoicePopupsData[choiceValueName];

    renderInitialPopupButtonUI(
      defaultChoicePopupData,
      choicePopupButtonTitleElement,
      choicePopupButtonIconElement,
    );

    choicePopupData.forEach((choicePopupDataItem, index) => {
      const choicePopupItemElementTemplateClone = choicePopupItemTemplate.content.cloneNode(true);

      const choicePopupItemContainerElement = choicePopupItemElementTemplateClone.querySelector(
        '.choice-popup-list__item-container',
      );

      const choicePopupItemElement = choicePopupItemContainerElement.querySelector(
        '.choice-popup-list__item',
      );

      const choicePopupItemTick = choicePopupItemContainerElement.querySelector(
        '.choice-popup-list__item-tick',
      );

      choicePopupItemTicks.push(choicePopupItemTick);

      if (index === 0) {
        showTick(choicePopupItemTick, tickItemClassForVisibleState);
      }

      choicePopupItemElement.textContent = choicePopupDataItem.title;

      const choicePopupButtonTextElement =
        choicePopupButtonsTextsObject[`${choiceValueName}ButtonText`];

      choicePopupItemContainerElement.addEventListener('click', () =>
        handlePopupItemClick(
          choiceValueName,
          choicePopupDataItem,
          choicePopupButtonTextElement,
          choicePopupButtonIconElement,
          updatePopupButtonTextElement,
          updatePopupButtonIconElement,
          updateNewDataValues,
          choicePopupItemTicks,
          choicePopupItemTick,
          tickItemClassForVisibleState,
        ),
      );

      choicePopupListElement.append(choicePopupItemContainerElement);
    });
  }

  /* event listener handlers */

  function handleAddTaskButtonClick(taskEditorOverlay, classForVisibleState) {
    const newTask = createTaskWithUniqueId(newTaskDataValues);
    addTaskToProject(newTask);

    closePopup(taskEditorOverlay, classForVisibleState);
  }

  function handleInputChange(e, addButton, inputs) {
    const input = e.currentTarget;
    const valueName = input.name;
    newTaskDataValues[valueName] = input.value;

    toggleAddButtonDisabledState(isFormValid(inputs), addButton);
  }

  /* event listeners */

  sidebarOpenTaskEditorButton.addEventListener('click', () =>
    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  taskEditorOverlay.addEventListener('click', (e) =>
    handleEditorOverlayClick(
      e,
      choicePopupsNodeList,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      projectChoicePopup,
      projectPopupContainerChildrenList,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      priorityChoicePopup,
      priorityPopupContainerChildrenList,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  chooseProjectButton.addEventListener('click', () =>
    togglePopup(projectChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  choosePriorityButton.addEventListener('click', () =>
    togglePopup(priorityChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(
      taskEditorOverlay,
      updatePopupButtonTextElements,
      updatePopupButtonIconElements,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      clearAllInputsValues,
      resetNewTaskDataValues,
      allTicks,
      CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  inputs.forEach((input) => {
    input.addEventListener('input', (e) => handleInputChange(e, addTaskButton, inputs));
  });

  addTaskButton.addEventListener('click', () =>
    handleAddTaskButtonClick(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  renderChoicePopupElements(
    projectChoicePopupList,
    chooseProjectButton,
    CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    choicePopupItemTemplate,
    projects,
  );
  renderChoicePopupElements(
    priorityChoicePopupList,
    choosePriorityButton,
    CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    choicePopupItemTemplate,
    priorities,
  );
}
