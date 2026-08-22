const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

// Weighted formula:
// Task Completion = 40%, Attendance = 20%, On-Time Delivery = 20%, Productivity = 20%
const calculatePerformanceScore = async (employeeId) => {
  const tasks = await Task.find({ assignedTo: employeeId });
  const attendanceRecords = await Attendance.find({ employeeId });

  // Task completion score
  const totalTasks = tasks.length || 1;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const taskCompletionScore = Math.round((completedTasks / totalTasks) * 100);

  // On-time delivery score (completed before or on due date)
  const completedWithDates = tasks.filter((t) => t.status === 'COMPLETED' && t.completionDate);
  const onTimeCompleted = completedWithDates.filter(
    (t) => new Date(t.completionDate) <= new Date(t.dueDate)
  ).length;
  const onTimeDeliveryScore =
    completedWithDates.length > 0
      ? Math.round((onTimeCompleted / completedWithDates.length) * 100)
      : 100;

  // Attendance score
  const totalDays = attendanceRecords.length || 1;
  const presentDays = attendanceRecords.filter(
    (a) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length;
  const attendanceScore = Math.round((presentDays / totalDays) * 100);

  // Productivity score - based on average task progress
  const avgProgress =
    tasks.length > 0
      ? tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length
      : 0;
  const productivityScore = Math.round(avgProgress);

  const overallScore = Math.round(
    taskCompletionScore * 0.4 +
      attendanceScore * 0.2 +
      onTimeDeliveryScore * 0.2 +
      productivityScore * 0.2
  );

  return {
    taskCompletionScore,
    attendanceScore,
    onTimeDeliveryScore,
    productivityScore,
    overallScore,
  };
};

module.exports = { calculatePerformanceScore };
