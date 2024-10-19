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

export default function taskEditor() {
  /* query selectors */

  const sidebarOpenTaskEditorButton = document.querySelector('.sidebar__open-task-editor-button');

  const taskEditorOverlay = document.querySelector('.task-editor-overlay');

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

  const cancelButton = document.querySelector('#cancel-button');
  const addTaskButton = document.querySelector('#add-task-button');

  const editingAreaInputs = document.querySelectorAll('.editing-area-input');

  /* variables */

  const projectPopupContainerChildrenList = makeElementChildrenList(projectChoiceContainer);
  const priorityPopupContainerChildrenList = makeElementChildrenList(priorityChoiceContainer);

  let newTaskDataValues = {
    title: '',
    description: '',
    dueTime: '',
    project: inboxProject,
    priority: priorities.find((priority) => priority.number === 1),
  };

  /* utils */

  const isPopupOpen = (popup, classForVisibleState) =>
    popup.classList.contains(classForVisibleState);

  function openPopup(popup, classForVisibleState) {
    popup.classList.add(classForVisibleState);
  }

  function closePopup(popup, classForVisibleState) {
    popup.classList.remove(classForVisibleState);
  }

  function anyChoicePopupOpen(choicePopupsNodeList, classForVisibleState) {
    const choicePopupsArray = Array.from(choicePopupsNodeList);
    return choicePopupsArray.some((choicePopup) => isPopupOpen(choicePopup, classForVisibleState));
  }

  function makeElementChildrenList(elementNode) {
    const listOfChildren = [];

    if (elementNode.children.length === 0) return elementNode;

    for (let child of elementNode.children) {
      listOfChildren.push(child, makeElementChildrenList(child));
    }

    return listOfChildren.flat(Infinity);
  }

  function markInitialChosenTaskPropertyWithTick(
    choiceValueName,
    choicePopupData,
    choicePopupItemTicks,
  ) {
    const newTaskDataValueProperty = newTaskDataValues[choiceValueName];

    choicePopupItemTicks.forEach((choicePopupItemTick, i) => {
      if (newTaskDataValueProperty.title === choicePopupData[i].title) {
        choicePopupItemTick.classList.add(CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
      }
    });
  }

  function markChosenTaskPropertyWithTick(choicePopupItemTick) {
    choicePopupItemTick.classList.add(CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
  }

  function removeTickMarkFromPrevioslySelectedPopupItem(choicePopupItemTicks) {
    choicePopupItemTicks.forEach((choicePopupItemTick) => {
      if (
        choicePopupItemTick.classList.contains(CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE)
      ) {
        choicePopupItemTick.classList.remove(CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
      }
    });
  }

  function updateChoicePopupButtonTextElement(choicePopupButtonTextElement, choiceValueName) {
    choicePopupButtonTextElement.textContent = newTaskDataValues[choiceValueName].title;
  }

  function updateNewTaskDataValues(choiceValueName, taskDataValue) {
    newTaskDataValues[choiceValueName] = taskDataValue;
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

  function clearAllEditingAreaParams() {
    editingAreaInputs.forEach((editingAreaInput) => {
      editingAreaInput.value = '';
    });
  }

  function clearChosenValuesInPopup(choicePopupList, choicePopupData) {
    const choiceValueName = choicePopupList.dataset.name;

    const choicePopupItemTicks = choicePopupList.querySelectorAll('.choice-popup-list__item-tick');

    removeTickMarkFromPrevioslySelectedPopupItem(choicePopupItemTicks);

    markInitialChosenTaskPropertyWithTick(choiceValueName, choicePopupData, choicePopupItemTicks);

    const choicePopupButtonTextElement =
      choicePopupButtonsTextsObject[`${choiceValueName}ButtonText`];

    updateChoicePopupButtonTextElement(choicePopupButtonTextElement, choiceValueName);
  }

  function handleChoicePopupItemContainerElementClick(
    taskDataValue,
    choiceValueName,
    choicePopupItemTicks,
    choicePopupItemTick,
  ) {
    updateNewTaskDataValues(choiceValueName, taskDataValue);

    const choicePopupButtonTextElement =
      choicePopupButtonsTextsObject[`${choiceValueName}ButtonText`];

    updateChoicePopupButtonTextElement(choicePopupButtonTextElement, choiceValueName);

    removeTickMarkFromPrevioslySelectedPopupItem(choicePopupItemTicks);
    markChosenTaskPropertyWithTick(choicePopupItemTick);
  }

  function disableAddTaskButton() {
    addTaskButton.setAttribute('disabled', true);
  }

  function enableAddTaskButton() {
    addTaskButton.removeAttribute('disabled');
  }

  function toggleAddTaskButtonDisabledState(allInputsValid) {
    if (allInputsValid) {
      enableAddTaskButton();
    } else {
      disableAddTaskButton();
    }
  }

  function allInputsValid(editingAreaInputs) {
    const editingAreaInputsArray = Array.from(editingAreaInputs);
    const filteredEditingAreaInputsArray = editingAreaInputsArray.filter(
      (input) => input.dataset.value !== 'description',
    );

    return filteredEditingAreaInputsArray.every((input) => input.value !== '');
  }

  function renderChoicePopupElements(
    choicePopupListElement,
    choicePopupItemTemplate,
    choicePopupData,
  ) {
    const choicePopupItemTicks = [];

    const choiceValueName = choicePopupListElement.dataset.name;

    choicePopupData.forEach((choicePopupDataItem) => {
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

      choicePopupItemElement.textContent = choicePopupDataItem.title;

      choicePopupItemContainerElement.addEventListener('click', (_) =>
        handleChoicePopupItemContainerElementClick(
          choicePopupDataItem,
          choiceValueName,
          choicePopupItemTicks,
          choicePopupItemTick,
        ),
      );

      choicePopupListElement.append(choicePopupItemContainerElement);
    });

    markInitialChosenTaskPropertyWithTick(choiceValueName, choicePopupData, choicePopupItemTicks);
  }

  /* event listener handlers */

  function handleTaskEditorOverlayClick(
    e,
    taskEditorClassForVisibleState,
    choicePopupClassForVisibleState,
  ) {
    const popup = e.currentTarget;
    const target = e.target;

    if (
      target === popup &&
      !anyChoicePopupOpen(choicePopupsNodeList, choicePopupClassForVisibleState)
    ) {
      closePopup(popup, taskEditorClassForVisibleState);
    }
  }

  function handleClickOutsideChoicePopup(
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

  function handleCancelButtonClick(taskEditorOverlay, classForVisibleState) {
    clearAllEditingAreaParams();
    resetNewTaskDataValues();

    clearChosenValuesInPopup(projectChoicePopupList, projects);
    clearChosenValuesInPopup(priorityChoicePopupList, priorities);

    closePopup(taskEditorOverlay, classForVisibleState);
  }

  function handleEditingAreaInputChange(e) {
    const input = e.currentTarget;
    const valueName = input.dataset.value;
    newTaskDataValues[valueName] = input.value;

    toggleAddTaskButtonDisabledState(allInputsValid(editingAreaInputs));
  }

  function handleAddTaskButtonClick(taskEditorOverlay, classForVisibleState) {
    const newTask = createTaskWithUniqueId(newTaskDataValues);
    addTaskToProject(newTask);

    closePopup(taskEditorOverlay, classForVisibleState);
  }

  /* event listeners */

  sidebarOpenTaskEditorButton.addEventListener('click', () =>
    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  taskEditorOverlay.addEventListener('click', (e) =>
    handleTaskEditorOverlayClick(
      e,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsideChoicePopup(
      e,
      projectChoicePopup,
      projectPopupContainerChildrenList,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsideChoicePopup(
      e,
      priorityChoicePopup,
      priorityPopupContainerChildrenList,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  chooseProjectButton.addEventListener('click', () =>
    openPopup(projectChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  choosePriorityButton.addEventListener('click', () =>
    openPopup(priorityChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  editingAreaInputs.forEach((editingAreaInput) =>
    editingAreaInput.addEventListener('input', (e) => handleEditingAreaInputChange(e)),
  );

  addTaskButton.addEventListener('click', () =>
    handleAddTaskButtonClick(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  renderChoicePopupElements(projectChoicePopupList, choicePopupItemTemplate, projects);
  renderChoicePopupElements(priorityChoicePopupList, choicePopupItemTemplate, priorities);
}
