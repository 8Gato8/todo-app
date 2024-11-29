import generateUniqueId from './generateUniqueId';

export default function createTask(taskData) {
  const id = generateUniqueId();

  const checklist = [];

  const { project } = taskData;

  return {
    ...taskData,
    id,
    checklist,
    project: { id: project.id, title: project.title, color: project.color },
  };
}
