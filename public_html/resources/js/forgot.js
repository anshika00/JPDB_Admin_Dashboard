/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function sendMail() {
    var mail = $("#femail").val();
    if(mail === "")
    {
        $("#frgtmsg").html("Emter an Email");
        $("#frgtmsg").fadeOut(2000);
        setTimeout(
                function () {
                    window.location.reload();
                }, 1000
                );  
        return;
    }
 
    var jsonStr = {
        email: mail
    };
    var getReq = createGET_BY_KEYRequest(connToken, empDBName, userRelName, JSON.stringify(jsonStr));
    //console.log(getReq);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getReq, irlPartUrl);
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
        //alert("Please wait,sending an Email");
        $("#sentmsg").html("Please wait,sending an Email");
        $("#sentmsg").fadeOut(2000);
        var fpwd = createPwd();
        var npwd=fpwd.toString();
        //alert(fpwd);
        var jsonStr = {
            "emailTo": mail,
            "emailCc": "anshika.gupta@login2explore.com",
            "emailSubject": "Password Reset",
            "emailContent": "Here's the new passwsord for " + mail + " : " + fpwd + ".\Please rest your password."
        };
        var sendReq = createEmailToSendReq(connToken, JSON.stringify(jsonStr));
        //alert(sendReq);
        jQuery.ajaxSetup({async: false});
        var jsonObj = executeCommand(sendReq, "/serverless/send_email");
        jQuery.ajaxSetup({async: true});
        //alert(jsonObj);
        //alert("jsonObj: "+jsonObj.status);
        if (jsonObj.status === 200) {
            var changeObj = {
                email: mail,
                password: npwd
            };
            var setReq = createSETRequest(connToken, JSON.stringify(changeObj), empDBName, userRelName, "UPDATE", pkUserEmailID, ukUserMobileNo);
            jQuery.ajaxSetup({async: false});
            var responseObj = executeCommand(setReq, "/api/iml/set");
            jQuery.ajaxSetup({async: true});
            if (responseObj.status === 200) {
                alert("Email Sent");
                //$("#sentmsg").html("Email Sent");
                $("#femail").val("");
                window.location.replace("loginPage.html");
            }
        }
    } else {
        $("#frgtmsg").html("Email ID not registered");
        $("#frgtmsg").fadeOut(2000);
        setTimeout(
                function () {
                   window.location.reload();
                }, 1000
                ); 
        //window.loaction = "register.html";
    }
    //jQuery.ajaxSetup({async:true});
    return;
}

function createPwd() {
    var max = 999999;
    var min = 100000;
    return Math.floor(min + Math.random() * (max - min + 1));
}
    