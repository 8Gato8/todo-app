import {
  TASK_EDITOR_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
} from '../variables';

import { projects, inboxProject, priorities, addNewTask } from '../../';

/* query selectors */

export default function taskEditor() {
  const sidebarOpenTaskEditorButton = document.querySelector('.sidebar__open-task-editor-button');

  const taskEditorOverlay = document.querySelector('.task-editor-overlay');

  const choicePopupItemTemplate = document.querySelector('#choice-popup-item-template');

  const projectChoiceContainer = document.querySelector('#project-choice-container');
  const chooseProjectButton = document.querySelector('#choose-project-button');
  const projectChoicePopup = document.querySelector('#project-choice-popup');

  const priorityChoiceContainer = document.querySelector('#priority-choice-container');
  const choosePriorityButton = document.querySelector('#choose-priority-button');
  const priorityChoicePopup = document.querySelector('#priority-choice-popup');

  const projectChoicePopupList = document.querySelector('#project-choice-popup-list');
  const priorityChoicePopupList = document.querySelector('#priority-choice-popup-list');

  const choicePopupsNodeList = document.querySelectorAll('.choice-popup');

  const cancelButton = document.querySelector('#cancel-button');
  const addTaskButton = document.querySelector('#add-task-button');

  const editingAreaTitle = document.querySelector('.editing-area__title');
  const editingAreaDescription = document.querySelector('.editing-area__description');
  const editingAreaDueTime = document.querySelector('.editing-area__due-time');

  /* variables */

  const projectPopupContainerChildrenList = makeElementChildrenList(projectChoiceContainer);
  const priorityPopupContainerChildrenList = makeElementChildrenList(priorityChoiceContainer);

  const newTaskDataValues = {
    title: editingAreaTitle.value,
    description: editingAreaDescription.value,
    dueTime: editingAreaDueTime.value,
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

  function renderChoicePopupElements(
    choicePopupListElement,
    choicePopupItemTemplate,
    arrayOfItemsToAdd,
  ) {
    arrayOfItemsToAdd.forEach((item) => {
      const choicePopupItemElementTemplateClone = choicePopupItemTemplate.content.cloneNode(true);

      const choicePopupItemContainerElement = choicePopupItemElementTemplateClone.querySelector(
        '.choice-popup-list__item-container',
      );

      const choicePopupItemElement = choicePopupItemContainerElement.querySelector(
        '.choice-popup-list__item',
      );
      choicePopupItemElement.textContent = item.title;

      choicePopupItemContainerElement.addEventListener('click', () => {
        const choicePopupName = choicePopupListElement.dataset.name;
        const capitalizedChoicePopupName =
          choicePopupName[0].toUpperCase() + choicePopupName.slice(1);
        newTaskDataValues[`chosen${capitalizedChoicePopupName}`] = item;
        console.log(newTaskDataValues);
      });

      choicePopupListElement.append(choicePopupItemContainerElement);
    });
  }

  /* handlers */

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
    closePopup(taskEditorOverlay, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE),
  );

  addTaskButton.addEventListener('click', () =>
    addNewTaskFromTaskEditor(
      editingAreaTitle.value,
      editingAreaDescription.value,
      editingAreaDueTime.value,
      chosenProject,
      chosenPriority,
    ),
  );

  renderChoicePopupElements(projectChoicePopupList, choicePopupItemTemplate, projects);
  renderChoicePopupElements(priorityChoicePopupList, choicePopupItemTemplate, priorities);
}
