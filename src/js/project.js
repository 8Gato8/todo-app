class Project {
  #title;
  #id;
  #tasks = [];

  constructor({ title, id }) {
    this.#title = title;
    this.#id = id;
  }

  get title() {
    return this.#title;
  }
  set title(newTitle) {
    this.#title = newTitle;
  }

  get tasks() {
    return this.#tasks;
  }

  get id() {
    return this.#id;
  }

  addTask(newTask) {
    this.#tasks.push(newTask);
  }

  removeTaskById(taskToRemoveId) {
    this.#tasks = this.#tasks.filter((task) => task.id !== taskToRemoveId);
  }
}

export default function createProject(newProjectData) {
  return new Project(newProjectData);
}
