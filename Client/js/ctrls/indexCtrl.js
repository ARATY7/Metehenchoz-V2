/*
  But     : Main Ctrl
  Auteur  : Noé Henchoz
  Date    : 01.02.2023 / v1.1 
*/

$().ready(() => {
    httpServ = new HttpServ();
    indexCtrl = new IndexCtrl();
});

class IndexCtrl {

    constructor() {
        this.loadIcon();
        this.loadHome();
        this.loadFooter();
        this.loadEvents();
        // contrôle si l'utilisateur est connecté au lancement du site
        httpServ.checkIfConnected((res) => {
            if (res.isConnected) {
                this.showAllConnected();
            }
        });
        // contrôle si l'utilisateur est admin au lancement du site
        httpServ.checkIfAdmin((res) => {
            if (res.isAdmin) {
                this.showAllConnectedAdmin();
            }
        })
    }

    // Charge l'icône du site. Icône soleil si l'heure actuelle est entre 8h du matin et 20h, sinon lune.
    loadIcon() {
        let heure = new Date().getHours();
        if (heure >= 8 && heure <= 20) {
            $('#icon').attr('href', 'assets/img/sun.jpg');
        }
    }

    // Close navbar collapse when link clicked ( to have better experience on mobile phone )
    hideNavCollapsed() {
        if ($('#navbarResponsive').hasClass('show')) {
            $('#navbarResponsive').removeClass('show');
        }
    }

    // Chargement des différentes vues
    loadHome() {
        httpServ.loadView('home', () => new HomeCtrl());
    }

    loadFooter() {
        httpServ.loadView('footer', () => new FooterCtrl());
    }

    loadStation(city) {
        httpServ.loadView('station', () => new StationCtrl(city));
    }

    loadFavStations(favStations) {
        httpServ.loadView('favStations', () => new FavStationsCtrl(favStations));
    }

    loadErrorFavStations() {
        httpServ.loadView('errorFavStations', () => new ErrorFavStationsCtrl());
    }

    loadAccount(data) {
        httpServ.loadView('account', () => new AccountCtrl(data));
    }

    loadAdmin() {
        httpServ.loadView('admin', () => new AdminCtrl());
    }

    /**
     * Permet de lancer la vue "station".
     *
     * @param cityEntered La ville cherchée
     */
    changeViewToStation(cityEntered) {
        this.hideNavCollapsed();
        this.loadStation(cityEntered);
        $('#a-station').addClass('active');
        $('#a-fav-stations').removeClass('active');
        $('#a-admin-panel').removeClass('active');
        $('#nav-in-search').val('');
    }

