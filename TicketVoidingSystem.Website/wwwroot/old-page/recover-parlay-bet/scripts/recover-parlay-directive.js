"use strict";

var recoverParlayDirective = {
    MaxTransIds: 1000,

    init: function () {
        NapTicketControl.Helper.MaxTransIdPerBatch = recoverParlayDirective.MaxTransIds;
        $('#txtTransId').keyup(recoverParlayDirective.keyupTransId()).ForceIntegerOnly();
        NapTicketControl.Helper.InitNumberGroup();
        recoverParlayDirective.handleByTicketType();

        $('.ticket-type').on('click', function () {
            recoverParlayDirective.handleByTicketType();
        });

        $('#bet-builder-plus').on('change', function () {
            recoverParlayDirective.handleBetBuilderChange();
        });

        $(document).on('change', 'select[name="bet-type"], #bet-type, .bet-type', function () {
            if (!$(this).prop('disabled')) {
                recoverParlayDirective.clearClassOfInputTransId();
            }
        });

        $("#matchId").on("blur", function (event) {
            recoverParlayDirective.checkMatchId(event);
        });

        $('#search').on('click', function (event) {
            recoverParlayDirective.search(event);
        });

        $('#recover').on("click", function (event) {
            recoverParlayDirective.recover(event);
        });

        $(document).click(function () {
            $('#show-error-move-bet').hide();
        });
    },

    keyupTransId: function () {
        var value = $('#txtTransId').val();
        if (value.length === 0) {
            $('#txtTransId').addClass("text-number");
            $('#txtTransId').removeClass("text-number-invalid");
        }
        else {
            if (!recoverParlayValidation.isNumber(value)) {
                $('#txtTransId').removeClass("text-number");
                $('#txtTransId').addClass("text-number-invalid");
            }
            else {
                $('#txtTransId').addClass("text-number");
                $('#txtTransId').removeClass("text-number-invalid");
            }
        }
    },

    handleByTicketType: function () {
        var ticketType = $('input[name=ticket-type]:checked').val();
        if(ticketType === 'sub'){
            $('#matchId').prop('disabled', false);
            // Show Bet Builder+ only when Sub is selected
            $('#bet-builder-plus').closest('.filter-cell').show();
            // Default: enable BetType, disable Bet Builder+
            $('#bet-builder-plus').prop('disabled', false).prop('checked', false);
        }else{
            $('#matchId').prop('disabled', true);
            $('#bet-builder-plus').prop('disabled', true);
            // Hide Bet Builder+ when Main is selected
            $('#bet-builder-plus').closest('.filter-cell').hide();
            $('#bet-builder-plus').prop('checked', false);
            $('.bet-type').prop('disabled', false);
        }
        $('#report-content').hide();
        recoverParlayDirective.clearInput();
    },

    handleBetBuilderChange: function () {
        if ($('#bet-builder-plus').is(':checked')) {
            $('.bet-type').prop('disabled', true);
        } else {
            $('.bet-type').prop('disabled', false);
        }
        recoverParlayDirective.clearClassOfInputTransId();
    },

    
    clearClassOfInputTransId: function () {
        $('#txtTransId').removeClass("text-number-invalid");
        $('#txtTransId').addClass("text-number");
        $('.item-number .value-number-invalid').removeClass("value-number-invalid").addClass("value-number");
    },

    
    clearInput: function () {
        $(':input[type=text]').val('');
        $('.item-number').remove();
    },

    checkMatchId: function (event) {
        event.stopPropagation();
        if (!recoverParlayValidation.checkMatchId()) {
            return;
        }
    },

    search: function (event) {
        event.stopPropagation();
        $('#show-error-move-bet').hide();
        var ticketType = $('input[name=ticket-type]:checked').val();
        if (ticketType === 'sub') {
            if (recoverParlayValidation.validSubBeforeSearch()) {
                recoverParlayService.searchSubParlay();
            }
        }
        else {
            if (recoverParlayValidation.validMainBeforeSearch()) {
                recoverParlayService.searchMainParlay();
            }
        }
    },

    recover: function (event) {
        event.stopPropagation();
        var transIds = NapTicketControl.Helper.getSubTicketsChecked("checkBoxItem");
        if (recoverParlayValidation.isEmptyTicket(transIds)) {
            recoverParlayService.confirmBeforeRecover();
        }
    }
};