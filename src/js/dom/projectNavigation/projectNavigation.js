import { PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE } from './variables';

import { projects, inboxProject } from '../../..';

export default function projectNavigation() {
  /* query selectors */

  const projectNavigationList = document.querySelector('.project-navigation-list');
  const projectNavigationListItemTemplate = document.querySelector(
    '#project-navigation-list-item-template',
  );

  /* variables */

  let chosenProject = inboxProject;

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

  /* event's handlers */

  function handleNavigationListItemClick(
    projectNavigationButton,
    projectNavigationButtons,
    project,
  ) {
    chosenProject = project;

    removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons);
    highlightProjectNavigationButton(projectNavigationButton);
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

      const projectNavigationButton = projectNavigationListItem.querySelector(
        '.project-navigation__button',
      );

      projectNavigationButtons.push(projectNavigationButton);

      const buttonWithIconText = projectNavigationListItem.querySelector('.button-with-icon__text');

      buttonWithIconText.textContent = project.title;

      projectNavigationListItem.addEventListener('click', () =>
        handleNavigationListItemClick(projectNavigationButton, projectNavigationButtons, project),
      );

      projectNavigationList.append(projectNavigationListItem);
    });

    highlightInitialChosenProjectNavigationButton(projectNavigationButtons);
  }

  renderProjectNavigationListItems(
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  );
}
