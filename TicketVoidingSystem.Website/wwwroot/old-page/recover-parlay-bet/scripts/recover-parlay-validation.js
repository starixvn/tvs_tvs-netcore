"use strict";

var recoverParlayValidation = {
    isNumber: function (str) {
        return /^\+?(0|[1-9]\d*)$/.test(str);
    },

    checkMatchId: function(){
        if (!recoverParlayService.checkMatchId()) {
            $('#msg').html(tooltip.show('matchId', messages.invalidCheckMatch)).show();
            return false;
        }

        return true;
    },
    
    validSubBeforeSearch: function () {
        if ($('#matchId').val().toString() === '') {
            $('#msg').html(tooltip.show('matchId', messages.matchIdRequired)).show();
            return false;
        }
        if (!recoverParlayService.checkMatchId()) {
            $('#msg').html(tooltip.show('matchId', messages.invalidCheckMatch)).show();
            return false;
        }
        if (recoverParlayService.getBetIds().length === 0) {
            $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
            return false;
        }

        return true;
    },

    validMainBeforeSearch: function () {
        if (recoverParlayService.getBetIds().length === 0) {
            $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
            return false;
        }

        return true;
    },

    isEmptyTicket: function (transIds) {
        if (transIds === '') {
            $('#msg').html(tooltip.show('chk-ticket-all', messages.selectOneTicket)).show();
            return false;
        }

        return true;
    }
};