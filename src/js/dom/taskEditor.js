import {
  TASK_EDITOR_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
} from '../variables';

import { projects, inboxProject, priorities, addNewTask } from '../../';

/* query selectors */

export default function taskEditor() {
  const sidebarOpenTaskEditorButton = document.querySelector('.sidebar__open-task-editor-button');

  const taskEditorOverlay = document.querySelector('.task-editor-overlay');

  const choicePopupItemTemplate = document.querySelector('#choice-popup-item-template');

  const projectChoiceContainer = document.querySelector('#project-choice-container');
  const chooseProjectButton = document.querySelector('#choose-project-popup-button');
  const chosenProjectButtonText = document.querySelector('#chosen-project-button-text');
  const projectChoicePopup = document.querySelector('#project-choice-popup');

  const priorityChoiceContainer = document.querySelector('#priority-choice-container');
  const choosePriorityButton = document.querySelector('#choose-priority-popup-button');
  const chosenPriorityButtonText = document.querySelector('#chosen-priority-button-text');
  const priorityChoicePopup = document.querySelector('#priority-choice-popup');

  const choicePopupButtonsTextsObject = { chosenProjectButtonText, chosenPriorityButtonText };

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
    chosenProject: inboxProject,
    chosenPriority: priorities.find((priority) => priority.number === 1),
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
    capitalizedChoicePopupName,
    choicePopupDataItemTitle,
    choicePopupItemTick,
  ) {
    const newTaskDataValueProperty = newTaskDataValues[`chosen${capitalizedChoicePopupName}`];
    if (newTaskDataValueProperty.title === choicePopupDataItemTitle) {
      choicePopupItemTick.classList.add(CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
    }
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

  function updateChoicePopupButtonTextElement(
    choicePopupButtonTextElement,
    capitalizedChoicePopupName,
  ) {
    choicePopupButtonTextElement.textContent =
      newTaskDataValues[`chosen${capitalizedChoicePopupName}`].title;
  }

  function updateNewTaskDataValues(capitalizedChoicePopupName, taskDataValue) {
    newTaskDataValues[`chosen${capitalizedChoicePopupName}`] = taskDataValue;
  }

  function resetNewTaskDataValues() {
    newTaskDataValues = {
      title: '',
      description: '',
      dueTime: '',
      chosenProject: inboxProject,
      chosenPriority: priorities.find((priority) => priority.number === 1),
    };
  }

  function clearAllEditingAreaParams() {
    editingAreaInputs.forEach((editingAreaInput) => {
      editingAreaInput.value = '';
    });
  }

  function clearChosenValuesInPopup(choicePopupList, choicePopupData) {
    const choicePopupName = choicePopupList.dataset.name;
    const capitalizedChoicePopupName = choicePopupName[0].toUpperCase() + choicePopupName.slice(1);

    const choicePopupItemTicks = choicePopupList.querySelectorAll('.choice-popup-list__item-tick');

    removeTickMarkFromPrevioslySelectedPopupItem(choicePopupItemTicks);

    choicePopupData.forEach((choicePopupDataItem, index) => {
      markInitialChosenTaskPropertyWithTick(
        capitalizedChoicePopupName,
        choicePopupDataItem.title,
        choicePopupItemTicks[index],
      );
    });

    const choicePopupButtonTextElement =
      choicePopupButtonsTextsObject[`chosen${capitalizedChoicePopupName}ButtonText`];

    updateChoicePopupButtonTextElement(choicePopupButtonTextElement, capitalizedChoicePopupName);
  }

  function handleChoicePopupItemContainerElementClick(
    taskDataValue,
    capitalizedChoicePopupName,
    choicePopupItemTicks,
    choicePopupItemTick,
  ) {
    updateNewTaskDataValues(capitalizedChoicePopupName, taskDataValue);

    const choicePopupButtonTextElement =
      choicePopupButtonsTextsObject[`chosen${capitalizedChoicePopupName}ButtonText`];

    updateChoicePopupButtonTextElement(choicePopupButtonTextElement, capitalizedChoicePopupName);

    removeTickMarkFromPrevioslySelectedPopupItem(choicePopupItemTicks);
    markChosenTaskPropertyWithTick(choicePopupItemTick);
  }

  function renderChoicePopupElements(
    choicePopupListElement,
    choicePopupItemTemplate,
    choicePopupData,
  ) {
    const choicePopupItemTicks = [];

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

      const choicePopupName = choicePopupListElement.dataset.name;
      const capitalizedChoicePopupName =
        choicePopupName[0].toUpperCase() + choicePopupName.slice(1);

      markInitialChosenTaskPropertyWithTick(
        capitalizedChoicePopupName,
        choicePopupDataItem.title,
        choicePopupItemTick,
      );

      choicePopupItemContainerElement.addEventListener('click', (_) =>
        handleChoicePopupItemContainerElementClick(
          choicePopupDataItem,
          capitalizedChoicePopupName,
          choicePopupItemTicks,
          choicePopupItemTick,
        ),
      );

      choicePopupListElement.append(choicePopupItemContainerElement);
    });
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
  }

  /* event listeners */

  sidebarOpenTaskEditorButton.addEventListener('click', () =>
    openPopup(taskEditorOverlay, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE),
  );

  taskEditorOverlay.addEventListener('click', (e) =>
    handleTaskEditorOverlayClick(
      e,
      TASK_EDITOR_CLASS_FOR_VISIBLE_STATE,
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
    handleCancelButtonClick(taskEditorOverlay, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE),
  );

  editingAreaInputs.forEach((editingAreaInput) =>
    editingAreaInput.addEventListener('change', (e) => handleEditingAreaInputChange(e)),
  );

  addTaskButton.addEventListener('click', () => addNewTaskFromTaskEditor());

  renderChoicePopupElements(projectChoicePopupList, choicePopupItemTemplate, projects);
  renderChoicePopupElements(priorityChoicePopupList, choicePopupItemTemplate, priorities);
}
