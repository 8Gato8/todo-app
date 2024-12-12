import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE,
  CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
} from './variables';

import { format } from 'date-fns';

import { projectNavigation, projectArea, chosenTask, addTask } from '../../..';

import createTask from '../../utils/createTask';

import {
  openPopup,
  closePopup,
  togglePopup,
  makeElementChildrenList,
  handleClickOutsidePopup,
  showTick,
  hideTicks,
  handleEditorOverlayClick,
  isFormValid,
  toggleAddButtonDisabledState,
  disableAddButton,
} from '../commonUtils';

import addItemToLocalStorage from '../../utils/addItemToLocalStorage';

export default function createTaskEditor(projects, priorities, inboxProject) {
  /* query selectors */

  const sidebarOpenTaskEditorButton = document.querySelector(
    '.sidebar__open-task-editor-button'
  );

  const taskEditorForm = document.querySelector('.task-editor');

  const taskEditorOverlay = document.querySelector('#task-editor-overlay');

  const choicePopupItemTemplate = document.querySelector(
    '#choice-popup-item-template'
  );
  const projectIconTemplate = document.querySelector('#project-icon-template');
  const priorityIconTemplate = document.querySelector(
    '#priority-icon-template'
  );
  const iconTemplatesObject = {
    project: projectIconTemplate,
    priority: priorityIconTemplate,
  };

  const projectChoiceContainer = document.querySelector(
    '#project-choice-container'
  );
  const chooseProjectButton = document.querySelector(
    '#choose-project-popup-button'
  );
  const projectButtonText = document.querySelector('#project-button-text');
  const projectChoicePopup = document.querySelector('#project-choice-popup');

  const priorityChoiceContainer = document.querySelector(
    '#priority-choice-container'
  );
  const choosePriorityButton = document.querySelector(
    '#choose-priority-popup-button'
  );
  const priorityButtonText = document.querySelector('#priority-button-text');
  const priorityChoicePopup = document.querySelector('#priority-choice-popup');

  const choicePopupButtonsTextsObject = {
    projectButtonText,
    priorityButtonText,
  };

  const projectChoicePopupList = document.querySelector(
    '#project-choice-popup-list'
  );
  const priorityChoicePopupList = document.querySelector(
    '#priority-choice-popup-list'
  );

  const choicePopupLists = document.querySelectorAll('.choice-popup-list');

  const choicePopupsNodeList = document.querySelectorAll('.choice-popup');

  const choicePopupButtonsTexts = document.querySelectorAll(
    '.choice-popup-button__text'
  );
  const choicePopupButtonsIcons = document.querySelectorAll(
    '.icon_offset_medium'
  );

  const cancelButton = document.querySelector('#cancel-button');
  const addTaskButton = document.querySelector('#add-task-button');

  const addTaskButtonTextElement = addTaskButton.querySelector(
    '.task-editor-add-task-button__text'
  );

  const inputs = document.querySelectorAll('.editing-area-input');

  const description = document.querySelector('.editing-area__description');

  const dueDate = document.querySelector('#due-date');
  const dueTime = document.querySelector('#due-time');

  const dueDateResetButton = document.querySelector('#due-date-reset-button');
  const dueTimeResetButton = document.querySelector('#due-time-reset-button');

  /* variables */

  const projectPopupContainerChildrenList = makeElementChildrenList(
    projectChoiceContainer
  );
  const priorityPopupContainerChildrenList = makeElementChildrenList(
    priorityChoiceContainer
  );

  const defaultPriority = priorities.find((priority) => priority.number === 1);

  const defaultChoicePopupsData = {
    project: inboxProject,
    priority: defaultPriority,
  };

  let taskData = {
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    project: {
      title: inboxProject.title,
      id: inboxProject.id,
      color: inboxProject.color,
    },
    priority: defaultPriority,
  };

  let allTicks = {
    project: [],
    priority: [],
  };
  /* utils */

  function updateTaskData(valueName, dataValue) {
    taskData[valueName] = dataValue;
  }

  function updateSelectButtonUI(
    choicePopupData,
    popupButtonTitle,
    popupButtonIcon
  ) {
    popupButtonIcon.style.fill = choicePopupData.color.hexCode;
    popupButtonTitle.textContent = choicePopupData.title;
  }

  function updateEditorSubmitButton(editorSubmitText) {
    addTaskButtonTextElement.textContent = editorSubmitText;
  }

  function updateInputsValues(task) {
    inputs.forEach((input) => {
      input.value = task[input.name];
    });
  }

  function updatePopupButtonTextElements() {
    choicePopupButtonsTexts.forEach((choicePopupButtonsText) => {
      const valueName = choicePopupButtonsText.dataset.name;
      choicePopupButtonsText.textContent = taskData[valueName].title;
    });
  }

  function updatePopupButtonIconElements() {
    choicePopupButtonsIcons.forEach((choicePopupButtonsIcon) => {
      const valueName = choicePopupButtonsIcon.dataset.name;
      choicePopupButtonsIcon.style.fill = taskData[valueName].color.hexCode;
    });
  }

  function updatePopupButtonTextElement(popupButtonTextElement, valueName) {
    popupButtonTextElement.textContent = taskData[valueName].title;
  }

  function updatePopupButtonIconElement(choicePopupButtonIcon, valueName) {
    choicePopupButtonIcon.style.fill = taskData[valueName].color.hexCode;
  }

  function updateDueDate() {
    if (!taskData.dueDate) return;

    taskData.dueDate = format(taskData.dueDate, 'yyyy-MM-dd');
  }

  function clearSpecificTicks(valueName) {
    allTicks[valueName] = [];
  }

  function updateEditor(editorSubmitText, options) {
    clearChoicePopupLists();

    const { task, currentProject, projects } = options;

    let projectsToRender = null;

    if (task) {
      taskData = task;

      projectsToRender = [task.project];

      renderChoicePopupsElements(projectsToRender, priorities);

      for (let ticks in allTicks) {
        hideTicks(
          allTicks[ticks],
          CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE
        );
      }

      const projectTick = document.querySelector(
        `[project="${task.project.id}"]`
      );
      const priorityTick = document.querySelector(
        `[priority="${task.priority.id}"]`
      );

      showTick(
        projectTick,
        CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE
      );
      showTick(
        priorityTick,
        CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE
      );
    }

    if (currentProject) {
      resetTaskData();
      taskData = { ...taskData, project: currentProject };
      projectsToRender = [currentProject];
      renderChoicePopupsElements(projectsToRender, priorities);
    }

    if (projects) {
      resetTaskData();
      projectsToRender = projects;
      renderChoicePopupsElements(projectsToRender, priorities);
    }

    updateDueDate();
    updateEditorSubmitButton(editorSubmitText);
    updateInputsValues(taskData);
    toggleAddButtonDisabledState(isFormValid(taskEditorForm), addTaskButton);
    updatePopupButtonTextElements();
    updatePopupButtonIconElements();
  }

  function renderChoicePopupElements(
    choicePopupListElement,
    popupButton,
    tickItemClassForVisibleState,
    choicePopupItemTemplate,
    choicePopupData
  ) {
    const choiceValueName = choicePopupListElement.dataset.name;

    clearSpecificTicks(choiceValueName);

    const choicePopupItemTicks = allTicks[choiceValueName];

    const choicePopupButtonTitleElement = popupButton.querySelector(
      '.choice-popup-button__text'
    );
    const choicePopupButtonIconElement = popupButton.querySelector('.icon');

    const defaultChoicePopupData = defaultChoicePopupsData[choiceValueName];

    updateSelectButtonUI(
      defaultChoicePopupData,
      choicePopupButtonTitleElement,
      choicePopupButtonIconElement
    );

    choicePopupData.forEach((choicePopupDataItem, index) => {
      const choicePopupItemElementTemplateClone =
        choicePopupItemTemplate.content.cloneNode(true);
      const iconTemplateClone =
        iconTemplatesObject[choiceValueName].content.cloneNode(true);

      const choicePopupItemIcon = iconTemplateClone.querySelector('.icon');

      choicePopupItemIcon.style.fill = choicePopupDataItem.color.hexCode;

      const choicePopupItemContainerElement =
        choicePopupItemElementTemplateClone.querySelector(
          '.choice-popup-list__item-container'
        );

      choicePopupItemContainerElement.prepend(choicePopupItemIcon);

      const choicePopupItemElement =
        choicePopupItemContainerElement.querySelector(
          '.choice-popup-list__item'
        );

      const choicePopupItemTick = choicePopupItemContainerElement.querySelector(
        '.choice-popup-list__item-tick'
      );

      choicePopupItemTick.setAttribute(choiceValueName, choicePopupDataItem.id);

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
          choicePopupItemTicks,
          choicePopupItemTick
        )
      );

      choicePopupListElement.append(choicePopupItemContainerElement);
    });
  }

  function renderChoicePopupsElements(projects, priorities) {
    renderChoicePopupElements(
      projectChoicePopupList,
      chooseProjectButton,
      CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
      choicePopupItemTemplate,
      projects
    );
    renderChoicePopupElements(
      priorityChoicePopupList,
      choosePriorityButton,
      CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
      choicePopupItemTemplate,
      priorities
    );
  }

  function clearChoicePopupLists() {
    choicePopupLists.forEach((list) => {
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
    });
  }

  function clearInputValue(input) {
    input.value = '';
  }

  function clearAllInputsValues() {
    inputs.forEach((input) => {
      clearInputValue(input);
    });
  }

  function resetTaskData() {
    taskData = {
      title: '',
      description: '',
      dueTime: '',
      dueDate: '',
      project: {
        id: inboxProject.id,
        title: inboxProject.title,
        color: inboxProject.color,
      },
      priority: defaultPriority,
    };
  }

  function reset() {
    resetTaskData();
    clearAllInputsValues();
    disableAddButton(addTaskButton);

    for (let tickNodeList in allTicks) {
      hideTicks(
        allTicks[tickNodeList],
        CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE
      );
    }

    for (let tickNodeList in allTicks) {
      showTick(
        allTicks[tickNodeList][0],
        CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE
      );
    }

    updatePopupButtonTextElements();
    updatePopupButtonIconElements();
  }

  /* event listener handlers */

  function handlePopupItemClick(
    valueName,
    newValue,
    choicePopupButtonTextElement,
    choicePopupButtonIconElement,
    ticks,
    currentTick
  ) {
    updateTaskData(valueName, newValue);

    updatePopupButtonTextElement(choicePopupButtonTextElement, valueName);
    updatePopupButtonIconElement(choicePopupButtonIconElement, valueName);

    hideTicks(ticks, CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
    showTick(currentTick, CHOICE_POPUP_LIST_ITEM_TICK_CLASS_FOR_VISIBLE_STATE);
  }

  function resetTextareaResize() {
    description.style.height = '';
  }

  function handleCancelButtonClick(popup, classForVisibleState) {
    closePopup(popup, classForVisibleState);
    resetTextareaResize();

    reset();
  }

  function addTaskToProject() {
    const newTask = createTask(taskData);
    const project = projects.find((p) => p.id === taskData.project.id);

    addTask(project.tasks, newTask);

    addItemToLocalStorage('projects', projects);
  }

  function editTask() {
    for (let propName in taskData) {
      chosenTask[propName] = taskData[propName];
    }

    addItemToLocalStorage('projects', projects);
  }

  function handleAddTaskButtonClick(e, popup, classForVisibleState) {
    e.preventDefault();

    if (addTaskButton.textContent.trim() === 'Добавить задачу') {
      addTaskToProject();
    } else {
      editTask();
    }

    projectNavigation.clear();
    projectNavigation.render();

    projectArea.updateProjectArea();

    closePopup(popup, classForVisibleState);
    resetTextareaResize();

    reset();
  }

  function addInputValueToTaskData(input) {
    const valueName = input.name;
    taskData[valueName] = input.value;
  }

  function handleInputChange(e, addButton) {
    const input = e.currentTarget;
    addInputValueToTaskData(input);

    toggleAddButtonDisabledState(isFormValid(taskEditorForm), addButton);
  }

  function handleSidebarOpenTaskEditorButtonClick() {
    updateEditor('Добавить задачу', { projects });

    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleDueDateResetButtonClick() {
    clearInputValue(dueDate);
    addInputValueToTaskData(dueDate);
  }

  function handleDueTimeResetButtonClick() {
    clearInputValue(dueTime);
    addInputValueToTaskData(dueTime);
  }

  /* event listeners */

  sidebarOpenTaskEditorButton.addEventListener('click', () =>
    handleSidebarOpenTaskEditorButtonClick(
      taskEditorOverlay,
      OVERLAY_CLASS_FOR_VISIBLE_STATE
    )
  );

  taskEditorOverlay.addEventListener('mousedown', (e) => {
    handleEditorOverlayClick(
      e,
      choicePopupsNodeList,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE
    );

    resetTextareaResize();
  });

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      projectChoicePopup,
      projectPopupContainerChildrenList,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE
    )
  );

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      priorityChoicePopup,
      priorityPopupContainerChildrenList,
      CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE
    )
  );

  chooseProjectButton.addEventListener('click', () =>
    togglePopup(projectChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE)
  );

  choosePriorityButton.addEventListener('click', () =>
    togglePopup(priorityChoicePopup, CHOICE_POPUP_CLASS_FOR_VISIBLE_STATE)
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE)
  );

  inputs.forEach((input) => {
    input.addEventListener('input', (e) => handleInputChange(e, addTaskButton));
  });

  dueDateResetButton.addEventListener('click', handleDueDateResetButtonClick);

  dueTimeResetButton.addEventListener('click', handleDueTimeResetButtonClick);

  addTaskButton.addEventListener('submit', (e) =>
    handleAddTaskButtonClick(
      e,
      taskEditorOverlay,
      OVERLAY_CLASS_FOR_VISIBLE_STATE
    )
  );

  taskEditorForm.addEventListener('submit', (e) => {
    handleAddTaskButtonClick(
      e,
      taskEditorOverlay,
      OVERLAY_CLASS_FOR_VISIBLE_STATE
    );
  });

  return {
    render: renderChoicePopupsElements,
    clear: clearChoicePopupLists,
    updateEditor,
  };
}
