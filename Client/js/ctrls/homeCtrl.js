/*
  But     : home's ctrl
  Auteur  : Noé Henchoz
  Date    : 26.05.2022 / v1.0 
*/

class HomeCtrl {

  constructor() {
    this.events();
    this.loadWeather(HOME_CITY1,"#title-city1","#icon1","#temp-city1",HOME_CITY1_TIMEZONE);
    this.loadWeather(HOME_CITY2,"#title-city2","#icon2","#temp-city2",HOME_CITY2_TIMEZONE);
    this.loadWeather(HOME_CITY3,"#title-city3","#icon3","#temp-city3",HOME_CITY3_TIMEZONE);
  }

  loadWeather(city, whereTitle, whereIcon, whereTemp, timeZone) {
    $(whereTitle).html(city);
    httpServ.getCurrent(city, (json) => {
      $(whereTemp).html(Math.round(json.current.temp_c) + "°C" + " / " + this.getActualTime(timeZone));
      $(whereIcon).attr("src", "https:" + json.current.condition.icon);
    });
  }

  getActualTime(timeZone) {
    let options = {
      timeZone: timeZone,
      hour: "numeric",
      minute: "numeric"
    },
    formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(new Date())
  }

  events() {
    $("#weather-1").click(() => {
      indexCtrl.changeViewToStation(HOME_CITY1);
    });
    $("#weather-2").click(() => {
      indexCtrl.changeViewToStation(HOME_CITY2);
    });
    $("#weather-3").click(() => {
      indexCtrl.changeViewToStation(HOME_CITY3);
    });
  }
}
