// Marks a task OVERDUE if it's past due date and not completed
const checkOverdue = (task) => {
  if (task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date()) {
    return 'OVERDUE';
  }
  return task.status;
};

// Returns simple stats used by dashboards
const getTaskStats = (tasks) => {
  const stats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    review: 0,
    completed: 0,
    overdue: 0,
  };

  tasks.forEach((task) => {
    const status = checkOverdue(task);
    if (status === 'TODO') stats.todo++;
    else if (status === 'IN_PROGRESS') stats.inProgress++;
    else if (status === 'REVIEW') stats.review++;
    else if (status === 'COMPLETED') stats.completed++;
    else if (status === 'OVERDUE') stats.overdue++;
  });

  return stats;
};

module.exports = { checkOverdue, getTaskStats };
