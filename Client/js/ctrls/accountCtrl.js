class AccountCtrl {

    constructor(data) {
        this.fillInfos(data);
        this.loadEvents();
    }

    fillInfos(data) {
        $('#account-name').html(data.name);
        $('#account-firstName').html(data.firstName);
        $('#account-mail').html(data.mail);
    }

    loadEvents() {
        $('#btnLogout').click(() => {
            httpServ.logout((res) => {
                if (res.successfullyLogout) {
                    location.reload();
                }
            });
        });

        $('#input-current-password, #input-new-password, #input-new-password2').keypress((e) => {
            if (e.keyCode === 13) {
                $('#btn-update-password').click();
            }
        })

        $('#btn-update-password').click(() => {
            if (this.checkFields()) {
                this.updatePassword();
            }
        });
    }

    checkFields() {
        let ok = true;
        let currentPassword = $('#input-current-password').val();
        let newPassword = $('#input-new-password').val();
        let newPassword2 = $('#input-new-password2').val();
        if (!currentPassword.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\\-+=;:,.?])(?=.{8,64}).*$')) {
            $('#input-current-password').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#input-current-password').css("background-color", "#ffffff");
        }
        if (!newPassword.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\\-+=;:,.?])(?=.{8,64}).*$') || newPassword !== newPassword2 || newPassword === currentPassword) {
            $('#input-new-password').css("background-color", "#ff726f");
            $('#input-new-password2').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#input-new-password').css("background-color", "#ffffff");
            $('#input-new-password2').css("background-color", "#ffffff");
        }
        if (newPassword === currentPassword) {
            $('#input-new-password').css("background-color", "#ff726f");
            $('#input-current-password').css("background-color", "#ff726f");
            ok = false;
        } else {
            $('#input-new-password').css("background-color", "#ffffff");
            $('#input-current-password').css("background-color", "#ffffff");
        }
        return ok;
    }

    updatePassword() {
        httpServ.checkIfConnected((res) => {
            if (res.isConnected) {
                let currentPassword = $('#input-current-password').val();
                let newPassword = $('#input-new-password').val();
                httpServ.updatePassword(currentPassword, newPassword, (res) => {
                    if (res.passwordUpdated) {
                        $('#input-current-password').val('');
                        $('#input-new-password').val('');
                        $('#input-new-password2').val('');
                        $('#liveToast').toast('show');
                        $('#toast-error').html('Password successfully updated');
                    }
                });
            }
        });
    }
}