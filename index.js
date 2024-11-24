var jpdpBaseUrl = "http://api.login2explore.com:5577"; 
var jpdpIML = "/api/iml";
var jpdpIRL = "/api/irl";
var shipmentDbName = "Shipment-DB";
var RelationName = "Ship-REL";
var conntoken = "90934419|-31949230652942980|90956805";

$('#shipmentNo').focus();

function resetForm() {
    $("#shipmentNo").val('');
    $("#description").val('');
    $("#source").val('');
    $("#destination").val('');
    $("#shippingDate").val('');
    $("#expectedDeliveryDate").val('');
    $("#shipmentNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#shipmentNo").focus();
}

function getShipIdasJsonObj() {
    var shipid = $("#shipmentNo").val();
    var jsonStr = {id: shipid};
    return JSON.stringify(jsonStr);
}

function getShip() {
    var ShipIdJsonObj = getShipIdasJsonObj();
    var getRequest = CreateGET_BY_KEYRequest(conntoken, shipmentDbName, RelationName, ShipIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandATGivenBaseUrl(getRequest, jpdpBaseUrl, jpdpIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#change").prop("disabled", false);
        $('#shipmentNo').focus();
    } else if (resJsonObj.status === 200) {
        $("#shipmentNo").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $('#shipmentNo').focus();
    }
}

function saveRecordNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function fillData(jsonObj) {
    saveRecordNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#shipmentNo").val(record.shipmentNo);
    $("#description").val(record.description);
    $("#source").val(record.source);
    $("#destination").val(record.destination);
    $("#shippingDate").val(record.shippingDate);
    $("#expectedDeliveryDate").val(record.expectedDeliveryDate);
}
function validateData() {
    var shipmentNoVar = $("#shipmentNo").val();
    if (shipmentNoVar === "") {
        alert("Shipment No. is required");
        $("#shipmentNo").focus();
        return "";
    }

    var descriptionVar = $("#description").val();
    if (descriptionVar === "") {
        alert("Description is required");
        $("#description").focus();
        return "";
    }

    var sourceVar = $("#source").val();
    if (sourceVar === "") {
        alert("Source is required");
        $("#source").focus();
        return "";
    }

    var destinationVar = $("#destination").val();
    if (destinationVar === "") {
        alert("Destination is required");
        $("#destination").focus();
        return "";
    }

    var shippingDateVar = $("#shippingDate").val();
    if (shippingDateVar === "") {
        alert("Shipping Date is required");
        $("#shippingDate").focus();
        return "";
    }

    var expectedDeliveryDateVar = $("#expectedDeliveryDate").val();
    if (expectedDeliveryDateVar === "") {
        alert("Expected Delivery Date is required");
        $("#expectedDeliveryDate").focus();
        return "";
    }

    var jsonStrObj = {
        shipmentNo: shipmentNoVar,
        description: descriptionVar,
        source: sourceVar,
        destination: destinationVar,
        shippingDate: shippingDateVar,
        expectedDeliveryDate: expectedDeliveryDateVar
    };

    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return;
    }
    var putRequest = createPUTRequest(conntoken, jsonStrObj, shipmentDbName, RelationName);
    jQuery.ajaxSetup({async: false});
    var rejsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdpBaseUrl, jpdpIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#shipmentNo').focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(conntoken, jsonChg, shipmentDbName, RelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var rejsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdpBaseUrl, jpdpIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#shipmentNo').focus();
}
