import { PROJECT_TASK_LIST_VISIBLE } from './variables';
import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

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

  const projectTaskListItemTemplate = document.querySelector('#project-task-item-template');

  const projectAddTaskButton = projectArea.querySelector('#project-add-task-button');

  /* utils */

  function updateProjectTitle() {
    projectTitle.textContent = openedProject.title;
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
      const taskItemTemplateClone = projectTaskListItemTemplate.content.cloneNode(true);
      const taskItem = taskItemTemplateClone.querySelector('.project-task-item');

      const taskTitle = taskItem.querySelector('.project-task-item__title');
      const taskDescription = taskItem.querySelector('.project-task-item__description');

      taskTitle.textContent = task.title;

      if (task.description) {
        taskDescription.textContent = task.description;
        taskDescription.classList.add('project-task-item__description_visible');
        taskItem.classList.add('project__task-item_two-rows');
      }

      const taskEditButton = taskItem.querySelector('#project-task-item-edit-button');
      const taskDeleteButton = taskItem.querySelector('#project-task-item-delete-button');
      const taskCheckboxButton = taskItem.querySelector('.project-task-item__checkmark-button');

      taskCheckboxButton.addEventListener('click', () => handleDeleteTaskButtonClick(task));
      taskEditButton.addEventListener('click', () => handleEditTaskButtonClick(task));
      taskDeleteButton.addEventListener('click', () => handleDeleteTaskButtonClick(task));

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
    const currentProject = openedProject;

    taskEditor.clear();
    taskEditor.updateEditor('Добавить задачу', { currentProject });

    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleEditTaskButtonClick(task) {
    setChosenTask(task);

    const { title, description, dueTime, project, priority } = task;
    const updatedTaskData = { title, description, dueTime, project, priority };

    taskEditor.updateEditor('Сохранить', { updatedTaskData });

    openPopup(taskEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleDeleteTaskButtonClick(task) {
    deleteTaskFromOpenedProject(task);
    clearTaskList();
    renderTaskList();

    projectNavigation.clear();
    projectNavigation.render();
  }

  projectAddTaskButton.addEventListener('click', () => handleAddTaskButtonClick());

  return {
    renderTaskList,
    updateProjectArea,
  };
}
