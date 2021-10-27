/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var jpdbBaseURL = "http://api.login2explore.com:5577";
var connToken = "90936165|-31948850798610052|90943822";


var empDBName = "HR_DB";
var empRelName = "Emp-Rel";
var userRelName = "User-Rel";
var jpdbSet= "/api/iml/set";

setBaseUrl(jpdbBaseURL);

var myName, myStatus;
var pkEmpID="id";
var pkUserEmailID="email";
var ukUserMobileNo=["phone"];

function checkSession() {
    var sessionStatus = isJpdbSessionTokenExists(connToken, empDBName, userRelName);
    //alert(sessionStatus);
    if (sessionStatus === 400) {
        if (myStatus === "in") {
            //alert("login");
            window.location.href = "loginPage.html";
        } else {
            //alert("logout successfull");
            return;
        }
    } else if (sessionStatus === 200)
    {
        if (myStatus === "out")
        {
            //alert("logout");
            window.location.href = "home.html";
        } else
        {
            //alert("login successfull");
            return;
        }
        return;
    }
}

function loadHeader() {
    $("#myHeader").load("resources/header.html");
}

function loadFooter() {
    $("#myFooter").load("resources/footer.html");
}

function loadLeftNav() {
    $("#leftnav").load("resources/left-navigation.html");
    currentTab();
    loadName();
}

function loadName() {
    var email = localStorage.getItem("userID");
    $("#myUser").html(email);
    return;
}

function currentTab() {
    if (myName === "home")
        $("#myHome").prop("class", "active");
    if (myName === "profile")
        $("#myProfile").prop("class", "active");
    if (myName === "change")
        $("#myChange").prop("class", "active");
    if (myName === "form")
        $("#myForm").prop("class", "active");
    return;
}

function deleteSession(){
    var removeSession=removeSessionTokenFromJPDB(connToken,empDBName,userRelName);
    if(removeSession === 200){
       // alert("logout");
        /*localStorage.removeItem("rec_no");
        localStorage.removeItem("first_rec_no");
        localStorage.removeItem("last_rec_no");*/
        localStorage.clear();
        window.location.replace("loginPage.html");
        
    }else
        return;
}