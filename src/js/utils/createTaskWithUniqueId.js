import generateUniqueId from './generateUniqueId';
import createTask from '../task';
export default function createTaskWithUniqueId(newTaskData) {
  const id = generateUniqueId();

  const newTask = createTask({ ...newTaskData, id });

  return newTask;
}
