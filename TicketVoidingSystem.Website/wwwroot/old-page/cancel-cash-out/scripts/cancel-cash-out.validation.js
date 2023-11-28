"use strict";

const voidCashOutValidation = {
    isNumber: function (value) {
        return /^\+?(0|[1-9]\d*)$/.test(value);
    },

    checkParamsBeforeSearch: function () {
        $('#msg').hide();
        if ($("#radio-by-match").is(":checked")) {
            if ($('#txtMatchId').val().toString() === '') {
                $('#msg').html(tooltip.show('txtMatchId', messages.matchIdRequired)).show();
                return false;
            }

            const timeFormat = 'hh:mm:ss.SSS A';
            const fromTime = moment($('#fromTime').val().trim(), timeFormat, true);
            if (fromTime.isValid()) {
                $('#fromTime').val(fromTime.format(timeFormat));
            } else {
                $('#msg').html(tooltip.show('fromTime', messages.invalidTimeFormat)).show();
                return false;
            }

            const toTime = moment($('#toTime').val().trim(), timeFormat, true);
            if (toTime.isValid()) {
                $('#toTime').val(toTime.format(timeFormat));
            } else {
                $('#msg').html(tooltip.show('toTime', messages.invalidTimeFormat)).show();
                return false;
            }


            const fromDateTime = $('#fromTransDate').val() + ' ' + $('#fromTime').val();
            const toDateTime = $('#toTransDate').val() + ' ' + $('#toTime').val()

            if (moment(fromDateTime).isAfter(moment(toDateTime))) {
                $('#msg').html(tooltip.show('label-from-date-time', messages.fromTimeMustBeSmallerThanToTime)).show();
                return false;
            }
        } else {
            const transIds = voidCashOutService.getTransIds();
            if (transIds.length === 0) {
                $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
                return false;
            }
        }

        return true;
    },

    checkParamsBeforeVoid: function () {
        $('#msg').hide();
        if (NapTicketControl.Helper.getSubTicketsChecked("checkBoxItem") === '') {
            $('#msg').html(tooltip.show('chk-ticket-all', messages.selectOneTicket)).show();
            return false;
        }

        if (Message.Validator.validateMessageConstraints() === false) {
            return false;
        }

        if ($('#reason').val().toString() === '') {
            $('#msg').html(tooltip.show('reason', messages.inputReason)).show();
            return false;
        }
        if ($('#reasonSC').val().toString() === '') {
            $('#msg').html(tooltip.show('reasonSC', messages.inputReason)).show();
            return false;
        }
        if ($('#password').val().toString() === '') {
            $('#msg').html(tooltip.show('password', messages.inputPassword)).show();
            return false;
        }
        return true;
    },

    checkTimeValuePasted: function ($element) {
        $('#msg').hide();
        const text = $element.val().trim();
        const mTime = moment(text, 'hh:mm:ss.SSS A', true);
        if (mTime.isValid()) {
            $element.val(mTime.format('hh:mm:ss.SSS A'));
            return;
        }

        if (moment(text, 'hh:mm:ss.SSS', true).isValid()) {
            $element.val(text + ' AM');
            return;
        }

        $('#msg').html(tooltip.show($element.attr('id'), messages.invalidTimeFormat)).show();
    }
};