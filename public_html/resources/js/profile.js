/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function showUser() {
    var email = localStorage.getItem("userID");
    var jsonStr = {
        email: email
    };
    var getReq = createGET_BY_KEYRequest(connToken, empDBName, userRelName, JSON.stringify(jsonStr));
    //console.log(getReq);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getReq, irlPartUrl);
    console.log(jsonObj);
    //alert(jsonObj.status);
    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#proemail").val(data.email);
        $("#proname").val(data.name);
        $("#prophone").val(data.phone);
        $("#promyname").html(data.name);
    }
    jQuery.ajaxSetup({async: true});
    return;
}

function editPrData() {
    $("#proname").prop("disabled", false);
    $("#prophone").prop("disabled", false);
    $("#prochange").prop("disabled", false);
    $("#proreset").prop("disabled", false);
    $("#proedit").prop("disabled", true);
    $("#proname").focus();
}


function changePrData() {
    var name = $("#proname").val();
    var phone = $("#prophone").val();
    jQuery.ajaxSetup({async: false});
    var jsonChg = {
        email: localStorage.getItem("userID"),
        name: name,
        phone: phone
    };
    var setReq = createSETRequest(connToken, JSON.stringify(jsonChg), empDBName, userRelName, "DEFAULT", pkUserEmailID, ukUserMobileNo);
    //alert(setReq);
    var responseObj = executeCommand(setReq, jpdbSet);
    //alert(responseObj.status);
    if (responseObj.status === 200) {
        alert("update successfull");
        window.location.reload();
        $("#proname").prop("disabled", true);
        $("#prophone").prop("disabled", true);
        $("#prochange").prop("disabled", true);
        $("#proedit").prop("disabled", false);
        $("#proreset").prop("disabled", true);
    } else {
        alert("unable to make changes");
        window.location.reload();
    }
    jQuery.ajaxSetup({async: true});
    return;
}

function resetPrData() {
    showUser();
    $("#proedit").prop("disabled", false);
    $("#prochange").prop("disabled", true);
    $("#proreset").prop("disabled", true);
    $("#proname").prop("disabled", true);
    $("#prophone").prop("disabled", true);
}
