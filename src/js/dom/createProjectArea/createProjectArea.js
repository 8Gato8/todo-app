import { PROJECT_TASK_LIST_VISIBLE } from './variables';
import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  isPast,
  isToday,
  isTomorrow,
  isThisYear,
  getDate,
  getYear,
  format,
} from 'date-fns';

import {
  deleteTaskFromOpenedProject,
  openedProject,
  projectNavigation,
  taskEditor,
  setChosenTask,
} from '../../..';
import { openPopup } from '../commonUtils';

export default function createProjectArea() {
  /* query selectors */

  const taskEditorOverlay = document.querySelector('#task-editor-overlay');

  const projectArea = document.querySelector('.project');

  const projectTitle = projectArea.querySelector('.project__title');
  const projectTaskList = projectArea.querySelector('.project__task-list');

  const projectTaskListItemTemplate = document.querySelector(
    '#project-task-item-template'
  );

  const projectAddTaskButton = projectArea.querySelector(
    '#project-add-task-button'
  );

  /* utils */

  function updateProjectTitle() {
    projectTitle.textContent = openedProject.title;
  }

  function updateTaskDueTimeUI(task, textElement, iconElement) {
    const { dueDate, dueTime } = task;

    let date = null;

    if (!dueDate && !dueTime) return;

    if (!dueDate) {
      date = format(new Date(), 'yyyy-MM-dd');
    } else {
      date = dueDate;
    }

    const bodyStyles = getComputedStyle(document.body);

    let color = null;
    let finalString = '';

    const day = getDate(date);
    const month = format(date, 'MMMM');
    const year = getYear(date);

    const today = isToday(date);
    const past = dueTime
      ? isPast(format(`${date} ${dueTime}`, 'yyyy-MM-dd HH:mm'))
      : false;

    const tommorow = isTomorrow(date);

    let startOfString = `${day} ${month}`;
    let middleOfString = isThisYear(date) ? '' : ` ${year}`;
    let endOfString = dueTime || '';

    if (today) {
      color = bodyStyles.getPropertyValue('--dueItem-shedule-today-color');
      startOfString = 'Сегодня';
    }

    if (past) {
      color = bodyStyles.getPropertyValue('--dueItem-shedule-overdue-color');
    }

    if (tommorow) {
      color = bodyStyles.getPropertyValue('--dueItem-shedule-tomorrow-color');
      startOfString = 'Завтра';
    }

    finalString = `${startOfString} ${middleOfString} ${endOfString}`;
    textElement.textContent = finalString;
    textElement.style.setProperty('color', color);
    iconElement.style.setProperty('fill', color);
  }

  function clearTaskList() {
    while (projectTaskList.firstChild) {
      projectTaskList.removeChild(projectTaskList.firstChild);
    }
  }

  function renderTaskList() {
    const tasks = openedProject.tasks;

    if (tasks.length) {
      projectTaskList.classList.add(PROJECT_TASK_LIST_VISIBLE);
    } else {
      projectTaskList.classList.remove(PROJECT_TASK_LIST_VISIBLE);
    }

    tasks.forEach((task) => {
      const taskItemTemplateClone =
        projectTaskListItemTemplate.content.cloneNode(true);
      const taskItem =
        taskItemTemplateClone.querySelector('.project-task-item');

      const taskTitle = taskItem.querySelector('.project-task-item__title');
      taskTitle.textContent = task.title;

      const taskDescription = taskItem.querySelector(
        '.project-task-item__description'
      );
      const dueTimeContainer = taskItem.querySelector(
        '.project-task-item__due-time-container'
      );

      if (task.description || task.dueDate || task.dueTime) {
        taskItem.classList.add('project__task-item_two-rows');
      }

      if (task.description) {
        taskDescription.textContent = task.description;
        taskDescription.classList.add('project-task-item__description_visible');
      }

      if (task.dueDate || task.dueTime) {
        dueTimeContainer.classList.add(
          'project-task-item__due-time-container_visible'
        );
      }

      const taskDueTimeText = taskItem.querySelector(
        '.project-task-item__due-time-text'
      );
      const taskDueTimeIcon = taskItem.querySelector(
        '.project-task-item__due-time-icon'
      );

      updateTaskDueTimeUI(task, taskDueTimeText, taskDueTimeIcon);

      const taskEditButton = taskItem.querySelector(
        '#project-task-item-edit-button'
      );
      const taskDeleteButton = taskItem.querySelector(
        '#project-task-item-delete-button'
      );
      const taskCheckboxButton = taskItem.querySelector(
        '.project-task-item__checkmark-button'
      );
      const taskCheckmark = taskCheckboxButton.querySelector(
        '.project-task-item__checkmark'
      );

      taskCheckboxButton.style.borderColor = task.priority.color.hexCode;
      taskCheckmark.style.fill = task.priority.color.hexCode;

      taskCheckboxButton.addEventListener('click', () =>
        handleDeleteTaskButtonClick(task)
      );
      taskEditButton.addEventListener('click', () =>
        handleEditTaskButtonClick(task)
      );
      taskDeleteButton.addEventListener('click', () =>
        handleDeleteTaskButtonClick(task)
      );

      projectTaskList.append(taskItem);
    });
  }

  function updateProjectArea() {
    updateProjectTitle();
    clearTaskList();
    renderTaskList();
  }

  /* event's handlers */

  function handleAddTaskButtonClick() {
    const { id, title, color } = openedProject;
    const currentProject = { id, title, color };

    taskEditor.clear();
    taskEditor.updateEditor('Добавить задачу', { currentProject });

    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleEditTaskButtonClick(task) {
    setChosenTask(task);

    taskEditor.updateEditor('Сохранить', { task });

    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleDeleteTaskButtonClick(task) {
    deleteTaskFromOpenedProject(task);
    clearTaskList();
    renderTaskList();

    projectNavigation.clear();
    projectNavigation.render();
  }

  projectAddTaskButton.addEventListener('click', () =>
    handleAddTaskButtonClick()
  );

  return {
    renderTaskList,
    updateProjectArea,
  };
}
