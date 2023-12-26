/* exported showMP, showCombMP*/
/*global NapTicketControl*/

"use strict";

var subTicketMP = {
    getSubTicketMP: function (subTransId, refNo) {
        var param = {
            RefNo: refNo
        };

        var subTicket = $('#divEvent_' + subTransId);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $('#dvFavorite_' + subTransId).show();
            } else {
                subTicket.show();
                $('#dvFavorite_' + subTransId).hide();
            }

            $("#ticketInfo").fanexGrid('resizeGrid');
            return;
        }

        $.ajax({
            type: "POST",
            url: window.rootUrl + "SubParlayTicket/GetNormalParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                var arrChoice = [];
                for (var i = 0; i < rs.length; i++) {
                    var row = rs[i];
                    if (BigInt(subTransId) === BigInt(row.SubTransId)) {
                        arrChoice.push('<div class="line"><div class="selected">' + row.Choice + '</div></div>');
                    } else {
                        arrChoice.push('<div class="line">' + row.Choice + '</div>');
                    }
                }

                $('#divEvent_' + subTransId).html(arrChoice.join('')).show();
                $("#ticketInfo").fanexGrid('resizeGrid');
                $('#dvFavorite_' + subTransId).hide();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(NapTicketControl.Helper.authorizedMessage);
                }
                NapTicketControl.enableInput();
            }
        });
    },

    getSubTicketAndComboParlay: function (subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam) {
        var param = {
            RefNo: refNo,
            BetTeam: betteam,
            BetCheck: betcheck,
            Handicap1: handicap1,
            Handicap2: handicap2
        };

        var subTicket = $('#divEvent_' + subTransId);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $('#dvFavorite_' + subTransId).show();
                $('#combinationOfferName_' + subTransId + transIndex).find('div').show();
            } else {
                subTicket.show();
                $('#dvFavorite_' + subTransId).hide();
                $('#combinationOfferName_' + subTransId + transIndex).find('div').hide();
            }

            $("#ticketInfo").fanexGrid('resizeGrid');
            return;
        }

        $.ajax({
            type: "POST",
            url: window.rootUrl + "SubParlayTicket/GetComboParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                var arrChoice = [];
                for (var i = 0; i < rs.length; i++) {
                    var row = rs[i];
                    if (row.SubTransId === "") {
                        arrChoice.push('<div>' + row.Choice + '</div>');
                    }
                    else if (BigInt(subTransId) === BigInt(row.SubTransId)) {
                        arrChoice.push('<div class="line"><div class="selected">' + row.Choice + '</div></div>');
                    } else {
                        arrChoice.push('<div class="line">' + row.Choice + '</div>');
                    }
                }

                $('#divEvent_' + subTransId).html(arrChoice.join('')).show();
                $("#ticketInfo").fanexGrid('resizeGrid');
                $('#dvFavorite_' + subTransId).hide();
                $('#combinationOfferName_' + subTransId + transIndex).find('div').hide();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }
                NapTicketControl.enableInput();
            }
        });
    }
};

function showMP(subTransId, refNo) {
    subTicketMP.getSubTicketMP(subTransId, refNo);
}

function showCombMP(subTransId, type, refNo) {
    subTicketMP.getSubTicketMP(subTransId, refNo);
}

function showNewCombMP(subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam) {
    subTicketMP.getSubTicketAndComboParlay(subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam);
}

function showSingleMatchParlayDetail(transId, cusId, status, index) {
    var param = { TransId: transId };

    var subTicket = $('#divEvent_' + transId + index);

    if (subTicket.html() !== '') {
        var display = subTicket.css('display');
        if (display === 'block') {
            subTicket.hide();
        } else {
            subTicket.show();
        }

        $("#ticketInfo").fanexGrid('resizeGrid');
        return;
    }

    $.ajax({
        type: "POST",
        url: window.rootUrl + "SubParlayTicket/GetSelectionsSMP",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(param),
        beforeSend: function () {
            NapTicketControl.disableInput();
        },
        success: function (rs) {
            $('#divEvent_' + transId + index).html(rs).show();
            $("#ticketInfo").fanexGrid('resizeGrid');
        },
        error: function () {
        },
        complete: function (e) {
            if (parseInt(e.status) === 403) {
                NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
            }
            NapTicketControl.enableInput();
        }
    });
}