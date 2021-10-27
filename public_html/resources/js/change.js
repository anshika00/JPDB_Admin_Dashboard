/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function chgresetForm() {
    $("#pswd-form")[0].reset();
}

function checkPwd() {
    var oldpwd = $("#oldpswd").val();
    var new1 = $("#newpswd").val();
    var new2 = $("#repswd").val();
    //alert(new1 +" - "+new2);
    if (oldpwd !== "" && new1 !== "" && new2 !== "")
    {
        if (new1 === new2) {
            changePwd(oldpwd, new1);
        } else {
            alert("Passwords don't match");
        }
    } else {
        alert("Input missing!");
    }
    chgresetForm();
    return;
}

function changePwd(oldpwd, new1) {
    var email = localStorage.getItem("userID");
    var jsonObj = {
        email: email,
        password: oldpwd
    };
    var getRecordReq = createGET_BY_KEYRequest(connToken, empDBName, userRelName, JSON.stringify(jsonObj));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getRecordReq, irlPartUrl);
    if (jsonObj.status === 200) {
        var changeObj = {
            email: email,
            password: new1
        };

        var setReq = createSETRequest(connToken, JSON.stringify(changeObj), empDBName, userRelName, "DEFAULT", primaryKey = pkUserEmailID, uniqueKeys = ukUserMobileNo);
        var responseObj = executeCommand(setReq, "/api/iml/set");
        if (responseObj.status === 200) {
            alert("Password updated successfully");
            //chgresetForm();
            deleteSession();
        } else {
            alert("Unable to change password");
            chgresetForm();
        }
    }
    jQuery.ajaxSetup({async: true});
    return;
}

