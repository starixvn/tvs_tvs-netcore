/*global NapTicketControl: true, ContextMenu, tooltip, AdvancedMode*/
"use strict";

if (NapTicketControl === undefined) {
    var NapTicketControl = {};
}

NapTicketControl.Helper = (function ($) {
    var countTransId = 1;

    return {
        authorizedMsg: 'You do not have permission on this function',
        issueTypeAbnormalBet: '27',
        MaxTransIdPerBatch: 100,
        MaxHeightAllBettypes: 116,
        NotSupportBetTypes: ['22', '11'],
        ConsolidatedNotSupportBetTypes: ['160', '199'],
        ConsolidatedIBC: ['1', '2', '3', '20', '153', '154', '155', '156', '144', '2', '159', '151', '161', '171', '162', '191', '4', '30',
            '172', '152', '188', '184', '177', '186', '185', '146', '189', '190', '147', '148', '133', '134', '149', '150', '140', '141', '142', '17', '18',
            '401', '402', '403', '404'],
        ConsolidatedSportingSolutions: [1303, 1305, 1306, 1301, 1308, 1311, 1316, 1312, 163, 157, 406, 410, 407, 408, 409, 411, 413, 414,
            415, 416, 427, 428, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 183, 178,
            461, 462, 463, 464],
        betTypes: {
            Sportsbook: null,
            NumberGame: null,
            VirtualSports: null,
            BetradarVirtualSports: null
        },

        modeType: {
            Sportsbook: 0,
            NumberGame: 1,
            EarlyKickOff: 2,
            TicketListing: 3,
            MixParlay: 4,
            VirtualSports: 5
        },

        gameType: {
            Sportsbook: 0,
            VirtualSports: 2,
            NumberGame: 1,
            MetricGaming: 4,
            BetradarVirtualSports: 5,
            Lucky3: 6
        },

        sportsType: {
            SportsBook: 0,
            VirtualSports: 1,
            NumberGame: 2,
            BetTrade: 4,
            CashOut: 5
        },

        checkStatement: {
            msgEnglish: 'Kindly double check your statement again. ',
            msgChineseTraditional: '請重新檢查您的帳目. ',
            msgChineseSimplified: '请重新检查您的帐目. ',
            msgChineseNewSimplified: '请重新检查您的帐目. '
        },

        checkParlay: {
            msgEnglish: '[Parlay]',
            msgChineseTraditional: '[串關]',
            msgChineseSimplified: '[串关]',
            msgChineseNewSimplified: '[串关]'
        },

        ChangeNumberItem: function (e) {
            var itemNumberCount = $('.item-number').length;
            if (itemNumberCount >= NapTicketControl.Helper.MaxTransIdPerBatch) {
                return false;
            }

            var code = "";
            var value = $("#txtTransId").val();
            var keyComma = 188;
            var keyBackspace = 8;

            if (e.which) {
                code = e.which;
            } else if (e.keyCode) {
                code = e.keyCode;
            }

            if (e.shiftKey && (code >= 48 && code <= 57)) {
                e.preventDefault();
            }

            if (parseInt(code) === keyComma) {
                if (value.toString() === "") {
                    e.preventDefault();
                    return;
                }

                NapTicketControl.Helper.AddNumberItem(value);
                e.preventDefault();
            }
            else if (parseInt(code) === keyBackspace) {
                if (value.toString() === "") {
                    var $this = this;
                    NapTicketControl.Helper.RemoveNumberItemByKeyBackspace($this);
                }
            }
            else {
                if (value.length >= 19) {
                    return e.ctrlKey && (parseInt(e.which) === 86 || parseInt(e.which) === 65 || parseInt(e.which) === 67) ||
                        code >= 35 && code <= 40;
                }
                else {
                    return e.ctrlKey && (parseInt(e.which) === 86 || parseInt(e.which) === 65 || parseInt(e.which) === 67) ||
                        code >= 35 && code <= 40 ||
                        code >= 48 && code <= 57 ||
                        code >= 96 && code <= 105;
                }
            }
        },

        RederNumberItem: function (value, isNumber) {
            var item = "";
            if (isNumber && value.length < 20) {
                item += "<div class='item-number'><span class='value-number'>";
            }
            else {
                item += "<div class='item-number'><span class='value-number-invalid'>";
            }
            item += value;
            item += "</span><span class='icon-delete'>&nbsp</span></div>";
            countTransId++;
            return item;
        },

        AddNumberItem: function (number) {
            var isTransIdContainNumberOnly = /^\+?(0|[1-9]\d*)$/.test(number);
            $(".text-number").before(NapTicketControl.Helper.RederNumberItem(number, isTransIdContainNumberOnly));
            $(".text-number").val("");
            $(".icon-delete").mousedown(NapTicketControl.Helper.RemoveNumberItem);
            $(".value-number").disableSelection();
            $(".icon-delete").disableSelection();
        },

        RemoveNumberItem: function () {
            $(this).parent().remove();
        },

        RemoveNumberItemByKeyBackspace: function (number) {
            $(number.previousSibling).remove();
        },

        InitNumberGroup: function () {
            $(".text-number").keydown(NapTicketControl.Helper.ChangeNumberItem
            );

            $(".number-group").mouseup(function () {
                $(".text-number").focus();
            });

            $(".number-group-disabled").mouseup(function () {
                if ($("#radio-by-bet").is(':checked')) {
                    $(".text-number").focus();
                }
            });

            $("#txtTransId").bind("blur paste", function (e) {
                setTimeout(function () {
                    if (window.clipboardData && e.type.toString() !== 'blur') {
                        $("#txtTransId").val(window.clipboardData.getData('text'));
                    }

                    var value = $("#txtTransId").val();
                    var transIds = "";
                    if (value.indexOf(",") >= 0) {
                        transIds = value.split(',');
                    }
                    else {
                        transIds = value.split(' ');
                    }

                    for (var index = 0; index < transIds.length; index++) {
                        var transId = $.trim(transIds[index]);
                        var itemNumberCount = $('.item-number').length;
                        if (itemNumberCount >= NapTicketControl.Helper.MaxTransIdPerBatch) {
                            return false;
                        }
                        else {
                            if (transId.length > 0) {
                                if (transId.length > 75) {
                                    transId = transId.substring(0, 75) + "...";
                                }

                                NapTicketControl.Helper.AddNumberItem(transId);
                            }
                        }
                    }
                }, 0);
            });
        },

        GetBettypes: function (product, modeId) {
            var self = this;

            if (NapTicketControl.Helper.betTypes[modeId] !== undefined) { // jshint ignore:line
                var html = self.RenderBettypes(product, modeId);
                $('.bettype-wrp').html(html);
            } else {
                var param = {
                    mode: modeId
                };

                $.ajax({
                    type: "POST",
                    url: window.rootUrl + "BetTypes/GetBettypes",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(param),
                    beforeSend: function () {
                        NapTicketControl.disableInput();
                    },
                    success: function (result) {
                        if (result.Result.ErrorCode === 0) {
                            NapTicketControl.Helper.betTypes[modeId] = result.Bettypes;
                            var html = self.RenderBettypes(product, modeId);
                            $('.bettype-wrp').html(html);
                        }
                    },
                    error: function () {
                    },
                    complete: function () {
                        NapTicketControl.enableInput();
                    }
                });
            }
        },

        RenderBettypes: function (product, modeId) {
            var bettypes = null;

            if (parseInt(modeId) === NapTicketControl.Helper.modeType.TicketListing) {
                if (parseInt(product) === NapTicketControl.Helper.gameType.Sportsbook) {
                    bettypes = NapTicketControl.Helper.betTypes.Sportsbook !== null ?
                        NapTicketControl.Helper.betTypes.Sportsbook :
                        $.grep(NapTicketControl.Helper.betTypes[modeId], function (value) {
                            return value.Type === 0;
                        });

                    if (bettypes.length === 0) {
                        $('.bettype-wrp').hide();
                        return;
                    }
                }

                if (parseInt(product) === NapTicketControl.Helper.gameType.NumberGame) {
                    bettypes = $.grep(NapTicketControl.Helper.betTypes[modeId], function (value) {
                        return value.Type === 1;
                    });
                }

                if (parseInt(product) === NapTicketControl.Helper.gameType.VirtualSports) {
                    bettypes = $.grep(NapTicketControl.Helper.betTypes[modeId], function (value) {
                        return value.Type === 2;
                    });
                }

                if (parseInt(product) === NapTicketControl.Helper.gameType.MetricGaming) {
                    bettypes = $.grep(NapTicketControl.Helper.betTypes[modeId], function (value) {
                        return value.Type === 4;
                    });
                }

                if (parseInt(product) === NapTicketControl.Helper.gameType.BetradarVirtualSports) {
                    bettypes = $.grep(NapTicketControl.Helper.betTypes[modeId], function (value) {
                        return value.Type === 5;
                    });
                }

                if (parseInt(product) === NapTicketControl.Helper.gameType.Lucky3) {
                    bettypes = $.grep(NapTicketControl.Helper.betTypes[modeId], function (value) {
                        return value.Type === 6;
                    });
                }
            } else {
                bettypes = NapTicketControl.Helper.betTypes[modeId];
            }

            var html = '<table id="bodybettype" class="tbl-bettype">';
            html += '<thead><tr><th colspan="5">'
                + '<input type="checkbox" id="chkallbettype" checked="checked" />'
                + '<label for="chkallbettype"><b>All Bet types</b></label>'
                + '<div class="show-all-bettype display-none"><label class="width-120 float-right"><b>Show All Bet types</b></label>'
                + '<i class="show-hide icon-show-all-bettype float-right"></i>'
                + '</div></th></tr></thead>';

            if (parseInt(product) === NapTicketControl.Helper.gameType.NumberGame) {
                var deadBallBettypes = $.grep(bettypes, function (value) {
                    return value.LiveIndicator === false;
                });
                var liveBallBettypes = $.grep(bettypes, function (value) {
                    return value.LiveIndicator === true;
                });

                html += '<tr class="bettype-group-title"> <td colspan="5">&nbsp;' + '<b>Dead ball</b>' + '</td></tr>';
                html += this.RenderBettypesDetails(deadBallBettypes, 'BetTypes', 0);

                html += '<tr class="bettype-group-title"> <td colspan="5">&nbsp;' + '<b>Live ball</b>' + '</td></tr>';
                html += this.RenderBettypesDetails(liveBallBettypes, 'LiveBetTypes', deadBallBettypes.length);
            }
            else {
                html += this.RenderBettypesDetails(bettypes, 'BetTypes');
            }

            html += '</table>';

            return html;
        },

        RenderBettypesDetails: function (bettypes, nameValue, startPosition) {
            var length = bettypes.length;
            var step = 5;
            var repeatTime = length / step;
            var html = '';

            if (startPosition === undefined) {
                startPosition = 0;
            }

            for (var i = 0; i < repeatTime; i++) {
                var offset = i * step;
                html += '<tr>';
                for (var j = 0; j < step; j++) {
                    if (offset + j < length) {
                        var bt = bettypes[offset + j];
                        var index = $.inArray(bt.Id, NapTicketControl.Helper.NotSupportBetTypes);
                        if (index !== -1) {
                            bt.Id = NapTicketControl.Helper.ConsolidatedNotSupportBetTypes[index];
                        }

                        var id = 'chk-bettype-' + bt.Id;
                        var betname = bt.Name;

                        switch (bt.Id) {
                            case '85':
                                betname = "Next Over/Under";
                                break;
                            case '86':
                                if (bt.LiveIndicator === true) {
                                    betname = "Next Odd/Even";
                                } else {
                                    betname = "FT. Odd/Even";
                                }
                                break;
                            case '90':
                                if (bt.LiveIndicator === true) {
                                    betname += " (Live Game)";
                                } else {
                                    betname += " (Pre Game)";
                                }
                                break;
                        }
                        html += '<td>';
                        html += '<input type="checkbox" checked="checked" class="chkbettype"'
                            + ' id=' + id + ' value=' + bt.Id + ' name=' + nameValue + ' />';
                        html += '<label class="lbl-bettype' + bt.Id + '" for="' + id + '">' + betname + '</label>';
                        html += '</td>';
                    } else {
                        html += '<td>&nbsp;</td>';
                    }

                    startPosition++;
                }
            }

            return html;
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

        showPopupMessage: function (msgs) {
            var html = [];
            var width = 800;

            if ($.isPlainObject(msgs)) {
                if (msgs.ErrorCode > 0) {
                    html.push('<div class="msg-fail row" style="max-height:150px;overflow:auto;">&nbsp;<div class="icon-warning-sign"></div>&nbsp;<div class="span20"><span>' +
                        msgs.ErrorMsg + '</span></div></div>');
                } else {
                    var message = msgs.ErrorMsg.split('~');
                    if (message !== null && message.length === 1) {
                        width = 400;
                        message[0].indexOf('#') !== -1 ?
                            html.push('<div class="msg-fail row" style="max-height:150px;overflow:auto;">&nbsp;<div class="icon-warning-sign"></div>&nbsp;<div class="span9"><span>' +
                                message[0].substring(1) + '</span></div></div>') :
                            html.push('<div class="msg-success row">&nbsp;<div class="icon-ok"></div>&nbsp;<div class="span8"><span>' +
                                message[0] + '</span></div></div>');
                    }
                    else {
                        for (var i = 0; i < message.length; i++) {
                            message[i].indexOf('#') !== -1 ?
                                html.push('<div class="msg-fail row" style="max-height:150px;overflow:auto;">&nbsp;<div class="icon-warning-sign"></div>&nbsp;<div class="span20"><span>' +
                                    message[i].substring(1) + '</span></div></div>') :
                                html.push('<div class="msg-success row">&nbsp;<div class="icon-ok"></div>&nbsp;<div class="span20"><span>' +
                                    message[i] + '</span></div></div>');
                        }
                    }
                }
            } else {
                if ($.isArray(msgs)) {
                    for (var j = 0; j < msgs.length; j++) {
                        var msg = msgs[j];
                        if (msg.ErrorCode > 0) {
                            html.push('<div class="msg-fail row" style="max-height:150px;overflow:auto;">&nbsp;<div class="icon-warning-sign"></div>&nbsp;<div class="span20"><span>' +
                                msg.ErrorMsg + '</span></div></div>');
                        } else {
                            html.push('<div class="msg-success row">&nbsp;<div class="icon-ok"></div>&nbsp;<div class="span20"><span>' +
                                msg.ErrorMsg + '</span></div></div>');
                        }
                    }
                } else {
                    html.push('<div class="msg-fail row" style="max-height:150px;overflow:auto;">&nbsp;<div class="icon-warning-sign"></div><div class="span20"><span>' + msgs + '</span></div></div>');
                }
            }

            $("#show-message").empty();
            $("#show-message").append(html);
            $("#show-message").dialog({
                dialogClass: "no-close",
                resizable: false,
                width: width,
                autoResize: true,
                position: [($(window).width() - width) / 2, 240]
            });
        },

        showPopupMessageWithButton: function (messages, element) {
            var html = [];
            var width = 500;
            if ($.isPlainObject(messages)) {
                NapTicketControl.Helper.addPlainMessage(messages, html);
            } else {
                for (var i = 0; i < messages.length; i++) {
                    NapTicketControl.Helper.addPlainMessage(messages[i], html);
                }
            }

            $("#show-message-have-button").empty();
            $("#show-message-have-button").append(html);
            $("#show-message-have-button").dialog({
                dialogClass: "no-close",
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                        element.click();
                    }
                },
                modal: true,
                resizable: false,
                width: width,
                autoResize: true,
                position: [($(window).width() - width) / 2, 240]
            });
        },

        ToggleFilterBar: function () {
            if ($('.filter-bar-inner').css('display') === 'none') {
                $('.filter-bar-inner').show();
                $('#scroll-icon').addClass('icon-scroll-down');
                $('#scroll-icon').removeClass('icon-scroll-up');
            } else {
                $('.filter-bar-inner').hide();
                $('#scroll-icon').addClass('icon-scroll-up');
                $('#scroll-icon').removeClass('icon-scroll-down');
            }
        },

        IsSelectedBettype: function (bettypeId) {
            var checkedVals = $('.chkbettype:checkbox:checked').map(function () {
                return this.value;
            }).get();

            var isSelected = false;

            for (var i = 0; i < checkedVals.length; i++) {
                if (parseInt(checkedVals[i]) === parseInt(bettypeId)) {
                    isSelected = true;
                    break;
                }
            }

            return isSelected;
        },

        GetBettypesChecked: function () {
            var checkedVals = $('.chkbettype:checkbox:checked').map(function () {
                return this.value;
            }).get();

            if (checkedVals.length === 0) {
                return '';
            }

            var valueConsolidated = [];
            $.map(NapTicketControl.Helper.ConsolidatedIBC, function (value, index) {
                if ($.inArray(value, checkedVals) !== -1) {
                    return valueConsolidated.push(NapTicketControl.Helper.ConsolidatedSportingSolutions[index]);
                }
            });

            if (valueConsolidated.length === 0) {
                return checkedVals.join('^');
            }

            return checkedVals.join('^') + '^' + valueConsolidated.join('^');
        },

        resetInput: function () {
            $('#txtMatchId').val('');
            $('#fromTransId').val('');
            $('#toTransId').val('');
            $('#fromRefno').val('');
            $('#toRefno').val('');
            $('#toRefno').val('');
            $('#LiveHomeScore').val('');
            $('#LiveAwayScore').val('');
            $('#LiveAwayScore').val('');
            $('#TransDate').removeAttr('checked');
            $('#MatchId').val('');
            $('#reason').val('');
            $('#hdp').val('');
            $('#goal').val('');
            $('#value').val('');

            $('#FromTransDate').val('');
            $('#ToTransDate').val('');
            $('#EventType').val(2);
            $('Select').val('All');

            $('.opt-filters').hide();

            $('#password').val('');
            $('.msg-void-ticket').val('');
        },

        updateInputContent: function (element, content) {
            $(element).val(content);
            $(element).text(content);
        },

        displayContent: function (isShow) {
            if (isShow) {
                $('#report-content').show();
            } else {
                $('#report-content').hide();
            }
        },

        getSubTicketsChecked: function (className) {
            var checkedVals = '';
            checkedVals = $('.' + className + ':checkbox:checked').not('#chk-ticket-all').map(function () {
                if (!isNaN(parseFloat(this.value))) {
                    return this.value;
                }
            }).get().join(',');

            return checkedVals;
        },

        getSubTicketModelsChecked: function (className) {
            var tickets = $('.' + className + ':checkbox:checked').not('#chk-ticket-all').map(function () {
                if (!isNaN(parseFloat(this.value))) {
                    return { transId: this.value, siteDbGroupId: this.getAttribute('site-db-group-id') };
                }
            }).get();

            return tickets;
        },

        getTicketsBetTradeChecked: function (className) {
            var checkedVals = '';
            checkedVals = $(className + ':checkbox:checked').not('#chk-ticket-all').map(function () {
                if (!isNaN(parseFloat(this.value))) {
                    return this.value;
                }
            }).get().join(',');

            return checkedVals;
        },

        initCheckBoxGroup: function (groups) {
            for (var index = 0; index < groups.length; index++) {
                var group = groups[index];
                var groupName = group.Name.toLowerCase()
                    .replace(/ /g, '-').replace(/\//g, '-').replace('(', '').replace(')', '');

                NapTicketControl.Helper.checkOrUnCheckGroup(groupName);
            }
        },

        ResetReason: function () {
            $('#reason').val('');
            $('#maxChar').text("Max 150 Characters");
            NapTicketControl.Helper.ResetReasonSC();
        },

        ReasonKeyUpHandle: function (element) {
            if (element.val().length === 0) {
                $('#maxChar').text("Max 150 Characters");
            }
            else if (element.val().length > 150) {
                var curVal = element.val();
                element.val(curVal.slice(0, 150));
                $('#maxChar').text(150 - element.val().length + " Characters Left");
            }
            else {
                $('#maxChar').text(150 - element.val().length + " Characters Left");
            }
        },

        ReasonKeyDownHandle: function (keyPressed, element) {
            if (parseInt(keyPressed.keyCode) !== 8 && element.val().length >= 150 && (keyPressed.keyCode < 37 || keyPressed.keyCode > 40)) {
                keyPressed.preventDefault();
            }
        },

        ResetReasonSC: function () {
            $('#reasonSC').val('');
            $('#maxCharSC').text("Max 150 Characters");
        },

        ReasonKeyUpHandleSC: function (element) {
            if (element.val().length === 0) {
                $('#maxCharSC').text("Max 150 Characters");
            }
            else if (element.val().length > 150) {
                var curVal = element.val();
                element.val(curVal.slice(0, 150));
                $('#maxCharSC').text(150 - element.val().length + " Characters Left");
            }
            else {
                $('#maxCharSC').text(150 - element.val().length + " Characters Left");
            }
        },

        ReasonKeyDownHandleSC: function (keyPressed, element) {
            if (parseInt(keyPressed.keyCode) !== 8 && element.val().length >= 150 && (keyPressed.keyCode < 37 || keyPressed.keyCode > 40)) {
                keyPressed.preventDefault();
            }
        },

        checkOrUnCheckGroup: function (groupName) {
            var group = $("input[type=checkbox].group-" + groupName);
            var checkBox = $("input[type=checkbox].chk-ticket-" + groupName);
            var disableCheckbox = $("input[type=checkbox].chk-ticket-" + groupName + ":disabled");
            if (checkBox.length === 1 || disableCheckbox.length === checkBox.length - 1) {
                group.prop('disabled', true);
                group.removeClass('checkBoxItem');
                group.parent().removeClass('checkBoxItem');
                checkBox.removeClass('checkBoxItem');
            }

            checkBox.checkBoxGroup();
        },

        isSettledTicket: function (statusTicket) {
            var result = false;
            var status = statusTicket.toLowerCase();
            var settledStatus = ['won', 'lose', 'draw'];
            for (var i = 0; i < 3; i++) {
                if (status.indexOf(settledStatus[i]) > -1) {
                    result = true;
                }
            }

            return result;
        },

        renderName: function (cell) {
            var username = cell.Value;
            if (username.length > 16) {
                username = username.substring(0, 15) + "...";
            }

            var nameItem = "<div title='" + cell.Value + "'>" + username + "</div>";

            return nameItem;
        },

        renderMember: function (cell) {
            var username = cell.Value.split('^');
            var title = '';
            var member = '';
            for (var i = 0; i < username.length; i++) {
                title += title === '' ? username[i] : ' (Follow: ' + username[i] + ')';
                var count = i === 0 ? 18 : 13;
                if (username[i].length > count) {
                    username[i] = username[i].substring(0, count - 1) + "...";
                }

                member += member === '' ? username[i] : '<br>(Follow: ' + username[i] + ')';
            }

            var nameItem = "<div title='" + title + "'>" + member + "</div>";

            return nameItem;
        },

        renderBetId: function (cell) {
            var betId = cell.Value.split('^');
            var betIdValue = '';
            for (var i = 0; i < betId.length; i++) {
                betIdValue += betIdValue === '' ? betId[i] : '<br>(Follow: ' + betId[i] + ')';
            }

            return betIdValue;
        },

        hoverMenuProfile: function () {
            $('.icon-avata').addClass('icon-avata-hover');
            $('.icon-avata').removeClass('icon-avata');
            $('.icon-menu-down').addClass('icon-menu-down-hover');
            $('.icon-menu-down').removeClass('icon-menu-down');
        },

        leaveMenuProfile: function () {
            $('.icon-avata-hover').addClass('icon-avata');
            $('.icon-avata-hover').removeClass('icon-avata-hover');
            $('.icon-menu-down-hover').addClass('icon-menu-down');
            $('.icon-menu-down-hover').removeClass('icon-menu-down-hover');
        },

        addLastedTicketBetTrade: function (dataRequest, soldId) {
            dataRequest.TransIdSolds += ',' + soldId;
        },

        checkValidateIsMoveTicket: function () {
            $('#msg-box').hide();
            if ($('.value-number-invalid').length > 0) {
                $('#msg').html(tooltip.show('errorBetId', messages.hightlightInvalidBetId)).show();

                if ($('.value-number-move-bet').length > 0) {
                    $('#show-error-move-bet').html(NapTicketControl.Helper.showToolTip('error-move-bet', messages.hightlightMoveTicket)).show();
                }

                return false;
            }
            else if ($('.value-number-move-bet').length > 0) {
                $('#msg').html(NapTicketControl.Helper.showToolTip('errorBetId', messages.hightlightMoveTicket)).show();

                return false;
            }

            $('.value-number').each(function () {
                if (!NapTicketControl.Helper.isNumber($(this).text())) {
                    $('#msg').html(tooltip.show('errorBetId', 'Bet ID is number only.')).show();
                    return false;
                }

                if ($(this).text().length > 19) {
                    $('#txtTransId').removeClass("text-number");
                    $('#txtTransId').addClass("text-number-invalid");
                    return false;
                }
            });

            if (!NapTicketControl.Helper.isNumber($('#txtTransId').val()) && $('#txtTransId').val().length > 0) {
                $('#msg').html(tooltip.show('errorBetId', 'Bet ID is number only.')).show();
                return false;
            }

            if ($('#txtTransId').val().length > 19) {
                $('#txtTransId').removeClass("text-number");
                $('#txtTransId').addClass("text-number-invalid");
                return false;
            }

            return true;
        },

        checkValidateIsMoveTicketWithVoidByBetId: function () {
            $('#msg-box').hide();
            $('.value-number').each(function () {
                $(this).removeClass('value-number-not-match');
            });
            var messageInvalidTranIds = '';
            if ($('.value-number-invalid').length > 0) {
                messageInvalidTranIds += messages.hightlightInvalidBetId;
            }

            if ($('.value-number-move-bet').length > 0) {
                messageInvalidTranIds += messageInvalidTranIds.length > 0 ? '<br>' + messages.hightlightMoveTicket : messages.hightlightMoveTicket;
            }

            if (messageInvalidTranIds.length > 0) {
                $('#msg').html(tooltip.show('errorBetId', messageInvalidTranIds)).show();
                return false;
            }

            $('.value-number').each(function () {
                if (!NapTicketControl.Helper.isNumber($(this).text())) {
                    $('#msg').html(tooltip.show('errorBetId', 'Bet ID is number only.')).show();
                    return false;
                }

                if ($(this).text().length > 19) {
                    $('#txtTransId').removeClass("text-number");
                    $('#txtTransId').addClass("text-number-invalid");
                    return false;
                }
            });

            if (!NapTicketControl.Helper.isNumber($('#txtTransId').val()) && $('#txtTransId').val().length > 0) {
                $('#msg').html(tooltip.show('errorBetId', 'Bet ID is number only.')).show();
                return false;
            }

            if ($('#txtTransId').val().length > 19) {
                $('#txtTransId').removeClass("text-number");
                $('#txtTransId').addClass("text-number-invalid");
                return false;
            }

            return true;
        },

        checkVoidBetPermission: function (params, searchElement, voidBet) {
            $.ajax({
                type: "POST",
                url: window.rootUrl + "api/Permission/CheckTicketsStatusJqueryPage",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                data: JSON.stringify(params),
                success: function (result) {
                    if (result.ErrCode > 0) {
                        NapTicketControl.Helper.showPopupMessageWithButton(result, searchElement);
                        NapTicketControl.enableInput();
                    } else {
                        voidBet();
                    }
                },
                complete: function () {
                }
            });
        },

        removeValidateVoidByBetId: function () {
            $('.value-number').each(function () {
                $(this).removeClass('value-number-invalid');
                $(this).removeClass('value-number-move-bet');
                $(this).removeClass('value-number-not-match');
            });
        },

        showToolTip: function (id, arrMsg, isRight) {
            var html = '';

            var obj = $('#' + id).offset();

            html += '<div class="txtNameformError parentFormdata formError" style="opacity: 0.87; position: absolute;';
            html += 'top: ' + (obj.top + 20) + 'px; left: ' + obj.left + 'px; margin-top: 0px;">';
            html += '<div class="formErrorMoveBetArrow formErrorMoveBetArrowBottom ">';
            html += '<div class="line1"></div>';
            html += '<div class="line2"></div>';
            html += '<div class="line3"></div>';
            html += '<div class="line4"></div>';
            html += '<div class="line5"></div>';
            html += '<div class="line6"></div>';
            html += '<div class="line7"></div>';
            html += '<div class="line8"></div>';
            html += '<div class="line9"></div>';
            html += '<div class="line10"></div>';
            html += '</div>';
            html += '<div class="formErrorMoveBetContent">' + arrMsg;
            html += '</div>';
            html += '</div>';

            if (isRight === true) {
                setTimeout(function () {
                    var width = $('.formErrorMoveBetContent').width();
                    var left = parseInt($('.formError').css('left'), 10);
                    $('.formError').css('left', left - width + 'px');
                    $('.formError .formErrorArrowMoveBetBottom').css('margin-left', width - 12 + 'px');
                    $(window).scrollTop($('.formError').offset().top - 50);
                }, 100);
            } else {
                setTimeout(function () {
                    $(window).scrollTop($('.formError').offset().top - 50);
                }, 100);
            }

            return html;
        },

        isNumber: function (e) {
            var number = /^\+?(0|[1-9]\d*)$/.test(e);
            if (!number) {
                return false;
            }

            return true;
        },

        showInvalidTransIds: function (invalidTransIds) {
            $('.value-number').each(function () {
                for (var index = 0; index < invalidTransIds.length; index++) {
                    if (invalidTransIds[index].IsMoved) {
                        if (invalidTransIds[index].InvalidTrans.toString() === $(this).text()) {
                            $(this).removeClass("value-number");
                            $(this).addClass("value-number-move-bet");
                            break;
                        }
                    }
                    else {
                        if (invalidTransIds[index].InvalidTrans.toString() === $(this).text()) {
                            $(this).removeClass("value-number");
                            $(this).addClass("value-number-invalid");
                            break;
                        }
                    }
                }
            });
        },

        checkMessageShouldBeReplaceText: function (result) {
            for (var i = 0; i < result.length; i++) {
                if (ERROR_CODE_SHOULD_BE_REPLACE_MESSAGE.includes(result[i].ErrorCode)) {
                    result[i].ErrorMsg = `Some tickets cannot be voided because: ${result[i].ErrorMsg}`
                }
            }
        },

        showPopupMessageDetail: function (result) {
            var html = [];
            var width = 800;
            var index = 0;
            var ERROR_CODE_SHOULD_BE_REPLACE_MESSAGE = [1000000, 101, 100, 103, 102]
            for (var i = 0; i < result.length; i++) {
                var message = result[i];
                index++;

                if (ERROR_CODE_SHOULD_BE_REPLACE_MESSAGE.includes(message.ErrorCode)) {
                    result[i].ErrorMsg = `Some tickets cannot be processed because: ${message.ErrorMsg}`
                }

                NapTicketControl.Helper.addMessage(message, html);

                if (message.ErrorCode === -9999) {
                    html.push('<label style="margin-top: 10px; margin-bottom: 10px;">For more details:</lable>');
                }

                if (message.ErrorCode === -9998) {
                    console.log(message.ErrorMsg);
                    index--;
                }
            }

            if (index <= 3) {
                width = 600;
                for (var j = 0; j < html.length; j++) {
                    html[j] = html[j].replace('span20', 'span15');
                }
            }

            $("#show-message").empty();
            $("#show-message").append(html);
            $("#show-message").dialog({
                dialogClass: "no-close",
                resizable: false,
                width: width,
                autoResize: true,
                position: [($(window).width() - width) / 2, 240]
            });
        },

        addMessage: function (message, html) {
            if (message.ErrorMsg !== "" && message.ErrorMsg !== null && message.ErrorCode >= 0) {
                if (message.ErrorCode > 0) {
                    html.push('<div class="msg-fail row" style="max-height:150px;overflow:auto;">&nbsp;<div class="icon-warning-sign"></div>&nbsp;<div id="message-content" class="span20"><span>' +
                        message.ErrorMsg + '</span></div></div>');
                } else {
                    html.push('<div class="msg-success row">&nbsp;<div class="icon-ok"></div>&nbsp;<div id="message-content" class="span20"><span>' +
                        message.ErrorMsg + '</span></div></div>');
                }
            }
        },

        addPlainMessage: function (message, html) {
            if (message.ErrMsg !== "" && message.ErrMsg !== null && message.ErrCode >= 0) {
                if (message.ErrCode > 0) {
                    html.push('<div class="plain-msg-fail row" style="max-height:150px;overflow:auto;"><div id="message-content"><span>' +
                        message.ErrMsg + '</span></div></div>');
                } else {
                    html.push('<div class="plain-msg-success row"><div id="message-content"><span>' +
                        message.ErrMsg + '</span></div></div>');
                }
            }
        },

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
                    NapTicketControl.Helper.copyToClipboardFF($("#copy-clipboard-value").val());
                }
                if (success) {
                    alert(messages.infoCopyClipboard);
                    tmpElem.remove();
                }
            }
        },

        copyToClipboardFF: function (text) {
            window.prompt(messages.pressCtrlC, text);
        },

        createGUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    };
}(jQuery));