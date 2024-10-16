type hoursAndMinute = {
  hours: number;
  minutes: number;
};

export const formatTime = (totalMinutes: number): hoursAndMinute => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};
