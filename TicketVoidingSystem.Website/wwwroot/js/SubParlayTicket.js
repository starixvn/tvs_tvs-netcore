/* exported showMP, showCombMP*/
/*global NapTicketControl*/

"use strict";

var subTicketParlay = {
    getSubTicketParlay: function (subTransId, refNo) {
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
            url: "SubParlayTicket/GetNormalParlay",
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
            url: "api/SubParlayTicket/GetComboParlay",
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

var mainTicketParlay = {
    getSubTicketParlay: function (subTransId, refNo) {
        var param = {
            RefNo: refNo,
            TransId: subTransId
        };

        var subTicket = $('#divEvent_' + refNo);

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
            url: "SubParlayTicket/GetNormalParlay",
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
                    arrChoice.push('<div class="line">' + row.choice + '</div>');
                }

                $('#divEvent_' + refNo).html(arrChoice.join('')).show();
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
    },

    getSubTicketAndComboParlay: function (subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam) {
        var param = {
            RefNo: refNo,
            TransId: subTransId,
            BetTeam: betteam,
            BetCheck: betcheck,
            Handicap1: handicap1,
            Handicap2: handicap2
        };

        var subTicket = $('#divEvent_' + refNo + transIndex);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $('#combinationOfferName_' + refNo + transIndex).find('div').show();
            } else {
                subTicket.show();
                $('#combinationOfferName_' + refNo + transIndex).find('div').hide();
            }

            $("#ticketInfo").fanexGrid('resizeGrid');
            return;
        }

        $.ajax({
            type: "POST",
            url: "SubParlayTicket/GetComboParlay",
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
                    else {
                        arrChoice.push('<div class="line">' + row.choice + '</div>');
                    }
                }

                $('#divEvent_' + +refNo + transIndex).html(arrChoice.join('')).show();
                $('#combinationOfferName_' + refNo + transIndex).find('div').hide();
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
};

function showMP(subTransId, refNo) {
    if (subTransId > 0) {
        subTicketParlay.getSubTicketParlay(subTransId, refNo);
    }
    else {
        mainTicketParlay.getSubTicketParlay(subTransId, refNo);
    }
}

function showCombMP(subTransId, type, refNo) {
    if (subTicketParlay > 0) {
        subTicketParlay.getSubTicketParlay(subTransId, refNo);
    }
    else {
        mainTicketParlay.getSubTicketParlay(subTransId, refNo);
    }
}

function showNewCombMP(subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam) {
    if (subTransId > 0) {
        subTicketParlay.getSubTicketAndComboParlay(subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam);
    }
    else {
        mainTicketParlay.getSubTicketAndComboParlay(subTransId, transIndex, refNo, handicap1, handicap2, betcheck, betteam);
    }
}

var Helper = {
    copyToClipboard: function () {
        var success = true,
            range = document.createRange(),
            selection;

        if (window.clipboardData) {
            window.clipboardData.setData("Text", $("#copy-clipboard-value").val());
        } else {
            var tmpElem = $('<div>');
            tmpElem.css({
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
            tmpElem.text($("#copy-clipboard-value").val());
            $("#body").append(tmpElem);
            range.selectNodeContents(tmpElem.get(0));
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            try {
                success = document.execCommand("copy", false, null);
            }
            catch (e) {
                Helper.copyToClipboardFF($("#copy-clipboard-value").val());
            }
            if (success) {
                alert(messages.infoCopyClipboard);
                tmpElem.remove();
            }
        }
    },

    copyToClipboardFF: function (text) {
        window.prompt(messages.pressCtrlC, text);
    }
};

$(function () {
    $(document).on("click", "#copy-clipboard", function (e) {
        Helper.copyToClipboard();
    });
});

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
        url: "SubParlayTicket/GetSelectionsSMP",
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