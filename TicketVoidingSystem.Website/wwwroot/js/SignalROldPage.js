"use strict";

$(function () {
    configToastr();
    var originURL = window.location.origin + document.body.getAttribute('origin-url') + "signalr";
    var connection = $.hubConnection(originURL, { useDefaultPath: false });
    var proxy = connection.createHubProxy('notificationHub');
    registerShowVoidResultEvent(proxy);
    registerShowErrorMessage(proxy);
    connection.logging = true;
    connection.start()
        .done(() => {
        });
});

// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}

function configToastr() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "100",
        "hideDuration": "200",
        "timeOut": 0,
        "extendedTimeOut": 0,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "slideUp",
        "tapToDismiss": true,
        "escapeHtml": false
    };
}

function registerShowVoidResultEvent(proxy) {
    proxy.on('showVoidResult', (results) => {
        toastr.info(buildMessage(results));
    });
}

function registerShowErrorMessage(proxy) {
    proxy.on('showErrorMessage', (message) => {
        toastr.error(message);
    });
}

function buildMessage(results) {
    const VOID_REQUEST_STATUS_CODE = 238;
    const LICENSEE_SUCCESS_CODE = 236;
    const LICENSEE_FAIL_CODE = 136;
    const SEND_LETSTALK_FAIL_CODE = 137;
    const EXCEPTION_RUN_AFTER_VOID = 134;

    const exceptionResult = results.find(function (x) { return x.ErrorCode === EXCEPTION_RUN_AFTER_VOID; });
    if (exceptionResult) {
        return `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${exceptionResult.ErrorMsg}</span></div>`;
    }

    var succeedLicenseeMsg = "";
    var failedLicenseeMsg = "";
    var sentLetsTalkMsg = "";
    var voidRequestMsg = results.find(function (x) { return x.ErrorCode === VOID_REQUEST_STATUS_CODE; }).ErrorMsg;
    var succeedLicenseeResult = results.find(function (x) { return x.ErrorCode === LICENSEE_SUCCESS_CODE; });
    var failedLicenseeResult = results.find(function (x) { return x.ErrorCode === LICENSEE_FAIL_CODE; });
    var sentLetsTalkResult = results.find(function (x) { return x.ErrorCode === SEND_LETSTALK_FAIL_CODE; });

    if (succeedLicenseeResult && succeedLicenseeResult.ErrorMsg) {
        succeedLicenseeMsg = `<div class="licensee-success-msg"><span>- ${succeedLicenseeResult.ErrorMsg}</span></div>`;
    }
    if (failedLicenseeResult && failedLicenseeResult.ErrorMsg) {
        failedLicenseeMsg = `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${failedLicenseeResult.ErrorMsg}</span></div>`;
    }
    if (sentLetsTalkResult && sentLetsTalkResult.ErrorMsg) {
        sentLetsTalkMsg = `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${sentLetsTalkResult.ErrorMsg}</span></div>`;
    }

    return `<div class="void-bet-notification"><div><span>- ${voidRequestMsg}</span></div>${succeedLicenseeMsg}${failedLicenseeMsg}${sentLetsTalkMsg}</div>`;
}