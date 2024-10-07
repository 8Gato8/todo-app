import {
  TASK_EDITOR_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
} from '../variables';

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
/* const addTaskButton = document.querySelector('#add-task-button'); */

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

const projectPopupContainerChildrenList = makeElementChildrenList(projectChoiceContainer);
const priorityPopupContainerChildrenList = makeElementChildrenList(priorityChoiceContainer);

/* handlers */

function handelSidebarOpenTaskEditorButtonClick() {
  openPopup(taskEditorOverlay, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE);
}

function handleProjectChoicePopupButtonClick() {
  openPopup(projectChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE);
}

function handlePriorityChoicePopupButtonClick() {
  openPopup(priorityChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE);
}

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

function handleCancleButtonClick() {
  closePopup(taskEditorOverlay, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE);
}

/* event listeners */

sidebarOpenTaskEditorButton.addEventListener('click', handelSidebarOpenTaskEditorButtonClick);

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

chooseProjectButton.addEventListener('click', handleProjectChoicePopupButtonClick);

choosePriorityButton.addEventListener('click', handlePriorityChoicePopupButtonClick);

cancelButton.addEventListener('click', handleCancleButtonClick);
/* addTaskButton.addEventListener('click', addNewTask); */