    /**
     * Lancement des différents évènements du site.
     */
    loadEvents() {
        $('#a-home').click(() => {
            this.hideNavCollapsed();
            $('a.nav-link').removeClass('active');
            this.loadHome();
        });


        $('#a-station').click(() => {
            this.hideNavCollapsed();
            $('a.nav-link').removeClass('active');
            $('#a-station').addClass('active');
            this.loadStation(STATION_CITY_DEFAULT);
        });

        $('#a-fav-stations').click(() => {
            this.hideNavCollapsed();
            $('a.nav-link').removeClass('active');
            $('#a-fav-stations').addClass('active');
            httpServ.checkIfConnected((res) => {
                if (res.isConnected) {
                    httpServ.getFavStations((data) => {
                        this.loadFavStations(data);
                    });
                } else {
                    this.loadErrorFavStations();
                }
            });
        });

        $('#nav-btn-search').click(() => {
            let cityEntered = $('#nav-in-search').val();
            if (cityEntered !== '' && !cityEntered.match(/[0-9]+$/)) {
                this.changeViewToStation(cityEntered);
            } else {
                $('#liveToast').toast("show");
                $('#toast-error').html('Please enter a valid city...');
            }
        });

        $('#nav-in-search').keypress((event) => {
            let keycode = event.keyCode ? event.keyCode : event.which;
            if (keycode === 13) {
                event.preventDefault();
                let cityEntered = $('#nav-in-search').val();
                if (cityEntered !== '' && !cityEntered.match(/[0-9]+$/)) {
                    this.changeViewToStation(cityEntered);
                } else {
                    $('#liveToast').toast("show");
                    $('#toast-error').html('Please enter a valid city...');
                }
            }
        });

        $('#nav-btn-locate').click(() => {
            navigator.geolocation.getCurrentPosition((position) => {
                let latLon = position.coords.latitude + ',' + position.coords.longitude;
                this.changeViewToStation(latLon);
            });
        });

        $('#nav-btn-login').click(() => {
            this.hideNavCollapsed();
            $("#loginModal").modal("show");
        });

        $('#linkGoToSignUp').click(() => {
            $("#loginModal").modal("hide");
            $("#signUpModal").modal("show");
        });

        $('#linkGoToLogin').click(() => {
            $("#signUpModal").modal("hide");
            $("#loginModal").modal("show");
        });

        $('#goBack').click(() => {
            $('#mailToVerif').html('');
            $("#mailVerificationModal").modal("hide");
            $("#signUpModal").modal("show");
        });

        $('#linkForgotPassword').click(() => {
            $('#signInMailAddress').val('');
            $('#signInPassword').val('');
            $('#loginModal').modal('hide');
            $('#forgottenPasswordModal').modal('show');
        });

        $('#goToLogin').click(() => {
            $('#forgottenPasswordModal').modal('hide');
            $('#input-mail-forgotten-password').val('');
            $('#loginModal').modal('show');
        });

        $('#btn-send-forgotten-password').click(() => {
            if (this.checkInputMail()) {
                httpServ.sendNewPasswordByMail($('#input-mail-forgotten-password').val(), (res) => {
                    if (!res.accountExists) {
                        $('#errorMessageMailForgottenPassword').html('Account not found with this mail address...')
                        $('#input-mail-forgotten-password').css("background-color", "#ff726f");
                    } else {
                        $('#input-mail-forgotten-password').css("background-color", "#ffffff");
                        $('#errorMessageMailForgottenPassword').html('')
                        $('#forgottenPasswordModal').modal('hide');
                        $('#liveToast').toast("show");
                        $('#toast-error').html('Email sent !');
                    }
                })
            }
        });

        $('#btnSignUp').click(() => {
            if (this.checkInputsBeforeSignUp()) {
                let name = $('#signUpName').val();
                let firstName = $('#signUpFirstName').val();
                let mail = $('#signUpMailAddress').val();
                let password = $('#signUpPassword').val();
                httpServ.sendCodeByMail(name, firstName, mail, password, (result) => {
                    if (result.accountAlreadyExists === false) {
                        $("#signUpModal").modal("hide");
                        $("#mailVerificationModal").modal("show");
                        $('#mailToVerif').html(mail);
                    } else {
                        $('#errorMessage').html("Error : Mail already associated to an account")
                    }
                });
            } else {
                $('#errorMessage').html('Please fill all fields. The email must include "@" and ".xxx" and the password must include at least one upper and lower case letter, one number and one special character allowed: "!@#$%^&*()_-=+;:,?"')
            }
        });

        $('#signUpName, #signUpFirstName, #signUpMailAddress, #signUpPassword, #signUpPassword2').keypress((e) => {
            if (e.keyCode === 13) {
                $('#btnSignUp').click();
            }
        });

        $('#btnCreateAccount').click(() => {
            let mail = $('#signUpMailAddress').val();
            let password = $('#signUpPassword').val();
            httpServ.checkCode($('#mailVerif').val(), (result) => {
                if (result.accountSuccessfullyCreated === true) {
                    $("#mailVerificationModal").modal("hide");
                    httpServ.signIn(mail, password, (result) => {
                        if (result.accountExists === false) {
                            $('#errorMessageSignIn').html("Error : Account not found, please sign up");
                        } else if (result.loginOk === false) {
                            $('#errorMessageSignIn').html("Error : Password incorrect");
                        } else if (result.loginOk === true) {
                            $('#toast-error').html('You\'re now connected as ' + mail);
                            $('#liveToast').toast("show");
                            this.showAllConnected();
                        }
                    });
                    $('#errorMessage').html('');
                    $('#signUpName').val("");
                    $('#signUpFirstName').val("");
                    $('#signUpMailAddress').val("");
                    $('#signUpPassword').val("");
                    $('#signUpPassword2').val("");
                    $('#mailVerif').val('');
                } else {
                    $('#errorMessageMailVerification').html('Error : incorrect passcode, retry');
                }
            });
        });

        $('#btnSignIn').click(() => {
            let mail = $('#signInMailAddress').val();
            let password = $('#signInPassword').val();
            if (this.checkInputsBeforeSignIn(mail, password)) {
                httpServ.signIn(mail, password, (result) => {
                    if (result.accountExists === false) {
                        $('#errorMessageSignIn').html("Error : Account not found, please sign up");
                    } else if (result.loginOk === false) {
                        $('#errorMessageSignIn').html("Error : Password incorrect");
                    } else if (result.loginOk === true) {
                        $('#toast-error').html('You\'re now connected as ' + mail);
                        $('#liveToast').toast("show");
                        this.showAllConnected();
                    } else if (result.loginAdmin === true) {
                        this.showAllConnectedAdmin();
                        $('#toast-error').html('You\'re now connected as administrator');
                        $('#liveToast').toast("show");
                    }
                });
            } else {
                $('#errorMessageSignIn').html('Please fill all fields. The email must include "@" and ".xxx" and the password must include at least one upper and lower case letter, one number and one special character allowed: "!@#$%^&*()_-=+;:,?"')
            }
        });

        $('#signInMailAddress, #signInPassword').keypress((e) => {
            if (e.keyCode === 13) {
                $('#btnSignIn').click();
            }
        });


        $('#nav-btn-account').click(() => {
            httpServ.checkIfConnected((res) => {
                if (res.isConnected) {
                    httpServ.getUserInfos((data) => {
                        this.hideNavCollapsed();
                        $('#a-station').removeClass('active');
                        $('#a-fav-stations').removeClass('active');
                        this.loadAccount(data);
                    });
                } else {
                    this.loadErrorFavStations();
                }
            });
        });

        $('#a-admin-panel').click(() => {
            httpServ.checkIfAdmin((res) => {
                if (res.isAdmin) {
                    this.hideNavCollapsed();
                    $('a.nav-link').removeClass('active');
                    $('#a-admin-panel').addClass('active');
                    this.loadAdmin();
                } else {
                    $('#liveToast').toast("show");
                    $('#toast-error').html('You\'re not allowed to access here...');
                }
            })
        });

        $('#input-mail-forgotten-password').keypress((e) => {
            if (e.keyCode === 13) {
                $('#btn-send-forgotten-password').click();
            }
        });
    }

