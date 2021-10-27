/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*$("input").change(function () {
    var inputs = $(this).closest('empform').find(':input');
    inputs.eq(inputs.index(this) + 1).prop("disabled", false).focus();
});*/


function getEmpIdAsJsonObj() {
    var empid = $("#id").val();
    var lvEmpId = empid;
    var jsonStr = {
        Eid: lvEmpId
    };
    return JSON.stringify(jsonStr);
}
function getEmp() {
    var idJson = getEmpIdAsJsonObj();
    //alert(idJson);
    var getReq = createGET_BY_KEYRequest(connToken,
            empDBName, empRelName, idJson);
    //alert(getReq);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getReq, jpdbBaseURL, irlPartUrl);
    jQuery.ajaxSetup({async: true});
    //alert(resJsonObj.status);
    if (resJsonObj.status === 200) {
        disableForm(true);
        //$("#id").prop("disabled", true);
        showData(resJsonObj);
        $("#save").prop("disabled", true);
    }
}

function disableForm(bValue) {
    $("#id").prop("disabled", bValue);
    $("#name").prop("disabled", bValue);
    $("#salary").prop("disabled", bValue);
    $("#hra").prop("disabled", bValue);
    $("#da").prop("disabled", bValue);
    $("#deduction").prop("disabled", bValue);
}

function disableNav(ctrl) {
    $("#first").prop("disabled", ctrl);
    $("#prev").prop("disabled", ctrl);
    $("#next").prop("disabled", ctrl);
    $("#last").prop("disabled", ctrl);
}

function disableCtrl(ctrl) {
    $("#new").prop("disabled", ctrl);
    $("#save").prop("disabled", ctrl);
    $("#edit").prop("disabled", ctrl);
    $("#change").prop("disabled", ctrl);
    $("#reset").prop("disabled", ctrl);
}

function initEmpForm() {
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("last_rec_no");
    localStorage.removeItem("emp_rec_no");
    // alert("initEmpForm() - done");
}

function setCurrRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    //alert("curr rec_no - "+data.rec_no);
    localStorage.setItem("emp_rec_no",data.rec_no);
}

function getCurrRecNoFromLS() {
    return localStorage.getItem("emp_rec_no");
}

function setFirstRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    //alert(data.rec_no);
    if (data.rec_no === undefined) {
        localStorage.setItem("first_rec_no", "0");
    } else {
        localStorage.setItem("first_rec_no", data.rec_no);
    }
}

function getFirstRecNoFromLS() {
    return localStorage.getItem("first_rec_no");
}

function setLastRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    //alert(data.rec_no);
    if (data.rec_no === undefined) {
        localStorage.setItem("last_rec_no", "0");
    } else {
        localStorage.setItem("last_rec_no", data.rec_no);
    }
}

function  getLastRecNoFromLS() {
    return localStorage.getItem("last_rec_no");
}
function newForm() {
    makeDataFormEmpty();
    disableForm(false);
    $("#id").focus();
    disableNav(true);
    disableCtrl(true);

    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
}
function makeDataFormEmpty() {
    $("#id").val("");
    $("#name").val("");
    $("#salary").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduction").val("");
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putReqStr = createPUTRequest(connToken, jsonStrObj, empDBName, empRelName);
    // alert(putReqStr);-
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, imlPartUrl);
    //alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({async: true});
    if (isNoRecordPresentLS()) {
        setFirstRecNo2LS(jsonObj);
    }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    resetForm();
}

function editData() {
    disableForm(false);
    $("#id").prop("disabled", true);
    $("#name").focus();

    disableNav(true);
    disableCtrl(true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
}

function changeData() {
    var jsonChg = validateData();
    //alert(getCurrRecNoFromLS());
    var updateReq = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelName, getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseURL, imlPartUrl);
    jQuery.ajaxSetup({async: true});
    console.log(jsonObj);
    resetForm();
}

function resetForm() {
    disableCtrl(true);
    disableNav(false);

    var getCurRequest = createGET_BY_RECORDRequest(connToken, empDBName, empRelName, getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});

    if (isOnlyOneRecordPresent() || isNoRecordPresentLS()) {
        disableNav(true);
    }
    $("#new").prop("disabled", false);
    if (isNoRecordPresentLS()) {
        makeDataFormEmpty();
        $("#edit").prop("disabled", true);
    } else {
        $("#first").prop("disabled", false);
        $("#edit").prop("disabled", false);
        $("#prev").prop("disabled", false);
    }
    disableForm(true);
}

