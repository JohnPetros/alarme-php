const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const timers = document.querySelectorAll(".timer");

const insertWeekDaysNamesIntoInput = (alarmWeekDays) => {
  const alarmWeekDaysInput = document.querySelector('input[name="alarm-week-days"]');
  alarmWeekDaysInput.value = alarmWeekDays
}

const displayCheckedWeekDaysNames = (weekDaysNames) => {
  const weekDaysNamesDOM = document.getElementById(
    "checked-weekdays-name-container"
  );
  const areAllWeekDaysChecked = weekDaysNames.length === 7;
  const areAllWeekDaysNotChecked = weekDaysNames.length === 0;
  const alarmWeekDays = areAllWeekDaysChecked
    ? "Todos os Dias"
    : areAllWeekDaysNotChecked
    ? "Só Hoje"
    : weekDaysNames.join(", ");
  weekDaysNamesDOM.textContent = "Tocar " + alarmWeekDays;
  insertWeekDaysNamesIntoInput(alarmWeekDays)
};

const setCheckedWeekDays = () => {
  let checkedWeekDaysNames = [];
  const checkedWeekDays = document.querySelectorAll(".week-day.checked");
  checkedWeekDays.forEach((weekDay) => {
    const weekDayName = weekDay.childNodes[0].id;
    checkedWeekDaysNames.push(weekDayName);
  });
  console.log(checkedWeekDaysNames);
  displayCheckedWeekDaysNames(checkedWeekDaysNames);
};

const uncheckWeekDay = (event) => {
  const weekDay = event.target.parentNode;
  weekDay.classList.toggle("checked");
  setCheckedWeekDays();
  console.log(weekDay);
};

const formatTimerValue = (event) => {
  const timer = event.target;
  const timerValue = event.target.value;

  if (timerValue < 10) timer.value = "0" + timerValue;
};

checkboxes.forEach((checkbox) =>
  checkbox.addEventListener("change", uncheckWeekDay)
);

timers.forEach((timer) => timer.addEventListener("change", formatTimerValue));

setCheckedWeekDays()
