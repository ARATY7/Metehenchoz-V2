/*
  But     : currents's ctrl
  Auteur  : Noé Henchoz
  Date    : 08.06.2022 / v1.0 
*/

class CurrentCtrl {
  
  constructor(cityEntered) {
    this.cityEntered = cityEntered;
    this.loadEvents(cityEntered);
    this.fillAll(cityEntered);
  }

  fillAll(cityEntered) {
    httpServ.getCurrent(cityEntered, (json) => {
      $("#temperature-current").html(json.current.temp_c + "°C");
      $("#feelslike-current").html(json.current.feelslike_c + "°C");
      $("#humidity-current").html(json.current.humidity + "%");
      $("#cloud-current").html(json.current.cloud + "%");
      $('#wind-current').html(json.current.wind_kph + ' km/h');
      $('#windDir-current').html(json.current.wind_dir);
      $('#gust-current').html(json.current.gust_kph + ' km/h');
      $('#uv-current').html(json.current.uv);
      $('#pressure-current').html(json.current.pressure_mb + ' mb');
      $('#precip-current').html(json.current.precip_mm + " mm");
      $('#lastUpdate-current').html(json.current.last_updated);
    });
  }

  loadEvents(cityEntered) {
    $('#div-temperature-current').click(() => {
      this.changeActualCToF(cityEntered);
    });
    $('#div-feelslike-current').click(() => {
      this.changeFeelslikeCToF(cityEntered);
    });
    $('#div-wind-current').click(() => {
      this.changeWindKmToMi(cityEntered);
    });
    $('#div-gust-current').click(() => {
      this.changeGustKmToMi(cityEntered);
    });
    $('#div-pressure-current').click(() => {
      this.changePressureMbToIn(cityEntered);
    });
    $('#div-precip-current').click(() => {
      this.changePrecipMmToIn(cityEntered);
    });
    $('#btn-update-current').click(() => {
      this.fillAll(cityEntered);
    });
  }
  
  changeActualCToF(cityEntered) {
    if (document.getElementById('temperature-current').textContent.includes('°C')) {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#temperature-current").html(json.current.temp_f + "°F");
      });
    } else {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#temperature-current").html(json.current.temp_c + "°C");
      });
    }
  }

  changeFeelslikeCToF(cityEntered) {
    if (document.getElementById('feelslike-current').textContent.includes('°C')) {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#feelslike-current").html(json.current.feelslike_f + "°F");
      });
    } else {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#feelslike-current").html(json.current.feelslike_c + "°C");
      });
    }
  }

  changeWindKmToMi(cityEntered) {
    if (document.getElementById('wind-current').textContent.includes('km/h')) {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#wind-current").html(json.current.wind_mph + " miles/h");
      });
    } else {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#wind-current").html(json.current.wind_kph + " km/h");
      });
    }
  }

  changeGustKmToMi(cityEntered) {
    if (document.getElementById('gust-current').textContent.includes('km/h')) {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#gust-current").html(json.current.gust_mph + " miles/h");
      });
    } else {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#gust-current").html(json.current.gust_kph + " km/h");
      });
    }
  }

  changePressureMbToIn(cityEntered) {
    if (document.getElementById('pressure-current').textContent.includes('mb')) {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#pressure-current").html(json.current.pressure_in + " in");
      });
    } else {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#pressure-current").html(json.current.pressure_mb + " mb");
      });
    }
  }

  changePrecipMmToIn(cityEntered) {
    if (document.getElementById('precip-current').textContent.includes('mm')) {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#precip-current").html(json.current.precip_in + " in");
      });
    } else {
      httpServ.getCurrent(cityEntered, (json) => {
        $("#precip-current").html(json.current.precip_mm + " mm");
      });
    }
  }

}
