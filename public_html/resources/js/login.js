/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function checkUser() {
    var email = $("#logemail").val();
    var pwd = $("#logpwd").val();
    var jsonStr = {
        email: email,
    };
    var getReq = createGET_BY_KEYRequest(connToken, empDBName, userRelName, JSON.stringify(jsonStr));
    console.log(getReq);
    //alert(getReq);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getReq, irlPartUrl);
    jQuery.ajaxSetup({async: true});
    console.log(jsonObj);
    //alert("jsonObj - "+jsonObj);
    //alert(jsonObj.status);
    if (jsonObj.status === 400) {
        //$("#mymsg").html("Incorrect email");
        //$("#mymsg").fadeOut(4000);
        alert("Incorrect Email");
        $("#logemail").val("");
        $("#logpwd").val("");
        $("#logemail").focus();
    } else if (jsonObj.status === 200) {
        var rec = JSON.parse(jsonObj.data).record;
        //alert("record - "+rec);
        //alert("rec - " + rec.password + "\n pswd - " + pwd);
        //alert(rec===pwd);
        if (rec.password === pwd)
        {
            $("#logmsg").html("Logging in...");
            setInterval(function () {
                $("#regmsg").html("");
            }, 3000);
            jQuery.ajaxSetup({async: false});
            createSession(email);
            jQuery.ajaxSetup({async: true});
        } else {
            //$("#mymsg").html("Incorrect Password");
            alert("Incorrect Password");
            $("#mymsg").fadeOut(4000);
            $("#logpwd").val("");
            $("#logpwd").focus();
        }
    }
}

function createSession(email) {
    //console.log("insdie - createSession(email)");
    var sessionTokenStatus = createJpdbSessionToken(connToken, 1, empDBName, userRelName, email);
    if (sessionTokenStatus === 200) {
        if (localStorage.getItem("req-url") !== null) {
            window.location.href = localStorage.href = localStorage.getItem("req-url");
            localStorage.removeItem("req-url");
        } else
        {
            //alert("login");
            window.location.replace("home.html");
        }
    } else
    {
        $("logemail").val("");
        $("logpwd").val("");
        alert("Unable to login");
        return;
    }
    return;
}

