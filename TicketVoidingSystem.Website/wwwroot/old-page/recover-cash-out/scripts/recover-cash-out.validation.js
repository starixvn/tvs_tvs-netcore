"use strict";

var recoverCashOutValidation = {
    isNumber: function (value) {
        return /^\+?(0|[1-9]\d*)$/.test(value);
    },

    checkParamsBeforeSearch: function () {
        $('#msg').hide();
        var transIds = recoverCashOutService.getTransIds();
        if (transIds.length === 0) {
            $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
            return false;
        }

        return true;
    },

    checkParamsBeforerecover: function () {
        $('#msg').hide();
        if (NapTicketControl.Helper.getSubTicketsChecked("checkBoxItem") === '') {
            $('#msg').html(tooltip.show('chk-ticket-all', messages.selectOneTicket)).show();
            return false;
        }

        return true;
    }
};