function validateData() {
    var empId = $("#id").val();
    if (empId === "") {
        alert("Employee ID Required Value");
        $("#id").focus();
        return "";
    }
    var empName = $("#name").val();
    if (empName === "") {
        alert("Employee Name Required Value");
        $("#name").focus();
        return "";
    }
    var empSalary = $("#salary").val();
    if (empSalary === "") {
        alert("Employee BAsic SAlary Required Value");
        $("#salary").focus();
        return "";
    }
    var empHRA = $("#hra").val();
    var empDA = $("#da").val();
    var empDeduction = $("#deduction").val();

    var jsonStrObj = {
        Eid: empId,
        Ename: empName,
        basicsalary: empSalary,
        hra: empHRA,
        da: empDA,
        deductions: empDeduction
    };
    return JSON.stringify(jsonStrObj);
}

function getFirst() {
    var getFirstRequest = createFIRST_RECORDRequest(connToken, empDBName, empRelName);
    //alert(getFirstRequest);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest, irlPartUrl);   //irlPartUrl
    showData(result);
    setCurrRecNo2LS(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async: true});
    $("#id").prop("disabled", true);
    $("#first").prop("disabled", true);
    $("#prev").prop("disabled", true);
    $("#next").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#last").prop("disabled", false);
}

function getPrev() {
    var r = getCurrRecNoFromLS();
    var getPrevReq= createPREV_RECORDRequest(connToken, empDBName, empRelName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevReq, irlPartUrl);
    jQuery.ajaxSetup({async: true});
    setCurrRecNo2LS(result);
    showData(result); 
    if (getCurrRecNoFromLS() === getFirstRecNoFromLS()) {
        $("#first").prop("disabled", true);
        $("#prev").prop("disabled", true);
    } else
    {
        disableNav(false);
    }
    $("#save").prop("disabled", true);
}

function getNext() {
    var r = getCurrRecNoFromLS();
    var getNextRequest = createNEXT_RECORDRequest(connToken, empDBName, empRelName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getNextRequest, irlPartUrl);
    jQuery.ajaxSetup({async: true});
    setCurrRecNo2LS(result);
    showData(result);
    if (getCurrRecNoFromLS() === getLastRecNoFromLS()) {
        $("#last").prop("disabled", true);
        $("#next").prop("disabled", true);
    } else
    {
        disableNav(false);
    }
    $("#save").prop("disabled", true);
}

function getLast() {
    var getLastRequest = createLAST_RECORDRequest(connToken, empDBName, empRelName);
    //alert(getLastRequest);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest, irlPartUrl);
    jQuery.ajaxSetup({async: true});
    setCurrRecNo2LS(result);
    setLastRecNo2LS(result);
    showData(result);
    $("#first").prop("disabled", false);
    $("#prev").prop("disabled", false);
    $("#last").prop("disabled", true);
    $("#next").prop("disabled", true);
    $("#save").prop("disabled", true);
    
}

function isNoRecordPresentLS() {
    if (getFirstRecNoFromLS() === "0" && getLastRecNoFromLS() === "0") {
        return true;
    }
    return false;
}

function isOnlyOneRecordPresent() {
    if (isNoRecordPresentLS()) {
        return false;
    }
    if (getFirstRecNoFromLS() === getLastRecNoFromLS()) {
        return true;
    }
    return false;
}
function checkForNoOrOneRecord() {
    if (isNoRecordPresentLS()) {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $("#new").prop("disabled", false);
        return;
    }
    if (isOnlyOneRecordPresent()) {
        alert("only 1 record present");
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $("#new").prop("disabled", false);
        $("#edit").prop("disabled", false);
        return;
    }
}

function showData(jsonObj) {
    if (jsonObj.status === 400) {
        return;
    }
    var data = (JSON.parse(jsonObj.data)).record;
    setCurrRecNo2LS(jsonObj);
    //alert("data emp id - "+ data.Eid);
    $("#id").val(data.Eid);
    //alert("data emp name - "+ data.Ename);
    $("#name").val(data.Ename);
    $("#salary").val(data.basicsalary);
    $("#hra").val(data.hra);
    $("#da").val(data.da);
    $("#deduction").val(data.deductions);
    disableNav(false);
    disableForm(true);

    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);

    if (getCurrRecNoFromLS() === getLastRecNoFromLS()) {
        $("#next").prop("disabled", true);
        $("#last").prop("disabled", true);
    }
    if (getCurrRecNoFromLS() === getFirstRecNoFromLS()) {
        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
        return;
    }
}

initEmpForm();
getFirst();
//alert("getFirst");

getLast();
//alert("getLast");

checkForNoOrOneRecord();
//alert("checkForNoOrOneRecord");

disableForm(true);
//alert("disableForm");
