/* exported showMP, showCombMP*/

"use strict";

var subTicketParlay = {
    getSubTicketParlay: function (subTransId, refNo) {
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

            return;
        }

        $.ajax({
            type: "POST",
            url: "api/SubParlayTicket/GetNormalParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                Helper.disableInput();
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
                $(`#dvFavorite_${subTransId}`).hide();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    Helper.showMsgBox('You do not have permission on this function');
                }
                Helper.enableInput();
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

            return;
        }

        $.ajax({
            type: "POST",
            url: "api/SubParlayTicket/GetComboParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                Helper.disableInput();
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
                $(`#dvFavorite_${subTransId}`).hide();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').hide();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    Helper.showMsgBox('You are not authorized on this function.');
                }
                Helper.enableInput();
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

            return;
        }

        $.ajax({
            type: "POST",
            url: "api/SubParlayTicket/GetHybridParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                Helper.disableInput();
            },
            success: function (rs) {
                var arrChoice = rs[0].choice;

                $(`#divEvent_${subTransId}`).html(arrChoice).show();
                $(`#dvFavorite_${subTransId}`).hide();
                $(`#combinationOfferName_${subTransId}${transIndex}`).find('div').hide();
                $('.hybrid-parlay-match-ticket-list .list-builder').addClass('list-builder-bg-none');
                $(`.${subTransId}`).css('background-color', '#EDFCFF');
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    Helper.showMsgBox('You are not authorized on this function.');
                }
                Helper.enableInput();
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

        var subTicket = $(`#divEvent_${refNo}`);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
            } else {
                subTicket.show();
            }

            return;
        }

        $.ajax({
            type: "POST",
            url: "api/SubParlayTicket/GetNormalParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                Helper.disableInput();
            },
            success: function (rs) {
                var arrChoice = [];
                for (var i = 0; i < rs.length; i++) {
                    var row = rs[i];
                    arrChoice.push('<div class="line">' + row.choice + '</div>');
                }

                $(`#divEvent_${refNo}`).html(arrChoice.join('')).show();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    Helper.showMsgBox('You are not authorized on this function.');
                }
                Helper.enableInput();
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

        var subTicket = $(`#divEvent_${refNo}${transIndex}`);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $(`#combinationOfferName_${refNo}${transIndex}`).find('div').show();
            } else {
                subTicket.show();
                $(`#combinationOfferName_${refNo}${transIndex}`).find('div').hide();
            }

            return;
        }

        $.ajax({
            type: "POST",
            url: "api/SubParlayTicket/GetComboParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                Helper.disableInput();
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

                $(`#divEvent_${refNo}${transIndex}`).html(arrChoice.join('')).show();
                $(`#combinationOfferName_${refNo}${transIndex}`).find('div').hide();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    Helper.showMsgBox('You are not authorized on this function.');
                }
                Helper.enableInput();
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

        var subTicket = $(`#divEvent_${refNo}${transIndex}`);

        if (subTicket.html() !== '') {
            var display = subTicket.css('display');
            if (display === 'block') {
                subTicket.hide();
                $(`#combinationOfferName_${refNo}${transIndex}`).find('div').show();
            } else {
                subTicket.show();
                $(`#combinationOfferName_${refNo}${transIndex}`).find('div').hide();
            }

            return;
        }

        $.ajax({
            type: "POST",
            url: "api/SubParlayTicket/GetHybridParlay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                Helper.disableInput();
            },
            success: function (rs) {
                var arrChoice = [];
                for (var i = 0; i < rs.length; i++) {
                    var row = rs[i];
                    if (row.subTransId === "") {
                        arrChoice.push('<div>' + row.choice + '</div>');
                    }
                    else {
                        arrChoice.push(row.choice);
                    }
                }

                $(`#divEvent_${refNo}${transIndex}`).html(arrChoice.join('')).show();
                $(`#combinationOfferName_${refNo}${transIndex}`).find('div').hide();
            },
            error: function () {
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    Helper.showMsgBox('You are not authorized on this function.');
                }
                Helper.enableInput();
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
    if (subTransId > 0) {
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

function showBetBuilderPlus(transId, transIndex, refNo, custId, transDesc, handicap1, handicap2, betcheck, betteam, currency, stake) {
    const transDescJson = JSON.stringify(transDesc);
    if (transId > 0) {
        subTicketParlay.getHybridTickets(transId, transIndex, refNo, custId, transDescJson, handicap1, handicap2, betcheck, betteam, currency, stake);
    }
    else {
        mainTicketParlay.getHybridTickets(transId, transIndex, refNo, custId, transDescJson, handicap1, handicap2, betcheck, betteam, currency, stake);
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
                alert('The list of betids has been copied into clipboard already. Please paste it immediately for the next necessary action.');
                tmpElem.remove();
            }
        }
    },

    copyToClipboardFF: function (text) {
        window.prompt('Please press the hot key &quot;Ctrl + C&quot; to copy the following list of betids into clipboard.', text);
    },

    disableInput: function () {
        $.blockUI();
    },

    enableInput: function () {
        $.unblockUI();
    },

    showMsgBox: function (msgs) {
        var msgbox = $('#msg-box');

        if (msgbox.length === 0) {
            msgbox = $(
                '<div class="alert alert-error" id="msg-box">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<div class="alert-content">' +
                '</div>' +
                '</div>').prependTo('body');
        }

        var html = [];

        if ($.isPlainObject(msgs)) {
            if (msgs.ErrorCode > 0) {
                html.push('<span class="fail">' + msgs.ErrorMsg + '&nbsp;<i class="icon-warning-sign"></i></span><br/>');
            } else {
                var message = msgs.ErrorMsg.split('~');
                for (var i = 0; i < message.length; i++) {
                    message[i].indexOf('-') !== -1 ?
                        html.push('<span class="fail">' + message[i].substring(1) + '&nbsp;<i class="icon-warning-sign"></i></span><br/>') :
                        html.push('<span>' + message[i] + '&nbsp;<i class="icon-ok"></i></span><br/>');
                }
            }
        } else {
            if ($.isArray(msgs)) {
                for (var j = 0; j < msgs.length; j++) {
                    var msg = msgs[j];
                    if (msg.ErrorCode > 0) {
                        html.push('<span class="fail">' + msg.ErrorMsg + '&nbsp;<i class="icon-warning-sign"></i></span><br/>');
                    } else {
                        html.push('<span>' + msg.ErrorMsg + '&nbsp;<i class="icon-ok"></i></span><br/>');
                    }
                }
            } else {
                html.push('<span class="fail">' + msgs + '<i class="icon-warning-sign"></i></span><br/>');
            }
        }

        msgbox.attr('class', 'alert alert-success').find('.alert-content').html(html.join(''));
        msgbox.fadeIn();
        msgbox.show();
    },
};

$(function () {
    $(document).on("click", "#copy-clipboard", function (e) {
        Helper.copyToClipboard();
    });
});

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
        return;
    }

    $.ajax({
        type: "POST",
        url: "api/SubParlayTicket/GetSelectionsSMP",
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(param),
        beforeSend: function () {
            Helper.disableInput();
        },
        success: function (rs) {
            $(`#divEvent_${transId}${index}`).html(rs).show();
        },
        error: function () {
        },
        complete: function (e) {
            if (parseInt(e.status) === 403) {
                Helper.showMsgBox('You are not authorized on this function.');
            }
            Helper.enableInput();
        }
    });
}