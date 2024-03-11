export function formatTimeToAMPM(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = minute < 10 ? "0" + minute : minute;
  return `${formattedHour}:${formattedMinute} ${period}`;
}
