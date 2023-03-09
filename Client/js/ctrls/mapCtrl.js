/*
  But     : map's ctrl
  Auteur  : Noé Henchoz
  Date    : 08.06.2022 / v1.0 
*/

class MapCtrl {

  constructor(citySearched) {
    this.citySearched = citySearched;
    this.loadMap(citySearched);
  }

  loadMap(citySearched) {
    httpServ.getCurrent(citySearched, (json) => {
      this.initMap(json.location.lat, json.location.lon, citySearched);
    });
  }

  initMap(lat, lon, city) {
    const RED_MARKER_ICON = L.icon({
      iconUrl: "../../img/redmarkericon.png",
      iconSize: [18, 30],
      iconAnchor: [9, 30],
      popupAnchor: [0, -20],
    });

    const mapid = L.map("mapid").setView([lat, lon], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapid);

    L.marker([lat, lon], { icon: RED_MARKER_ICON })
      .addTo(mapid)
      .bindPopup(city);

  }
}
