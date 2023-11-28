"use strict";

const voidCashOutDirective = {
    init: function () {
        voidCashOutDirective.keyUpHandle();
        NapTicketControl.Helper.InitNumberGroup();
        voidCashOutDirective.initTransDateFilter();
        voidCashOutDirective.filterHandle();

        $(document).click(function () {
            $('#show-error-move-bet').hide();
        });

        $('.toggle-filter-bar').click(function () {
            NapTicketControl.Helper.ToggleFilterBar(this);
        });

        $('#btnSearch').click(function (event) {
            voidCashOutDirective.searchTickets(event);
        });

        $('#btnVoidBet').click(function (event) {
            voidCashOutDirective.voidTickets(event);
        });
    },

    keyUpHandle: function () {
        $('#txtTransId').keyup(function () {
            const value = $('#txtTransId').val();
            if (value.length === 0) {
                $('#txtTransId').addClass("text-number");
                $('#txtTransId').removeClass("text-number-invalid");
            }
            else {
                if (!voidCashOutValidation.isNumber(value)) {
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
    },

    filterHandle: function () {
        $(".text-number").prop('disabled', true);
        $(".radio-bettrade").on('click', function () {
            if (this.value === "0") {
                $('#isFilterTransDate').prop('disabled', false);
                $("#radio-by-match").prop('checked', true);
                $("#radio-by-bet").prop('checked', false);
                $("#txtMatchId").prop('disabled', false);
                $("#transTime").prop('disabled', false);
                $("#acceptTime").prop('disabled', false);
                $("#fromTransDate").prop('disabled', false);
                $("#toTransDate").prop('disabled', false);
                $("#fromTime").prop('disabled', false);
                $("#toTime").prop('disabled', false);
                $("#btnTransDate").prop('disabled', false);
                $("#number-group").removeClass('number-group');
                $("#number-group").addClass('number-group-disabled');
                $("#txtTransId").prop('disabled', true);
            }
            else {
                $('#isFilterTransDate').prop('disabled', true).prop('checked', false).trigger('change');
                $("#radio-by-match").prop('checked', false);
                $("#radio-by-bet").prop('checked', true);
                $("#txtMatchId").prop('disabled', true);
                $("#transTime").prop('disabled', true);
                $("#acceptTime").prop('disabled', true);
                $("#fromTransDate").prop('disabled', true);
                $("#toTransDate").prop('disabled', true);
                $("#fromTime").prop('disabled', true);
                $("#toTime").prop('disabled', true);
                $("#btnTransDate").prop('disabled', true);
                $("#number-group").removeClass('number-group-disabled');
                $("#number-group").addClass('number-group');
                $("#txtTransId").prop('disabled', false);
                $("#txtTransId").focus();
            }
            voidCashOutDirective.clearInput();
        });
    },

    clearInput: function () {
        $("#txtMatchId").val('');
        $("#txtTransId").val('');
        $('.item-number').remove();
    },

    searchTickets: function (event) {
        event.stopPropagation();
        if (voidCashOutValidation.checkParamsBeforeSearch()) {
            voidCashOutService.searchTickets();
        }
    },

    voidTickets: function (event) {
        event.stopPropagation();
        if (voidCashOutValidation.checkParamsBeforeVoid()) {
            voidCashOutService.voidTickets();
        }
    },

    initTransDateFilter: function () {
        const fromTransDate = $('#fromTransDate');
        const toTransDate = $('#toTransDate');
        fromTransDate.datepicker({
            format: "yyyy/mm/dd"
        });
        fromTransDate.datepicker('update', new Date());

        toTransDate.datepicker({
            format: "yyyy/mm/dd"
        });
        toTransDate.datepicker('update', new Date());

        const currentTime = moment().format('hh:mm:ss.SSS A');
        $('#fromTime').val(currentTime);
        $('#toTime').val(currentTime);

        // event
        $('.from-transdate-icon').on('click', function () {
            $('#fromTransDate').datepicker('show');
        });

        $('.to-transdate-icon').on('click', function () {
            $('#toTransDate').datepicker('show');
        });

        $('#fromTime').on('paste', function () {
            const element = $(this);
            setTimeout(function () {
                voidCashOutValidation.checkTimeValuePasted(element);
            }, 1);
        });

        $('#toTime').on('paste', function () {
            const element = $(this);
            setTimeout(function () {
                voidCashOutValidation.checkTimeValuePasted(element);
            }, 1);
        });
    }
};