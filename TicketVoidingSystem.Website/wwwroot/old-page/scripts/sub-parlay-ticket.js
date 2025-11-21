/* exported showMP, showCombMP*/
/*global NapTicketControl*/

"use strict";

var subTicketMP = {
    getSubTicketMP: function (subTransId, refNo) {
        var param = {
            RefNo: refNo
        };

        var subTicket = $(`#divEvent_${subTransId}`);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $(`#dvFavorite_${subTransId}`).show();
            } else {
                subTicket.show();
                $(`#dvFavorite_${subTransId}`).hide();
            }

            $("#ticketInfo").fanexGrid('resizeGrid');
            return;
        }

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/SubParlayTicket/GetNormalParlay",
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
                    if (BigInt(subTransId) === BigInt(row.subTransId)) {
                        arrChoice.push('<div class="line"><div class="selected">' + row.choice + '</div></div>');
                    } else {
                        arrChoice.push('<div class="line">' + row.choice + '</div>');
                    }
                }

                $(`#divEvent_${subTransId}`).html(arrChoice.join('')).show();
                $("#ticketInfo").fanexGrid('resizeGrid');
                $(`#dvFavorite_${subTransId}`).hide();
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

        var subTicket = $(`#divEvent_${subTransId}`);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $(`#dvFavorite_${subTransId}`).show();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').show();
            } else {
                subTicket.show();
                $(`#dvFavorite_${subTransId}`).hide();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').hide();
            }

            $("#ticketInfo").fanexGrid('resizeGrid');
            return;
        }

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/SubParlayTicket/GetComboParlay",
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
                    if (row.subTransId === "") {
                        arrChoice.push('<div>' + row.choice + '</div>');
                    }
                    else if (BigInt(subTransId) === BigInt(row.subTransId)) {
                        arrChoice.push('<div class="line"><div class="selected">' + row.choice + '</div></div>');
                    } else {
                        arrChoice.push('<div class="line">' + row.choice + '</div>');
                    }
                }

                $(`#divEvent_${subTransId}`).html(arrChoice.join('')).show();
                $("#ticketInfo").fanexGrid('resizeGrid');
                $(`#dvFavorite_${subTransId}`).hide();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').hide();
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
    },

    getHybridTickets: function (subTransId, transIndex, refNo, custId, transDesc, handicap1, handicap2, betcheck, betteam, currency, stake) {
        var param = {
            RefNo: refNo,
            TransDesc: transDesc,
            subTransId: subTransId,
            hdp1: handicap1,
            hdp2: handicap2,
            betCheck: betcheck,
            betTeam: betteam,
            custId: custId,
            currency: currency,
            stake: stake
        };

        var subTicket = $(`#divEvent_${subTransId}`);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $(`#dvFavorite_${subTransId}`).show();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').show();
            } else {
                subTicket.show();
                $(`#dvFavorite_${subTransId}`).hide();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').hide();
            }

            $("#ticketInfo").fanexGrid('resizeGrid');
            return;
        }

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/SubParlayTicket/GetHybridParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                var arrChoice = rs[0].choice;

                $(`#divEvent_${subTransId}`).html(arrChoice).show();
                $(`#dvFavorite_${subTransId}`).hide();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').hide();
                $('.hybrid-parlay-match-ticket-list .list-builder').addClass('list-builder-bg-none');
                $(`.${subTransId}`).css('background-color', '#EDFCFF');
                $("#ticketInfo").fanexGrid('resizeGrid');
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox('You are not authorized on this function.');
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

function showBetBuilderPlus(transId, transIndex, refNo, custId, transDesc, handicap1, handicap2, betcheck, betteam, currency, stake) {
    const transDescJson = JSON.stringify(transDesc);
    subTicketMP.getHybridTickets(transId, transIndex, refNo, custId, transDescJson, handicap1, handicap2, betcheck, betteam, currency, stake);
}

function showSingleMatchParlayDetail(transId, cusId, status, index) {
    var param = { TransId: transId };

    var subTicket = $(`#divEvent_${transId}${index}`);

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
        url: window.rootUrl + "api/SubParlayTicket/GetSelectionsSMP",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(param),
        beforeSend: function () {
            NapTicketControl.disableInput();
        },
        success: function (rs) {
            $(`#divEvent_${transId}${index}`).html(rs).show();
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