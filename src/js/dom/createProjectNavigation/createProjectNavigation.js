import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
  PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN,
  PROJECT_NAVIGATION_LIST_ITEM_HIDDEN,
} from './variables';

import {
  taskEditor,
  projectEditor,
  projectArea,
  deleteProjectFromProjectsArray,
  chosenProject,
  setChosenProject,
  openedProject,
  setOpenedProject,
} from '../../..';

import { openPopup, closePopup } from '../commonUtils';

export default function createProjectNavigation(projects, priorities, inboxProject) {
  /* project-navigation-block */

  /* query selectors */

  const addProjectButton = document.querySelector('.project-navigation__open-project-popup-button');

  const projectEditorOverlay = document.querySelector('#project-editor-overlay');

  const projectNavigationChevronButton = document.querySelector(
    '.project-navigation__chevron-button',
  );

  const projectNavigationList = document.querySelector('.project-navigation-list');

  const projectNavigationListItemTemplate = document.querySelector(
    '#project-navigation-list-item-template',
  );

  /* variables */

  let chevronOpen = true;

  /* utils */

  function highlightInitialOpenedProjectNavigationButton(projectNavigationButtons) {
    projectNavigationButtons.forEach((projectNavigationButton) => {
      const buttonText =
        projectNavigationButton.querySelector('.button-with-icon__text').textContent;

      if (openedProject.title === buttonText) {
        projectNavigationButton.classList.add(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        );
      }
    });
  }

  function highlightProjectNavigationButton(projectNavigationButton) {
    projectNavigationButton.classList.add(PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE);
  }

  function renderProjectNavigationListItems() {
    const projectNavigationButtons = [];

    projects.forEach((project) => {
      const projectNavigationListItemTemplateClone =
        projectNavigationListItemTemplate.content.cloneNode(true);

      const projectNavigationListItem = projectNavigationListItemTemplateClone.querySelector(
        '.project-navigation-list__item',
      );

      const projectNavigationButton = projectNavigationListItem.querySelector(
        '.project-navigation__button',
      );

      const openPopupButton = projectNavigationListItem.querySelector(
        '.project-navigation-button__open-popup',
      );

      const projectIcon = projectNavigationButton.querySelector('.icon');

      projectIcon.style.fill = project.color.hexCode;

      projectNavigationButtons.push(projectNavigationButton);

      const buttonWithIconText = projectNavigationListItem.querySelector('.button-with-icon__text');
      buttonWithIconText.textContent = project.title;

      const projectNavigationTaskCount = projectNavigationListItem.querySelector(
        '.project-navigation-button__task-count',
      );

      projectNavigationTaskCount.textContent = project.tasks.length || '';

      if (project === inboxProject) {
        projectNavigationListItem.classList.add('project-navigation-list__item_always_visible');
        openPopupButton.classList.add('project-navigation-button__open-popup_hidden');
      }

      projectNavigationListItem.addEventListener('click', () =>
        handleProjectNavigationListItemClick(
          projectNavigationButton,
          projectNavigationButtons,
          project,
        ),
      );

      projectNavigationList.append(projectNavigationListItem);

      const listItemCoordinates = projectNavigationListItem.getBoundingClientRect();
      openPopupButton.addEventListener('click', () =>
        handleOpenPopupClick(project, listItemCoordinates),
      );
    });

    highlightInitialOpenedProjectNavigationButton(projectNavigationButtons);
  }

  function clearProjectNavigationList() {
    while (projectNavigationList.firstChild) {
      projectNavigationList.removeChild(projectNavigationList.firstChild);
    }
  }

  function removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons) {
    projectNavigationButtons.forEach((projectNavigationButton) => {
      if (
        projectNavigationButton.classList.contains(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        )
      ) {
        projectNavigationButton.classList.remove(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        );
      }
    });
  }

  const switchChevronState = () => (chevronOpen = !chevronOpen);

  function toggleChevronButtonStyles() {
    if (chevronOpen) {
      projectNavigationChevronButton.classList.add(PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN);
    } else {
      projectNavigationChevronButton.classList.remove(PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN);
    }
  }

  function toggleListItemsVisibilityState() {
    const projectNavigationListItems = projectNavigationList.querySelectorAll(
      '.project-navigation-list__item',
    );

    projectNavigationListItems.forEach((projectNavigationListItem) => {
      if (chevronOpen) {
        projectNavigationListItem.classList.remove(PROJECT_NAVIGATION_LIST_ITEM_HIDDEN);
      } else {
        projectNavigationListItem.classList.add(PROJECT_NAVIGATION_LIST_ITEM_HIDDEN);
      }
    });
  }

  /* event's handlers */

  function handleProjectNavigationListItemClick(
    projectNavigationButton,
    projectNavigationButtons,
    project,
  ) {
    setOpenedProject(project);
    projectArea.updateProjectArea();
    removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons);
    highlightProjectNavigationButton(projectNavigationButton);
  }

  function handleProjectNavigationChevronButton() {
    switchChevronState();
    toggleChevronButtonStyles();
    toggleListItemsVisibilityState();
  }

  function handleAddProjectButtonClick() {
    projectEditor.updateEditor('Добавить проект', 'Добавить');

    openPopup(projectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  /* event's listeners */

  projectNavigationChevronButton.addEventListener('click', () =>
    handleProjectNavigationChevronButton(),
  );

  addProjectButton.addEventListener('click', () =>
    handleAddProjectButtonClick(projectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  /* other-actions-with-project-block */

  /* query selectors */

  const otherActionsOverlay = document.querySelector('#other-actions-with-project-overlay');
  const otherActionsPopup = document.querySelector('.other-actions-popup');

  const deleteProjectButton = document.querySelector('#delete-project-button');
  const editProjectButton = document.querySelector('#edit-project-button');

  /* variables */

  /* utils */

  /* event's handlers */

  function handleOpenPopupClick(project, listItemCoordinates) {
    setChosenProject(project);

    otherActionsPopup.style.top = `${listItemCoordinates.y}px`;

    openPopup(otherActionsOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleOverlayClick(e, classForVisibleState) {
    const { target, currentTarget: overlay } = e;

    if (target === overlay) {
      closePopup(overlay, classForVisibleState);
    }
  }

  function handleDeleteProjectButtonClick() {
    deleteProjectFromProjectsArray(chosenProject);

    setChosenProject(null);
    setOpenedProject(inboxProject);

    projectArea.updateProjectArea();

    clearProjectNavigationList();
    renderProjectNavigationListItems();

    taskEditor.clear();
    taskEditor.render(projects, priorities);

    closePopup(otherActionsOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  function handleEditProjectButtonClick() {
    closePopup(otherActionsOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);

    const { title, color } = chosenProject;
    const updatedProjectData = { title, color };

    projectEditor.updateEditor('Изменить', 'Сохранить', updatedProjectData);

    openPopup(projectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE);
  }

  /* event's listeners */

  otherActionsOverlay.addEventListener('click', (e) =>
    handleOverlayClick(e, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  deleteProjectButton.addEventListener('click', () => handleDeleteProjectButtonClick());
  editProjectButton.addEventListener('click', () => handleEditProjectButtonClick());

  return { render: renderProjectNavigationListItems, clear: clearProjectNavigationList };
}
