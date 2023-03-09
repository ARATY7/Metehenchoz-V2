/*
  But     : Admin ctrl
  Auteur  : Noé Henchoz
  Date    : 27.02.2022 / v1.0
*/

class AdminCtrl {

    constructor() {
        this.getAllUserAccounts();
    }

    getAllUserAccounts() {
        httpServ.getAllUserAccounts((data) => {
            $('#admin-panel').append(`<div class="accordion pb-5" id="accordion-all-accounts"></div>`);
            for (let i = 0; i < data.length; i++) {
                $('#accordion-all-accounts').append(`
                    <div class="accordion-item-${i}">
                        <h2 class="accordion-header" id="heading-${i}">
                            <button id="btn-access-fav-${i}" class="accordion-button title-accordion-items" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="true" aria-controls="collapse-${i}">
                                ${data[i].name + " " + data[i].firstName}
                            </button>
                        </h2>
                        <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}" data-bs-parent="#accordion-all-accounts">
                            <div class="accordion-body">
                                <div class="d-flex justify-content-center">
                                    <div class="card rounded p-4" style="width: 24rem;">
                                        <div class="mb-3">
                                            <input type="text" class="form-control" id="admin-name-${i}" placeholder="Name">
                                        </div>
                                        <div class="mb-3">
                                            <input type="text" class="form-control" id="admin-firstName-${i}" placeholder="First name">
                                        </div>
                                        <fieldset disabled>
                                            <div class="mb-3">
                                                <input type="text" class="form-control" id="admin-mail-${i}">
                                            </div>
                                        </fieldset>
                                        <div class="d-flex mb-3 justify-content-between">
                                            <button type="button" class="btn btn-primary" id="btn-update-${i}-admin">Update</button>
                                            <button type="button" class="btn btn-primary" id="btn-delete-${i}-admin">Delete</button>
                                        </div>
                                        <span id="error-update-delete-admin-${i}" style="color: red"></span>
                                        <span id="success-update-delete-admin-${i}" style="color: green"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>
                `);
                $(`#btn-update-${i}-admin`).click(() => {
                    if (this.checkFields(i)) {
                        httpServ.updateUser($(`#admin-name-${i}`).val(), $(`#admin-firstName-${i}`).val(), data[i].mail, (res) => {
                            if (res.userUpdated) {
                                $(`#error-update-delete-admin-${i}`).html('');
                                $(`#success-update-delete-admin-${i}`).html('User updated');
                                $(`#btn-access-fav-${i}`).html($(`#admin-name-${i}`).val() + " " + $(`#admin-firstName-${i}`).val())
                            } else {
                                $(`#success-update-delete-admin-${i}`).html('');
                                $(`#error-update-delete-admin-${i}`).html('User not updated');
                            }
                        });
                    } else {
                        $(`#success-update-delete-admin-${i}`).html('');
                        $(`#error-update-delete-admin-${i}`).html('Name or first name cannot be empty');
                    }
                });
                $(`#btn-delete-${i}-admin`).click(() => {
                    httpServ.deleteUser(data[i].mail, (res) => {
                        if (res.userDeleted) {
                            $('#a-admin-panel').click();
                        } else {
                            $(`#success-update-delete-admin-${i}`).html('');
                            $(`#error-update-delete-admin-${i}`).html('User not deleted');
                        }
                    });
                });
                $(`#admin-name-${i}`).val(data[i].name);
                $(`#admin-firstName-${i}`).val(data[i].firstName);
                $(`#admin-mail-${i}`).val(data[i].mail);
            }
        });
    }

    checkFields(i) {
        let ok = true;
        let name = $(`#admin-name-${i}`).val();
        let firstName = $(`#admin-firstName-${i}`).val();
        if (name.match(/^\S{1,64}$/) === null) {
            ok = false;
        }
        if (firstName.match(/^\S{1,64}$/) === null) {
            ok = false;
        }
        return ok;
    }
}