/* query selectors */

const sidebarOpenTaskEditorButton = document.querySelector('.sidebar__open-task-editor-button');

const taskEditorContainer = document.querySelector('.task-editor-container');

const chooseProjectButton = document.querySelector('#choose-project-button');
const projectChoicePopup = document.querySelector('#project-choice-popup');

const choosePriorityButton = document.querySelector('#choose-priority-button');
const priorityChoicePopup = document.querySelector('#priority-choice-popup');

const cancelButton = document.querySelector('#cancel-button');
const addTaskButton = document.querySelector('#add-task-button');

/* constants */

const TASK_EDITOR_CLASS_FOR_VISIBLE_STATE = 'task-editor-container_visible';
const CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE = 'popup-button__popup_visible';

/* utils */

const isPopupOpen = (popup, classForVisibleState) => popup.classList.contains(classForVisibleState);

function openPopup(popup, classForVisibleState) {
  popup.classList.add(classForVisibleState);
}

function closePopup(popup, classForVisibleState) {
  popup.classList.remove(classForVisibleState);
}

/* handlers */

function handelSidebarOpenTaskEditorButtonClick() {
  openPopup(taskEditorContainer, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE);
}

function handleProjectChoicePopupButtonClick() {
  openPopup(projectChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE);
}

function handlePriorityChoicePopupButtonClick() {
  openPopup(priorityChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE);
}

function handleClickOutsidePopup(e, classForVisibleState) {
  const popup = e.currentTarget;
  const target = e.target;

  /* TODO: Доработать логику для закрытия попапов выбора проекта и приоритета */

  if (target === popup && isPopupOpen(popup, classForVisibleState)) {
    closePopup(popup, classForVisibleState);
  }
}

function handleCancleButtonClick() {
  closePopup(taskEditorContainer, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE);
}

/* event listeners */

sidebarOpenTaskEditorButton.addEventListener('click', handelSidebarOpenTaskEditorButtonClick);

taskEditorContainer.addEventListener('click', (e) =>
  handleClickOutsidePopup(e, TASK_EDITOR_CLASS_FOR_VISIBLE_STATE),
);

projectChoicePopup.addEventListener('click', (e) =>
  handleClickOutsidePopup(e, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE),
);

priorityChoicePopup.addEventListener('click', (e) =>
  handleClickOutsidePopup(e, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE),
);

chooseProjectButton.addEventListener('click', handleProjectChoicePopupButtonClick);

choosePriorityButton.addEventListener('click', handlePriorityChoicePopupButtonClick);

cancelButton.addEventListener('click', handleCancleButtonClick);
/* addTaskButton.addEventListener('click', addNewTask); */
