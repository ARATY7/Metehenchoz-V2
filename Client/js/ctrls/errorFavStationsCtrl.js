/*
  But     : Main Ctrl
  Auteur  : Noé Henchoz
  Date    : 01.02.2023 / v1.1
*/

class ErrorFavStationsCtrl {

    constructor() {
        this.loadEvents();
    }

    loadEvents() {
        $('#btnSignInFromFavStations').click(() => {
            $('#nav-btn-login').click();
        })
    }

}