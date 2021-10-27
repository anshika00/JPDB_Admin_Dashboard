/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function validateData() {

    var empName = $("#regname").val();
    if (empName === "") {
        alert("Employee Name Required Value");
        $("#regname").focus();
        return "";
    }

    var email = $("#regemail").val();
    if (email === "") {
        alert("Employee email Required Value");
        $("#regemail").focus();
        return "";
    }

    var phone = $("#regphone").val();
    if (phone === "") {
        alert("Phone number Required Value");
        $("#regphone").focus();
        return "";
    }

    var pswd = $("#regpwd").val();
    if (pswd === "") {
        alert("Password inappropriate");
        $("#regpwd").focus();
        return "";
    }

    var pswd1 = $("#regpwd1").val();
    if (pswd1 === "") {
        alert("Password inappropriate");
        $("#regpwd1").focus();
        return "";
    }
    if (pswd !== pswd1) {
        alert("Passwords mismatch!");
        $("#regpwd").val("");
        $("#regpwd1").val("");
        $("#regpwd").focus();
        return "";
    }

    var jsonStrObj = {
        name: empName,
        email: email,
        phone: phone,
        password: pswd
    };
    return JSON.stringify(jsonStrObj);
}

function regresetForm() {
    $("#register-form")[0].reset();
}

function regsaveData() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return;
    }
    $("#regmsg").html("please wait, getting registered");
    setInterval(function () {
           $("#regmsg").html("");
        }, 3000);
    //alert(pkUserEmailID);
    var setReq = createSETRequest(connToken, jsonStr, empDBName, userRelName, "PUT", pkUserEmailID, ukUserMobileNo);
    //alert(ukUserMobileNo);
    console.log(setReq);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(setReq, "/api/iml/set");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
       // $("#regmsg").html("");
        $("#myRegFormMsg").prop("class", "alert-success");
        $("#myRegFormMsg").html("Successfully Registered!");
        setInterval(function () {
            window.location.replace("loginPage.html");
        }, 2000);
    } else {
        $("#myRegFormMsg").html("UnSuccessfull registeration!");
        $("#myRegFormMsg").fadeOut(3000);
        regresetForm();
    }
}

function checkEmail() {
    var e = $("#regemail").val();
    var jsonStr = {
        email: e
    };
    var getReq=createGET_BY_KEYRequest(connToken,empDBName,userRelName,JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getReq, "/api/irl");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
        $("#myRegFormMsg").html("EmailId already registered");
       // alert("EmailId already registered");
        setInterval(function () {
           $("#myRegFormMsg").html("");
        }, 3000);
        $("#regemail").val("");
        $("#regemail").focus();
    } 
}

function checkPhone() {
    var p = $("#regphone").val();
    var jsonStr = {
        phone: p
    };
    var getReq=createGET_BY_KEYRequest(connToken,empDBName,userRelName,JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getReq, "/api/irl");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
        //alert("Phone number already registered");
        $("#myRegFormMsg").html("Phone number already registered");
        setInterval(function () {
           $("#myRegFormMsg").html("");
        },3000);
        $("#regphone").val("");
        $("#regphone").focus();
    } 
}