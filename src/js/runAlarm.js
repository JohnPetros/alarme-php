const daysContainer = document.querySelector("#days");
const hoursContainer = document.querySelector("#hours");
const minutesContainer = document.querySelector("#minutes");
const secondsContainer = document.querySelector("#seconds");
const timeContainers = document.querySelectorAll(".time");
const alarmCountdown = document.querySelector(".alarm-countdown");
const loading = document.querySelector(".loading");
const alarmWeekDaysNames =
  document.querySelector("#alarm-week-days").textContent;

let alarmTime = document.getElementById("alarm-time").value;
console.log(alarmTime);
const dateToday = new Date();
const ringSound = new Audio(
  "https://reneroth.xyz/files/codepen/pomodoro_ring.mp3"
);

let loaderPercentage = JSON.parse(localStorage.getItem("loader-percentage")) ?? 0;
let initialAlarmTime = alarmTime;
let delayTime = 0;
console.log(initialAlarmTime);

const handleTimeContainers = () => {
  timeContainers.forEach((timeContainer) => {
    const isTimeEqualToZero = timeContainer.textContent.indexOf("00") != -1;
    if (isTimeEqualToZero) {
      timeContainer.classList.add("hidden");
    } else {
      timeContainer.classList.remove("hidden");
    }
  });
};

const getTimeUnit = (unit) => (unit < 10 ? "0" + unit : unit);
const insertCountdownValues = ({ days, hours, minutes, seconds }) => {
  daysContainer.textContent = getTimeUnit(days) + "d";
  hoursContainer.textContent = getTimeUnit(hours) + "h";
  minutesContainer.textContent = getTimeUnit(minutes) + "m";
  secondsContainer.textContent = getTimeUnit(seconds) + "s";
  handleTimeContainers();
};

const updateLoader = (currentAlarmTime) => {
  const loaderGrow = document.querySelector("#alarm-loader-grow");
  loaderGrow.style.strokeDashoffset = `calc(var(--loader) - (var(--loader) * ${loaderPercentage}) )`;
  console.log(currentAlarmTime);

  // localStorage.setItem("loader-percentage", JSON.stringify(loaderPercentage))
  loaderPercentage = currentAlarmTime / initialAlarmTime;
  console.log(loaderPercentage);
};

const showButtonToExitAlarm = () => {
  const button = document.getElementById("exit-alarm");
  button.style.display = "block";
  button.addEventListener("click", () => {
    localStorage.removeItem("initial-alarm-time")
    localStorage.removeItem("alarm-repeatition")
    location.href = "index.php"
  });
}

const updateAlarmSet = (initialAlarmTime, alarmRepeatition) => {
  localStorage.setItem("initial-alarm-time", JSON.stringify(initialAlarmTime))
  localStorage.setItem("alarm-repeatition", JSON.stringify(alarmRepeatition))
}

const repeatAlarm = () => {
  let alarmRepeatition = localStorage.getItem("alarm-repeatition") ?? getAlarmRepetition();
  let alarmInterval = getAlarmInterval(alarmWeekDaysNames);
  console.log(alarmRepeatition);

  if (alarmRepeatition != 0) {
    alarmTime = Number(initialAlarmTime) + alarmInterval;
    initialAlarmTime = alarmTime;
    updateAlarmSet(initialAlarmTime, alarmRepeatition)
    timer = setInterval(updateCountdown, 1000);
  }
  alarmRepeatition--;
  if (alarmRepeatition == 0) {
    showButtonToExitAlarm()
  }
};

const countDelayTime = () => {
  delayTime += 10000 * 60;
}

const showButtonToStopAlarm = () => {
  const button = document.getElementById("stop-alarm");
  button.style.display = "block";
  let delayTimer = setInterval(countDelayTime, 10000 * 60)
  button.addEventListener("click", (event) => {
    event.target.remove();
    ringSound.pause();
    clearInterval(delayTimer);
    repeatAlarm(getAlarmRepetition());
  });
};

const handleAlarm = (time) => {
  const stopCounting = () => clearInterval(timer);
  if (time === 0) {
    ringSound.play();
    ringSound.loop = true;
    showButtonToStopAlarm();
    stopCounting();
  }
};

function updateCurrentTime(currentTime) {
  localStorage.setItem("current-time", JSON.stringify(currentTime))
}

const updateCountdown = () => {
  // console.log(alarmTime);
  alarmTime -= 1000;
  updateLoader(alarmTime);
  updateCurrentTime(alarmTime);
  const days = Math.floor(alarmTime / 1000 / 60 / 60 / 24);
  const hours = Math.floor(alarmTime / 1000 / 60 / 60) % 24;
  const minutes = Math.floor(alarmTime / 1000 / 60) % 60;
  const seconds = Math.floor(alarmTime / 1000) % 60;

  handleAlarm(alarmTime);

  insertCountdownValues({
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  });
};

let timer = setInterval(updateCountdown, 1000);

const getAlarmInterval = (alarmWeekDays) => {
  let interval = 86400000 + delayTime;
  if (alarmWeekDays != "Todo Dia" && alarmWeekDays != "Só Hoje") {
    alarmWeekDays = getAlarmWeekDaysArray();
    let weekDayTomorrow = dateToday.getDay() + 1;
    if (weekDayTomorrow === 7) weekDayTomorrow = 0;

    while (!alarmWeekDays[weekDayTomorrow]) {
      console.log(weekDayTomorrow);
      console.log(alarmWeekDays[weekDayTomorrow]);

      interval *= 2;
      weekDayTomorrow++;
      if (weekDayTomorrow === 7) weekDayTomorrow = 0;
    }
  }
  return interval;
};

function getCookieValue(cookieName) {
  let cookie = {};
  document.cookie.split(";").forEach((el) => {
    let [key, value] = el.split("=");
    cookie[key.trim()] = value;
  });
  return cookie[cookieName];
};

const getAlarmWeekDaysArray = () => {
  return getCookieValue("alarm-week-days").split("-").map(Number);
};

const getAlarmRepetition = () => {
  let alarmRepeatition;
  if (alarmWeekDaysNames === "Todo Dia") {
    alarmRepeatition = 6;
  } else if (alarmWeekDaysNames === "Só Hoje") {
    alarmRepeatition = 0;
  } else {
    let alarmWeekDays = getAlarmWeekDaysArray();
    alarmRepeatition =
      alarmWeekDays.filter((weekDay) => {
        if (weekDay) {
          return weekDay;
        }
      }).length - 1;
  }
  return alarmRepeatition;
};

const handleCountdownDisplay = () => {
  loading.remove();
  alarmCountdown.style.display = "flex";
};

setTimeout(handleCountdownDisplay, 1000);

console.log(getAlarmRepetition())
