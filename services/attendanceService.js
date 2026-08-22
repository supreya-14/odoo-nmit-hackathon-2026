// Calculates work hours and extra hours between check-in and check-out
const calculateWorkHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return { workHours: 0, extraHours: 0 };

  const diffMs = new Date(checkOut) - new Date(checkIn);
  const totalHours = diffMs / (1000 * 60 * 60);

  const standardWorkDay = 8; // standard working hours per day
  const workHours = Math.round(totalHours * 100) / 100;
  const extraHours =
    totalHours > standardWorkDay ? Math.round((totalHours - standardWorkDay) * 100) / 100 : 0;

  return { workHours, extraHours };
};

// Decides if the employee is "late" based on check-in time (after 10:00 AM = late)
const determineStatus = (checkIn) => {
  if (!checkIn) return 'ABSENT';
  const checkInTime = new Date(checkIn);
  const hours = checkInTime.getHours();
  const minutes = checkInTime.getMinutes();

  if (hours > 10 || (hours === 10 && minutes > 0)) {
    return 'LATE';
  }
  return 'PRESENT';
};

module.exports = { calculateWorkHours, determineStatus };
