<?php

if (isset($_GET["reset-alarm"])) {
  setcookie('initial-alarm-time', $initial_alarm_time, time() - (86400 * 7));
  header("Location: index.php");
}

if (isset($_POST['set-alarm-button'])) {
  date_default_timezone_set('America/Sao_Paulo');

  $hours = $_POST['hours'];
  $minutes = $_POST['minutes'];

  $alarm_time = "$hours:$minutes";
  $time_today = date("H:i");
  store_in_cookie("alarm-time", $alarm_time);
  if ($alarm_time == $time_today) header("Location: index.php");

  $alarm_time_format = date("H:i", strtotime($alarm_time));

  $alarm_week_days = $_POST['alarm-week-days'];
}

function handle_week_days($time_diference, $is_alarm_time_less_than_time_now)
{
  global $alarm_week_days;
  if ($alarm_week_days != "Todo Dia" && $alarm_week_days != "Só Hoje") {
    $alarm_week_days_array = explode(', ', $alarm_week_days);
    // var_dump($alarm_week_days_array);
    $day_today_num = intval(date("w", strtotime(date('Y-m-d'))));

    $week_days = array("Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb");
    foreach ($week_days as $week_day_num => $week_day_name) {
      foreach ($alarm_week_days_array as $alarm_week_day) {
        if ($week_day_name == $alarm_week_day) {
          $week_days[$week_day_num] = 1;
          break;
        } else {
          $week_days[$week_day_num] = 0;
        }
      }
    }

    store_in_cookie("alarm-week-days", $week_days);

    $day_tomorrow_num = $day_today_num + 1;
    $day_tomorrow_num = $day_tomorrow_num == 7 ? 0 : $day_tomorrow_num;
    if (!$week_days[$day_today_num] || $is_alarm_time_less_than_time_now) {
      while (!$week_days[$day_tomorrow_num]) {
        $time_diference += 86400;
        $day_tomorrow_num++;
        if ($day_tomorrow_num == 7) $day_tomorrow_num = 0;
      }
    } else {
      //
    }
  } else {
    if ($alarm_week_days == "Todo Dia") $week_days = "1-1-1-1-1-1-1";
    if ($alarm_week_days == "Só Hoje") $week_days = "0-0-0-0-0-0-0";
    
    store_in_cookie("alarm-week-days", $week_days);
  }
  return $time_diference;
}

function get_time_diference_in_miliseconds($alarm_time)
{
  date_default_timezone_set('America/Sao_Paulo');
  $time_now = date("H:i");
  $time_diference = strtotime($alarm_time) - strtotime($time_now);
  $is_alarm_time_less_than_time_now = $alarm_time < $time_now;
  if ($alarm_time > $time_now) {
  } else if ($is_alarm_time_less_than_time_now) {
    $time_diference = (86400 + $time_diference);
  }
  $time_diference_in_miliseconds = handle_week_days($time_diference, $is_alarm_time_less_than_time_now) * 1000;
  store_in_cookie('initial-alarm-timestamp', $time_diference_in_miliseconds);
  return  $time_diference_in_miliseconds;
}

function store_in_cookie($name, $value)
{
  if (is_array($value)) {
    $value = implode(",", $value);
    $value = str_replace(",", "-", $value);
  }
  setcookie($name, $value, time() + (86400 * 7));
}

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="shortcut icon" href="src/favicon/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="src/css/style.css?v=<?php echo time() ?>" />
  <script defer src="src/js/runAlarm.js?v=<?php echo time() ?>"></script>
  <script defer src="https://kit.fontawesome.com/583fd2bd34.js" crossorigin="anonymous"></script>
  <title>Alarme</title>
</head>

<body>
  <header>
    <h1>O alarme irá tocar daqui a</h1>
  </header>
  <input type="hidden" id="alarm-time" value="<?php echo get_time_diference_in_miliseconds($alarm_time_format) ?>">

  <main class="container">
    <div class="alarm-clock">
      <svg>
        <circle id="alarm-loader" cx="200" cy="200" r="200"></circle>
        <circle id="alarm-loader-grow" cx="200" cy="200" r="200"></circle>
      </svg>
      <h2 class="loading">Carregando...</h2>
      <div class="alarm-countdown">
        <div id="days" class="time days"></div>
        <div id="hours" class="time hours"></div>
        <div id="minutes" class="time minutes"></div>
        <div id="seconds" class="time seconds"></div>
        <button id="stop-alarm" class="button">Parar Alarme</button>
        <button id="exit-alarm" class="button">Sair do Alarme</button>
      </div>
    </div>
    <div class="alarm-time">
      <i class="fa-regular fa-clock"></i>
      <div>
        <strong id="alarm-time"><?php echo $alarm_time_format ?></strong>
        <small id="alarm-week-days"><?php echo $alarm_week_days ?></small>
      </div>
      <button class="button" type="submit" name="reset-alarm">Alterar horário e dias</button>
    </div>
  </main>

</body>

</html>