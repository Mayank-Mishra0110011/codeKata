function formatDuration(seconds) {
  if (seconds == 0) return "now";
  const time = {
    year: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: seconds
  };
  let timeString = "";
  while (time.second >= 60) {
    time.second -= 60;
    time.minute++;
  }
  while (time.minute >= 60) {
    time.minute -= 60;
    time.hour++;
  }
  while (time.hour >= 24) {
    time.hour -= 24;
    time.day++;
  }
  while (time.day >= 365) {
    time.day -= 365;
    time.year++;
  }
  for (let t in time) {
    if (time[t] > 0 && time[t] == 1) {
      timeString += `,: ${time[t]} ${t}`;
    } else if (time[t] > 0) {
      timeString += `,: ${time[t]} ${t}s`;
    }
  }
  timeString = timeString.split(":");
  timeString.shift();
  if (timeString.length > 1) {
    timeString.splice(
      timeString.length - 2,
      1,
      timeString[timeString.length - 2].split(",")[0]
    );
    timeString.splice(timeString.length - 1, 0, " and");
  }
  return timeString.join("").trimLeft();
}
