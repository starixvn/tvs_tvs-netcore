"use strict";

var recoverCashOutDirective = {
    init: function () {
        recoverCashOutDirective.keyUpHandle();
        NapTicketControl.Helper.InitNumberGroup();
        $('#txtTransId').focus();

        $(document).click(function () {
            $('#show-error-move-bet').hide();
        });

        $('#btnSearch').click(function (event) {
            recoverCashOutDirective.searchTickets(event);
        });

        $('#recover').click(function (event) {
            recoverCashOutDirective.recoverTickets(event);
        });

        $("#copy-clipboard").live("click", function () {
            NapTicketControl.Helper.copyToClipboard();
        });
    },

    keyUpHandle: function () {
        $('#txtTransId').keyup(function () {
            var value = $('#txtTransId').val();
            if (value.length === 0) {
                $('#txtTransId').addClass("text-number");
                $('#txtTransId').removeClass("text-number-invalid");
            }
            else {
                if (!recoverCashOutValidation.isNumber(value)) {
                    $('#txtTransId').removeClass("text-number");
                    $('#txtTransId').addClass("text-number-invalid");
                }
                else {
                    $('#txtTransId').addClass("text-number");
                    $('#txtTransId').removeClass("text-number-invalid");
                }
            }
        }).ForceIntegerOnly();

        $("#txtMatchId").keyup(function () { }).ForceIntegerOnly();
        $("#fromRefno").keyup(function () { }).ForceIntegerOnly();
        $("#toRefno").keyup(function () { }).ForceIntegerOnly();
    },

    clearInput: function () {
        $(':input[type=text]').val('');
        $('.item-number').remove();
    },

    searchTickets: function (event) {
        event.stopPropagation();
        if (recoverCashOutValidation.checkParamsBeforeSearch()) {
            recoverCashOutService.searchTickets();
        }
    },

    recoverTickets: function (event) {
        event.stopPropagation();
        if (recoverCashOutValidation.checkParamsBeforerecover()) {
            recoverCashOutService.recoverTickets();
        }
    }
};