    checkInputsBeforeSignUp() {
        let ok = true;
        if ($('#signUpName').val().match(/^\S{1,64}$/) === null) {
            $('#signUpName').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#signUpName').css("background-color", "#ffffff");
        }
        if ($('#signUpFirstName').val().match(/^\S{1,64}$/) === null) {
            $('#signUpFirstName').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#signUpFirstName').css("background-color", "#ffffff");
        }
        if ($('#signUpMailAddress').val() === "" || !$('#signUpMailAddress').val().match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')) {
            $('#signUpMailAddress').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#signUpMailAddress').css("background-color", "#ffffff");
        }
        if (!$('#signUpPassword').val().match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\\-+=;:,.?])(?=.{8,64}).*$') || $('#signUpPassword').val() !== $('#signUpPassword2').val()) {
            $('#signUpPassword').css("background-color", "#ff726f");
            $('#signUpPassword2').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#signUpPassword').css("background-color", "#ffffff");
            $('#signUpPassword2').css("background-color", "#ffffff");
        }
        return ok;
    }

    checkInputsBeforeSignIn(mail, password) {
        let ok = true;
        if (mail === "" || !mail.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')) {
            $('#signInMailAddress').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#signInMailAddress').css("background-color", "#ffffff");
        }
        if (!password.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\\-+=;:,.?])(?=.{8,64}).*$')) {
            $('#signInPassword').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#signInPassword').css("background-color", "#ffffff");
        }
        return ok;
    }

    checkInputMail() {
        let ok = true;
        let mail = $('#input-mail-forgotten-password').val();
        if (mail === "" || !mail.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')) {
            $('#input-mail-forgotten-password').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#input-mail-forgotten-password').css("background-color", "#ffffff");
        }
        return ok;
    }

    showAllConnected() {
        $('#nav-btn-login').addClass('d-none');
        $('#nav-btn-account').removeClass('d-none');
        $('#loginModal').modal('hide');
        $('#signInMailAddress').html('');
        $('#signInPassword').html('');
        $('#signUpModal').modal('hide');
        $('#signUpName').val('');
        $('#signUpFirstName').val('');
        $('#signUpMailAddress').val('');
        $('#signUpPassword').val('');
        $('#signUpPassword2').val('');
        $('#mailVerificationModal').modal('hide');
        $('#mailVerif').val('');
        if ($('#a-fav-stations').hasClass('active')) {
            $('#a-fav-stations').click();
        }
        $('#errorMessage').html('');
        $('#errorMessageSignIn').html('');
    }

    showAllConnectedAdmin() {
        this.showAllConnected();
        $('#li-admin-panel').removeClass('d-none');
    }
}


