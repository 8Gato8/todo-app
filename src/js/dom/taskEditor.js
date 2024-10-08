import {
  TASK_EDITOR_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
} from '../variables';

import createTask from '../task';

import generateUniqueId from '../utils/generateUniqueId';

import { incomeProject } from '../..';

/* query selectors */

const sidebarOpenTaskEditorButton = document.querySelector('.sidebar__open-task-editor-button');

const taskEditorOverlay = document.querySelector('.task-editor-overlay');

const projectChoiceContainer = document.querySelector('#project-choice-container');
const chooseProjectButton = document.querySelector('#choose-project-button');
const projectChoicePopup = document.querySelector('#project-choice-popup');

const priorityChoiceContainer = document.querySelector('#priority-choice-container');
const choosePriorityButton = document.querySelector('#choose-priority-button');
const priorityChoicePopup = document.querySelector('#priority-choice-popup');

const choicePopupsNodeList = document.querySelectorAll('.popup-button__popup');

const cancelButton = document.querySelector('#cancel-button');
const addTaskButton = document.querySelector('#add-task-button');

const editingAreaTitle = document.querySelector('.editing-area__title');
const editingAreaDescription = document.querySelector('.editing-area__description');
const editingAreaDueTime = document.querySelector('.editing-area__due-time');

const chosenProject = document.querySelector('#chosen-project');
const chosenPriority = document.querySelector('#chosen-priority');

/* utils */

const isPopupOpen = (popup, classForVisibleState) => popup.classList.contains(classForVisibleState);

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

/* variables */

const projectPopupContainerChildrenList = makeElementChildrenList(projectChoiceContainer);
const priorityPopupContainerChildrenList = makeElementChildrenList(priorityChoiceContainer);

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

function handleClickOutsideChoicePopup(e, popup, popupContainerChildrenList, classForVisibleState) {
  if (!isPopupOpen(popup, classForVisibleState)) return;

  const target = e.target;

  if (popupContainerChildrenList.some((child) => child === target)) return;

  closePopup(popup, classForVisibleState);
}

function addNewTaskFromTaskEditor(
  title,
  description,
  dueTime,
  project = incomeProject,
  priority = 4,
) {
  const id = generateUniqueId();
  const newTask = createTask(title, description, dueTime, project, priority, id);
  project.addTask(newTask);
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

/* addTaskButton.addEventListener('click', () =>
  addNewTaskFromTaskEditor(
    editingAreaTitle.value,
    editingAreaDescription.value,
    editingAreaDueTime.value,
  ),
); */
