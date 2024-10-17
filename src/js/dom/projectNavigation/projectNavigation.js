import {
  PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
  PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN,
  PROJECT_NAVIGATION_LIST_ITEM_HIDDEN,
} from './variables';

import { projects, inboxProject } from '../../..';

export default function projectNavigation() {
  /* query selectors */

  const projectNavigationOpenNewProjectPopupButton = document.querySelector(
    'project-navigation__open-add-new-project-popup',
  );
  const projectNavigationChevronButton = document.querySelector(
    '.project-navigation__chevron-button',
  );

  const projectNavigationList = document.querySelector('.project-navigation-list');

  const projectNavigationListItemTemplate = document.querySelector(
    '#project-navigation-list-item-template',
  );

  /* variables */

  let chosenProject = inboxProject;
  let chevronOpen = true;

  /* utils */

  function highlightInitialChosenProjectNavigationButton(projectNavigationButtons) {
    projectNavigationButtons.forEach((projectNavigationButton) => {
      const buttonText =
        projectNavigationButton.querySelector('.button-with-icon__text').textContent;

      if (chosenProject.title === buttonText) {
        projectNavigationButton.classList.add(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        );
      }
    });
  }

  function highlightProjectNavigationButton(projectNavigationButton) {
    projectNavigationButton.classList.add(PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE);
  }

  function renderProjectNavigationListItems(
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  ) {
    const projectNavigationButtons = [];

    projects.forEach((project) => {
      const projectNavigationListItemTemplateClone =
        projectNavigationListItemTemplate.content.cloneNode(true);

      const projectNavigationListItem = projectNavigationListItemTemplateClone.querySelector(
        '.project-navigation-list__item',
      );

      if (project === inboxProject) {
        projectNavigationListItem.classList.add('project-navigation-list__item_always_visible');
      }

      const projectNavigationButton = projectNavigationListItem.querySelector(
        '.project-navigation__button',
      );

      projectNavigationButtons.push(projectNavigationButton);

      const buttonWithIconText = projectNavigationListItem.querySelector('.button-with-icon__text');

      buttonWithIconText.textContent = project.title;

      projectNavigationListItem.addEventListener('click', () =>
        handleProjectNavigationListItemClick(
          projectNavigationButton,
          projectNavigationButtons,
          project,
        ),
      );

      projectNavigationList.append(projectNavigationListItem);
    });

    highlightInitialChosenProjectNavigationButton(projectNavigationButtons);
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
    chosenProject = project;

    removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons);
    highlightProjectNavigationButton(projectNavigationButton);
  }

  /* function handleProjectNavigationOpenNewProjectPopupButtonClick() {

  } */

  function handleProjectNavigationChevronButton() {
    switchChevronState();
    toggleChevronButtonStyles();
    toggleListItemsVisibilityState();
  }

  /* event's listeners */

  /* projectNavigationOpenNewProjectPopupButton.addEventListener(
    'click',
    handleProjectNavigationOpenNewProjectPopupButtonClick,
  );
 */

  projectNavigationChevronButton.addEventListener('click', handleProjectNavigationChevronButton);

  renderProjectNavigationListItems(
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  );
}
