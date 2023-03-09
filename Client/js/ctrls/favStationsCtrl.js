/*
  But     : favorites stations's ctrl
  Auteur  : Noé Henchoz
  Date    : 01.02.2023 / v1.0 
*/

class FavStationsCtrl {

    constructor(favStations) {
        this.showFavStations(favStations);
    }

    static goToStation(city) {
        if ($('#navbarResponsive').hasClass('show')) {
            $('#navbarResponsive').removeClass('show');
        }
        $('#a-station').addClass('active');
        $('#a-fav-stations').removeClass('active');
        httpServ.loadView('station', () => new StationCtrl(city));
    }

    static deleteStation(city) {
        httpServ.removeStationToFavorites(city, (res) => {
            if (res.successfullyRemoved) {
                $('#a-fav-stations').click();
            } else {
                $('#liveToast').toast('show');
                $('#toast-error').html('Error while removing city...');
            }
        })
    }

    showFavStations(favStations) {
        if (favStations.length > 0) {
            $('#favStations').append(`<div class="accordion pb-5" id="accordion-fav-stations"></div>`);
            for (let i = 0; i < favStations.length; i++) {
                httpServ.getCurrent(favStations[i].name, (data) => {
                    $('#accordion-fav-stations').append(`
          <div class="accordion-item-${i}">
            <h2 class="accordion-header" id="heading-${i}">
              <button id="btn-access-fav-${i}" class="accordion-button title-accordion-items" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="true" aria-controls="collapse-${i}">
                  ${favStations[i].name}
              </button>
            </h2>
            <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}" data-bs-parent="#accordion-fav-stations">
                <div class="accordion-body d-flex justify-content-between align-items-center">
                  <button type="button" class="btn btn-primary" onclick="FavStationsCtrl.goToStation('${favStations[i].name}');">Station</button>
                  <div>
                    <img src="https://${data.current.condition.icon}" alt="icon">
                    <span>${data.current.temp_c} °C</span>
                  </div>
                  <button type="button" class="btn btn-primary" onclick="FavStationsCtrl.deleteStation('${favStations[i].name}');">Delete</button>
                </div>
            </div>
          </div>
        `);
                })
            }
        } else {
            $('#favStations').append(`<h1 class="div-no-favStations">You don't have any favorites stations</h1>`);
        }

    }

}
