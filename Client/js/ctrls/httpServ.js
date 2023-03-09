/*
  But     : Server ctrl
  Auteur  : Noé Henchoz
  Date    : 06.02.2023 / v1.1
*/

class HttpServ {

    constructor() {
    }

    loadView(vue, callback) {
        if (vue === 'footer') {
            $('#footer').load('views/' + vue + '.html', () => {
                if (typeof callback !== 'undefined') {
                    callback();
                }
            });
        } else {
            $('#views').load('views/' + vue + '.html', () => {
                if (typeof callback !== 'undefined') {
                    callback();
                }
            });
        }
    }

    loadSubView(vue, callback) {
        $('#subViews').load('views/subViews/' + vue + '.html', () => {
            if (typeof callback !== 'undefined') {
                callback();
            }
        });
    }

    getCurrent(city, successCallback) {
        $.ajax({
            url: API_CURRENT,
            method: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: false
            },
            data: {
                key: API_KEY,
                q: city
            },
            success: successCallback,
            error: (xhr) => {
                this.errorWeatherAPI(xhr);
            }
        });
    }

    getForecast(city, successCallback) {
        $.ajax({
            url: API_FORECAST,
            method: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: false
            },
            data: {
                key: API_KEY,
                q: city,
                days: 3
            },
            success: successCallback,
            error: (xhr) => {
                this.errorWeatherAPI(xhr);
            }
        });
    }

    checkIfConnected(successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'checkIfConnected'
            },
            success: successCallback,
            error: errorCallback
        });
    }

    sendCodeByMail(name, firstName, mail, password, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'sendCodeByMail',
                name: name,
                firstName: firstName,
                mail: mail,
                password: password
            },
            success: successCallback,
            error: errorCallback
        });
    }

    checkCode(code, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'checkCode',
                code: code
            },
            success: successCallback,
            error: errorCallback
        });
    }

    signIn(mail, password, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'signIn',
                mail: mail,
                password: password
            },
            success: successCallback,
            error: errorCallback
        });
    }

    getFavStations(successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'getFavStations'
            },
            success: successCallback,
            error: errorCallback
        });
    }

    getUserInfos(successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'getUserInfos'
            },
            success: successCallback,
            error: errorCallback
        });
    }

    logout(successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'logout'
            },
            success: successCallback,
            error: errorCallback
        });
    }

    addStationToFavorites(name, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'addStationToFavorites',
                name: name
            },
            success: successCallback,
            error: errorCallback
        });
    }

    removeStationToFavorites(name, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "DELETE",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'removeStationToFavorites',
                name: name
            },
            success: successCallback,
            error: errorCallback
        });
    }

    checkIfStationAlreadyFav(name, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'checkIfStationAlreadyFav',
                name: name
            },
            success: successCallback,
            error: errorCallback
        });
    }

    updatePassword(currentPassword, newPassword, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "PUT",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'updatePassword',
                currentPassword: currentPassword,
                newPassword: newPassword
            },
            success: successCallback,
            error: errorCallback
        });
    }

    sendNewPasswordByMail(mail, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'sendNewPasswordByMail',
                mail: mail,
            },
            success: successCallback,
            error: errorCallback
        });
    }

    checkIfAdmin(successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'checkIfAdmin'
            },
            success: successCallback,
            error: errorCallback
        });
    }

    getAllUserAccounts(successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'getAllUserAccounts'
            },
            success: successCallback,
            error: errorCallback
        });
    }

    updateUser(name, firstName, mail, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "PUT",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'updateUser',
                name: name,
                firstName: firstName,
                mail: mail
            },
            success: successCallback,
            error: errorCallback
        });
    }

    deleteUser(mail, successCallback, errorCallback) {
        $.ajax({
            url: SERVER_URL,
            method: "DELETE",
            xhrFields: {
                withCredentials: true
            },
            data: {
                action: 'deleteUser',
                mail: mail
            },
            success: successCallback,
            error: errorCallback
        });
    }

    errorWeatherAPI(xhr) {
        let msg;
        if (xhr.status === 0) {
            msg = 'No access to the requested resource...';
        } else if (xhr.status === 401) {
            msg = 'The API key is not provided or is invalid...';
        } else if (xhr.status === 400) {
            msg = 'Error with city entry...';
        } else if (xhr.status === 403) {
            msg = 'The number of calls available to the API has been exceeded...';
        } else {
            msg = 'Unknown error : ' + xhr.responseText;
        }
        $('#liveToast').toast("show");
        $('#toast-error').html(msg);
    }

}