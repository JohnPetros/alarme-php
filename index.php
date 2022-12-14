<?php
if (isset($_COOKIE["alarm-time"])) {
  $time = $_COOKIE["alarm-time"];
  $hours = substr($time, 0, 2);
  $minutes = substr($time, 3);
}

if (isset($_COOKIE["alarm-week-days"])) {
  $week_days = explode("-", $_COOKIE["alarm-week-days"]);
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="src/favicon/favicon.ico" type="image/x-icon">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="src/css/style.css?<?php echo time() ?>" />
  <script defer src="src/js/setAlarm.js?<?php echo time() ?>"></script>
  <title>Alarme</title>
</head>

<body>
  <header>
    <h1>Configurar Alarme</h1>
  </header>

  <form class="container" action="alarm.php" method="post">
    <div>
      <div class="timer-container">
        <input type="number" class="timer" name="hours" min="0" max="23" value="<?php echo isset($hours) ? $hours : "08" ?>" require />
        <small class="timer-unit">Horas</small>
      </div>
      <span class="colons">:</span>
      <div class="timer-container">
        <input type="number" class="timer" name="minutes" min="0" max="59" value="<?php echo isset($minutes) ? $minutes : "00" ?>" require />
        <small class="timer-unit">Minutos</small>
      </div>
    </div>
    <h3 id="checked-weekdays-name-container">Tocar Todo Dia</h3>
    <input type="hidden" name="alarm-week-days" value="Todo Dia">
    <div>
      <label for="Dom" class="week-day checked"><input type="checkbox" id="Dom" name="Dom" value="Dom" />do</label>
      <label for="Seg" class="week-day checked"><input type="checkbox" id="Seg" name="Seg" value="Seg" />se</label>
      <label for="Ter" class="week-day checked"><input type="checkbox" id="Ter" name="Ter" value="Ter" />te</label>
      <label for="Qua" class="week-day checked"><input type="checkbox" id="Qua" name="Qua" value="Qua" />qu</label>
      <label for="Qui" class="week-day checked"><input type="checkbox" id="Qui" name="Qui" value="Qui" />qu</label>
      <label for="Sex" class="week-day checked"><input type="checkbox" id="Sex" name="Sex" value="Sex" />se</label>
      <label for="S??b" class="week-day checked"><input type="checkbox" id="S??b" name="S??b" value="S??b" />s??</label>
    </div>
    <button type="submit" class="button" name="set-alarm-button">Confirmar</button>
  </form>
</body>

</html>