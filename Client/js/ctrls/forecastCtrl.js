/*
  But     : forecast's ctrl
  Auteur  : Noé Henchoz
  Date    : 08.06.2022 / v1.0 
*/

class ForecastCtrl {

  constructor(cityEntered) {
    this.cityEntered = cityEntered;
    this.fillAllForecast(cityEntered);
  }

  fillAllForecast(cityEntered) {
    httpServ.getForecast(cityEntered, (json) => {
      for (let i = 1; i <= 3; i++) {
        $('#date-'+i+'-forecast').html(new Date(json.forecast.forecastday[i-1].date).toDateString());
        $('#sunrise-'+i+'-forecast').html(json.forecast.forecastday[i-1].astro.sunrise);
        $('#sunset-'+i+'-forecast').html(json.forecast.forecastday[i-1].astro.sunset);
        $('#minTemp-'+i+'-forecast').html(json.forecast.forecastday[i-1].day.mintemp_c + '°C');
        $('#avgTemp-'+i+'-forecast').html(json.forecast.forecastday[i-1].day.avgtemp_c + '°C');
        $('#maxTemp-'+i+'-forecast').html(json.forecast.forecastday[i-1].day.maxtemp_c + '°C');
        for (let j = 1; j <= (json.forecast.forecastday[i-1].hour).length; j++) {
          $('#div-days-'+i+'-forecast').append('<div class="col-xl-1 col-lg-3 col-md-3 col-sm-3 col-6 text-center p-3" id="div-hours-'+i+'-'+j+'-forecast"></div>');
          $('#div-hours-'+i+'-'+j+'-forecast').append('<span id="days-hour-'+i+'-'+j+'-forecast"></span><br><img id="days-icon-'+i+'-'+j+'-forecast"><br><span id="days-temp-'+i+'-'+j+'-forecast"></span>');
          $('#days-hour-'+i+'-'+j+'-forecast').html(json.forecast.forecastday[i-1].hour[j-1].time.substring(11,16));
          $('#days-icon-'+i+'-'+j+'-forecast').attr('src', json.forecast.forecastday[i-1].hour[j-1].condition.icon);
          $('#days-temp-'+i+'-'+j+'-forecast').html(Math.round(json.forecast.forecastday[i-1].hour[j-1].temp_c) + '°C');
        }
      }
    });
  }

}
