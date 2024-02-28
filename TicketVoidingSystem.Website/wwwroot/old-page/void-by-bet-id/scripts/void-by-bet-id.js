/* File Created: February 5, 2013 */
/*global NapTicketControl, tooltip, Message*/

"use strict";

var VoidByBetId = {
    MaxInt: 2147483647,
    MaxTransIdPerBatch: 2000,
    userBetTrade: [],

    storageParams: {
        TotalItem: "0",
        StatusIds: ""
    },

    isValidMatchAndTranIds: true,
    checkSettled: false,
    matchInfo: {},
    issueType: {},
    subIssueTypes: {},
    messageTemplate: {},
    templateSettings: {},
    templatesList: {},
    messageTemplateData: {},
    commonTemplateValue: {},
    voidFromTime: "",
    voidToTime: "",
    voidFromDate: "",
    voidToDate: "",
    tickets: [],
    matchId: "0",

    search: function () {
        VoidByBetId.matchInfo = {};
        NapTicketControl.Helper.removeValidateVoidByBetId();
        VoidByBetId.isValidMatchAndTranIds = true;
        VoidByBetId.resetData();
        if (!VoidByBetId.checkParamBeforeGetTicket()) {
            return;
        }

        var params = VoidByBetId.getParams();
        if (params) {
            VoidByBetId.getTicket(params);
        }
    },

    getParams: function () {
        var params = {};
        if (VoidByBetId.isFilterByBetId()) {
            params.TransIds = VoidByBetId.getBetIds();
            params.includeMainParlay = $('#ckbox-include-parlay').is(':checked');
            params.isAbnormalBet = $('#ckbox-abnormal-bet').is(':checked');
        }
        else if (VoidByBetId.isFilterByUserName()) {
            var username = $('#txt-username').val();
            VoidByBetId.checkUsername(username);
            if (VoidByBetId.storageParams.CustomerIds === "0") {
                $('#msg').html(tooltip.show('txt-username', 'Invalid Username.')).show();
                return;
            }

            if ($("#to-date").val() != '' && isNaN(Date.parse($("#to-date").val()))) {
                $('#msg').html(tooltip.show('to-date', 'To time must be format mm/dd/yyyy')).show();
                return;
            }
            else if ($("#from-date").val() != '' && $("#to-date").val() != '' && !VoidByBetId.isFromDateBefore()) {
                $('#msg').html(tooltip.show('from-date', 'From date must be before To date.')).show();
                return;
            }

            VoidByBetId.storageParams.FromDate = $('#from-date').val();
            VoidByBetId.storageParams.ToDate = $('#to-date').val();

            params.CustID = VoidByBetId.storageParams.CustomerIds;
            params.FromDate = VoidByBetId.storageParams.FromDate;
            params.ToDate = VoidByBetId.storageParams.ToDate;
            params.Products = $('#product-select').val().join(',');
            params.StatusIds = $('#ticket-status-select').val().join(',');
        }

        return params;
    },

    getBetIds: function () {
        var result = "";
        var betId = $('#txtTransId').val();

        $('.value-number').each(function () {
            var transId = $(this).text();
            result += result.length === 0 ? transId : "," + transId;
        });

        if (betId.length > 0) {
            result += result.length === 0 ? betId : "," + betId;
        }

        return result;
    },

    getTicket: function (params) {
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/VoidByBetId/GetTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                if (VoidByBetId.isFilterByBetId()) {
                    VoidByBetId.showInvalidTransIds(rs.InvalidTransIds, 'value-number-invalid');
                    VoidByBetId.showInvalidTransIds(rs.MovedTransIds, 'value-number-move-bet');
                    NapTicketControl.Helper.checkValidateIsMoveTicketWithVoidByBetId();
                }
                ContextMenu.Helper.groups = rs.Groups;
                VoidByBetId.storageParams.TotalItem = rs.TotalItem;
                VoidByBetId.storageParams.StatusIds = params.StatusIds;
                VoidByBetId.tickets = rs.Tickets;
                VoidByBetId.voidFromTime = rs.FromTime;
                VoidByBetId.voidToTime = rs.ToTime;
                VoidByBetId.voidFromDate = rs.FromDate;
                VoidByBetId.voidToDate = rs.ToDate;
                NapTicketControl.Helper.displayContent(true);
                VoidByBetId.loadTicket(rs);
                VoidByBetId.matchId = rs.MatchId

                if (rs.LicenseesName.length > 0) {
                    $('#affected-licensees').show();
                    $('#affected-licensees-highlight').text(rs.LicenseesName);
                }

                if (rs.MatchId > 0) {
                    VoidByBetId.getMatch({ matchId: rs.MatchId, isAbnormalBet: params.isAbnormalBet});
                } else {
                    $('#matchInfo').hide();
                    VoidByBetId.loadMessageTemplate();
                }

                if (!params.isAbnormalBet) {
                    $("#fsAbnormalBetReason").hide();
                }
                if (VoidByBetId.TotalItem !== "0" && VoidByBetId.isFilterByUserName()) {
                    NapTicketControl.Helper.updateInputContent("#reason", 'Abnormal bet');
                    NapTicketControl.Helper.updateInputContent("#reasonSC", '非正常投注');
                }
            },
            error: function () { },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }
                NapTicketControl.enableInput();
                VoidByBetId.checkCanShowRemoveInvalid();
            }
        });
    },

    getMatch: function (params) {
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/MatchInfo/GetInfo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (match) {
                if (match !== null) {
                    VoidByBetId.matchInfo = match;
                    if (params.isAbnormalBet) {
                        VoidByBetId.loadMatchInfo(match);
                        VoidByBetId.loadMessageTemplate();
                    }
                }
            },
            error: function () { },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }
                NapTicketControl.enableInput();
            }
        });
    },

    getMessageTemplate: function () {
        $.ajax({
            type: "GET",
            url: window.rootUrl + "api/MessageTemplate/GetTemplateAbnormalBet",
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (data) {
                if (data !== null) {
                    VoidByBetId.issueType = data.issueType;
                    VoidByBetId.subIssueTypes = data.subIssueTypes.filter(x => x.subIssueTypeId !== 27);
                    VoidByBetId.getAbnormalBetReason();
                    VoidByBetId.templateSettings = data.templateSettings;
                    VoidByBetId.templatesList = data.templates;
                    VoidByBetId.getTemplateFromSubIssueType(parseInt(NapTicketControl.Helper.issueTypeAbnormalBet));
                }
            },
            error: function () { },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }
                NapTicketControl.enableInput();
            }
        });
    },

    getTemplateFromSubIssueType: function (value) {
        var templateSetting = VoidByBetId.templateSettings.filter(function (item) {
            return item.subIssueTypeId === value;
        });
        VoidByBetId.messageTemplate = VoidByBetId.templatesList.filter(function (item) {
            return item.templateId === templateSetting[0].templateId;
        })[0];
    },

    getAbnormalBetReason: function () {
        var ddlAbnormalBet = $('#ddl-abnormal-reason');
        $.each(VoidByBetId.subIssueTypes, function (index, item) {
            ddlAbnormalBet.append(
                $('<option></option>').val(item.subIssueTypeId).html(item.subIssueTypeName)
            );
        });

        $("#ddl-abnormal-reason").val(NapTicketControl.Helper.issueTypeAbnormalBet);
    },

    showInvalidTransIds: function (invalidTransIds, highlight) {
        var list = invalidTransIds.split(',');
        $('.value-number').each(function () {
            for (var i = 0; i < list.length; i++) {
                if (list[i].trim('') === $(this).text().trim('')) {
                    $(this).addClass(highlight);
                    break;
                }
            }
        });
    },

    loadMatchInfo: function (matchInfo) {
        NapTicketControl.Helper.displayContent(true);
        var eventDate = new Date(matchInfo.eventDate);
        eventDate = dateFormat(eventDate, "mm/dd/yyyy");
        var rows = [];
        rows.push({
            Columns: [{ Name: "code", Value: matchInfo.matchCode, CssClass: 'bold' },
            { Name: "matchEvent", Value: matchInfo.matchEvent, CssClass: 'bold' },
            { Name: "eventDate", Value: eventDate, CssClass: 'bold' }
            ]
        });

        var gridOptions = {
            columns: [
                { HeaderText: "Code", Name: "code", Width: 100, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Match Event", Name: "matchEvent", Width: 300, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Event Date", Name: "eventDate", Width: 100, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' }
            ],
            bodyRows: rows,
            hideYBackGroundScroller: true
        };

        $('#matchInfo').fanexGrid(gridOptions);
    },

    loadMessageTemplate: function () {
        VoidByBetId.getTemplateFromSubIssueType(parseInt($('#ddl-abnormal-reason').val()));
        if (($('#ckbox-abnormal-bet').is(':checked') || VoidByBetId.isFilterByUserName()) && VoidByBetId.TotalItem != "0") {
            if (VoidByBetId.matchId == "0") {
                const n = 37;
                VoidByBetId.messageTemplate = VoidByBetId.templatesList.find(t => t.templateId === n);
                VoidByBetId.generateStatementForMessage()
            }
            else {
                VoidByBetId.generateMessageTemplateValue(VoidByBetId.matchInfo);
            }
            VoidByBetId.replaceValueForMessageTemplate();
            NapTicketControl.Helper.updateInputContent("#msg-en", VoidByBetId.messageTemplateData.msgEnglish);
            NapTicketControl.Helper.updateInputContent("#msg-ch", VoidByBetId.messageTemplateData.msgChineseTraditional);
            NapTicketControl.Helper.updateInputContent("#msg-cs", VoidByBetId.messageTemplateData.msgChineseSimplified);
            NapTicketControl.Helper.updateInputContent("#msg-zhcn", VoidByBetId.messageTemplateData.msgChineseNewSimplified)
        }
    },

    resetContent: function () {
        $("#ticketInfo-grid-title").remove();
        var ticketInfoElement = document.getElementById('ticketInfo');
        ticketInfoElement.innerHTML = '';
        $("#reason").innerHTML = '';
        $("#reasonSC").innerHTML = '';
    },

    loadTicket: function (result) {
        VoidByBetId.resetContent();
        var length = result.Groups.length;
        if (length > 0) {
            Message.Helper.displayFormMsg(true);
            Message.Helper.clearMsgContent();
        } else {
            Message.Helper.displayFormMsg(false);
        }

        if (VoidByBetId.isDisplayBetList(result.TotalItem)) {
            var gridOptions = {
                titleInfo: {
                    text: "Void Time: " + result.FromTime + " - " + result.ToTime + " (Single Count: " + result.SingleCount +
                        ", Parlay Count: " + result.ParlayCount + ")",
                    showExcelButton: true,
                    exportExcelFunction: function () {
                        VoidByBetId.exportExcel();
                    }
                },
                showTitle: true,
                columns: [
                    {
                        HeaderText: ContextMenu.Helper.RenderCheckBoxAll(length), Name: "CustomAdd", Width: 50, HeaderAlign: "center", CellAlign: "center",
                        CustomCellRender: VoidByBetId.checkBoxItemRender, CssClass: 'bold'
                    },
                    { HeaderText: "No", Name: "No", Width: 30, HeaderAlign: "center", CellAlign: "center", ShowCollapseExpand: true, CssClass: 'bold' },
                    { HeaderText: "BetID", Name: "BetId", Width: 140, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                    { HeaderText: "Member", Name: "Player", Width: 180, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                    { HeaderText: "Date", Name: "TransDate", Width: 130, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                    { HeaderText: "Choice", Name: "Choice", Width: 370, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' },
                    { HeaderText: "Odds", Name: "Odds", Width: 80, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' },
                    { HeaderText: "Stake", Name: "Stake", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.00", CssClass: 'bold' },
                    { HeaderText: "Win Loss", Name: "WinLost", Width: 100, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' },
                    { HeaderText: "Status", Name: "Status", Width: 80, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' }
                ],

                bodyRows: VoidByBetId.generateGroupData(result.Groups),
                showTree: true,
                hideYBackGroundScroller: true,
                fullHeight: false,
                gridHeight: 600,
                marginRight: 0
            };

            $('#ticketInfo').fanexGrid(gridOptions);
            NapTicketControl.Helper.initCheckBoxGroup(result.Groups);
            ContextMenu.Helper.InitContextMenu(ContextMenu.Helper.showContextMenu);
            if (result.TotalItem === 0) {
                $('#ticketInfo-grid-title').hide();
            }
            else {
                $('#ticketInfo-grid-title').show();
            }
        }
        else {
            var ticketInfoElement = document.getElementById('ticketInfo');
            $("#ticketInfo").css("height", "25px");
            ticketInfoElement.innerHTML = '<div id="ticketInfo-grid-title" class="grid-title" style="width:1294px">'
                + '<div class="grid-title-label" id="reporttile">Void Time: ' + result.FromTime + ' - ' + result.ToTime + ' (Single Count: ' + result.SingleCount + ', Parlay Count: ' + result.ParlayCount + ')</div>'
                + '<div style="float:right"><span style="color:#A2D767;float:left;padding-top:5px;font-weight:bold;">Data collected exceeds the web site rendering capability. Please export and view data in Excel file. Thank you!</span>'
                + '<div class="grid-toolbox"><input type="button" id="btnExportExcelTicket" class="btnExcel" title="Export to Excel"></div></div></div>';
            $("#ticketInfo").parents().show()
            $("#fsMessage").hide();
        }
    },

    isDisplayBetList: function (totalItem) {
        if (totalItem > VoidByBetId.MaxTransIdPerBatch && VoidByBetId.isFilterByUserName()) {
            return false;
        }

        return true;
    },

    replaceTemplateValueWithLanguage: function (message, language, destination, value) {
        switch (language) {
            case 'msgEnglish':
                message = message.replace(destination, VoidByBetId.commonTemplateValue[value].msgEnglish);
                break;
            case 'msgChineseTraditional':
                message = message.replace(destination, VoidByBetId.commonTemplateValue[value].msgChineseTraditional);
                break;
            case 'msgChineseSimplified':
                message = message.replace(destination, VoidByBetId.commonTemplateValue[value].msgChineseSimplified);
                break;
            case 'msgChineseNewSimplified':
                message = message.replace(destination, VoidByBetId.commonTemplateValue[value].msgChineseNewSimplified);
                break;
        }
        return message;
    },

    replaceValueForMessageTemplate: function () {
        VoidByBetId.messageTemplateData = {};
        VoidByBetId.checkSettledTickets();
        $.each(VoidByBetId.messageTemplate, function (index, value) {
            if (index !== 'jsonValue' && index !== 'templateId') {
                if (VoidByBetId.matchId != "0") {
                    value = VoidByBetId.replaceTemplateValueWithLanguage(value, index, '{{Home team name}}', 'homeTeamName');
                    value = VoidByBetId.replaceTemplateValueWithLanguage(value, index, '{{Away team name}}', 'awayTeamName');
                    value = VoidByBetId.replaceTemplateValueWithLanguage(value, index, '{{League name}}', 'leagueName');
                    var eventDate = new Date(VoidByBetId.matchInfo.kickOffTime);
                    eventDate = dateFormat(eventDate, "d/m");
                    value = value.replace('{{Event Date}}', eventDate);
                    value = VoidByBetId.replaceTemplateValueWithLanguage(value, index, '{{Sport type}}', 'sportType');
                }
                value = VoidByBetId.checkSettled ? VoidByBetId.replaceTemplateValueWithLanguage(value, index, '{{CheckStatement}}', 'checkStatement') : value.replace('{{CheckStatement}}', '');
                value = value.replace('{{Parlay}}', '');

                VoidByBetId.messageTemplateData[index] = value;
            }
        });
    },

    generateMessageTemplateValue: function (match) {
        VoidByBetId.commonTemplateValue = {
            sportType: {
                msgEnglish: match.sportTypeName,
                msgChineseTraditional: match.sportTypeNameTraditional,
                msgChineseSimplified: match.sportTypeNameSimplified,
                msgChineseNewSimplified: match.sportTypeNameNewSimplified
            },
            homeTeamName: {
                msgEnglish: match.homeName,
                msgChineseTraditional: match.homeNameTraditional,
                msgChineseSimplified: match.homeNameSimplified,
                msgChineseNewSimplified: match.homeNameNewSimplified
            },
            awayTeamName: {
                msgEnglish: match.awayName,
                msgChineseTraditional: match.awayNameTraditional,
                msgChineseSimplified: match.awayNameSimplified,
                msgChineseNewSimplified: match.awayNameNewSimplified
            },
            leagueName: {
                msgEnglish: match.leagueName,
                msgChineseTraditional: match.leagueNameTraditional,
                msgChineseSimplified: match.leagueNameSimplified,
                msgChineseNewSimplified: match.leagueNameNewSimplified
            }
        };
        VoidByBetId.generateStatementForMessage();
    },

    generateStatementForMessage: function () {
        VoidByBetId.commonTemplateValue.checkStatement = {
            msgEnglish: NapTicketControl.Helper.checkStatement.msgEnglish,
            msgChineseTraditional: NapTicketControl.Helper.checkStatement.msgChineseTraditional,
            msgChineseSimplified: NapTicketControl.Helper.checkStatement.msgChineseSimplified,
            msgChineseNewSimplified: NapTicketControl.Helper.checkStatement.msgChineseNewSimplified
        }
    },

    generateGroupData: function (groups) {
        var rows = [];
        for (var index = 0; index < groups.length; index++) {
            var group = groups[index];
            var groupName = group.Name.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
            rows.push(
                {
                    Columns: [
                        { Name: "CustomAdd", Value: "", CssClass: groupName + " group-" + groupName + " checkBoxItem" },
                        { Name: "No", Value: group.Name, MergeColNumber: 14, CellAlign: "left" }
                    ],
                    SubRows: VoidByBetId.generateTicketData(group.Tickets, groupName)
                }
            );
        }

        return rows;
    },

    generateTicketData: function (tickets, groupName) {
        var rows = [];

        VoidByBetId.userBetTrade = [];
        for (var index = 0; index < tickets.length; index++) {
            var currentRow = tickets[index];
            var className = groupName;
            var classBorder = currentRow.IsMarked ? "betIdBorder" : "";
            if (currentRow.Player.toLowerCase().indexOf('bettrade') !== -1) {
                VoidByBetId.userBetTrade.push(currentRow.BetId.toString());
            }

            className = currentRow.IsCricket ? className + ' netposition' : className;
            rows.push({
                Columns: [
                    {
                        Name: "CustomAdd", Value: currentRow.Value,
                        Status: currentRow.Status, BetType: currentRow.BetType,
                        CssClass: currentRow.Status.toLowerCase().indexOf("sold") !== -1 ? "sold " + className : className + " checkBoxItem",
                        IsDisable: currentRow.IsDisable, MainTransId: currentRow.MainTransId
                    },
                    { Name: "No", Value: currentRow.No, CssClass: "NoColumn" },
                    { Name: "BetId", Value: currentRow.BetId, CssClass: classBorder },
                    { Name: "Player", Value: currentRow.Player },
                    { Name: "TransDate", Value: currentRow.TransDate },
                    { Name: "Choice", Value: currentRow.Choice },
                    { Name: "Odds", Value: currentRow.Odds },
                    { Name: "Stake", Value: currentRow.Stake },
                    { Name: "WinLost", Value: currentRow.WinLost },
                    { Name: "Status", Value: currentRow.Status }
                ]
            });
        }

        return rows;
    },

    checkBoxItemRender: function (cell) {
        var disabled = cell.IsDisable ? "disabled" : "";

        var checkBoxItem = "<input class='chk-ticket-all chk-ticket-" + cell.CssClass + "' value='" + cell.Value +
            "' type='checkbox' main-trans-id='" + cell.MainTransId + "'" + disabled;
        var isNotGroupSpecial = parseInt(cell.CssClass.indexOf(ContextMenu.Helper.groupBetFair)) === -1 &&
            parseInt(cell.CssClass.indexOf(ContextMenu.Helper.groupParlay)) === -1 &&
            parseInt(cell.CssClass.indexOf(ContextMenu.Helper.groupPhoneBetting)) === -1;

        checkBoxItem += VoidByBetId.isFilterByUserName() ? " checked='checked'>" : isNotGroupSpecial && !cell.IsDisable ? " checked='checked'>" : ">";

        return checkBoxItem;
    },

    exportExcel: function () {
        var params = VoidByBetId.getParams();
        var totalItems = VoidByBetId.storageParams.TotalItem;
        var maxItemsSupport = $('#max-ticket-export').val();
        if (parseInt(totalItems) > parseInt(maxItemsSupport)) {
            NapTicketControl.MessageNotAllowExportExcel();
            return;
        }
        var url = window.rootUrl + "api/VoidByBetId/ExportExcel";

        NapTicketControl.xhrDownloadFile(url, params);
    },

    VoidBet: function () {
        var transIds = VoidByBetId.isDisplayBetList(VoidByBetId.storageParams.TotalItem) ? VoidByBetId.getTransIdsOnDisplayedBetList() : VoidByBetId.getTransIdsOnHideBetList();
        var transIdList = transIds.split(',');
        var transIdCrickets = NapTicketControl.Helper.getSubTicketsChecked("netposition");
        var transIdCricketList = transIdCrickets.split(',');

        var param = {
            Tickets: VoidByBetId.tickets.filter(x => transIdList.includes(x.TransId.toString())),
            IsFilterByBetId: VoidByBetId.isFilterByBetId(),
            VoidFromTime: VoidByBetId.voidFromTime,
            VoidToTime: VoidByBetId.voidToTime,
            VoidFromDate: VoidByBetId.voidFromDate,
            VoidToDate: VoidByBetId.voidToDate,
            TransIdCrickets: VoidByBetId.tickets.filter(x => transIdCricketList.includes(x.TransId.toString())),
            Password: CryptoJS.CfsEnCode($('#password').val()),
            UserName: $('#username').val(),
            NegativeBalanceUsers: VoidByBetId.storageParams.UsersNegativeCredit,
            Reason: $('#reason').val(),
            ReasonSC: $('#reasonSC').val(),
            Message: {
                ContentEnglish: $('#msg-en').val(),
                ContentChineseTraditional: $('#msg-ch').val(),
                ContentChineseSimplified: $('#msg-cs').val(),
                ContentNewChineseSimplified: $('#msg-zhcn').val(),
                ContentThai: $('#msg-th').val(),
                ContentKorean: $('#msg-ko').val(),
                ContentJapanese: $('#msg-jp').val(),
                ContentItalian: $('#msg-it').val(),
                ContentSpanish: $('#msg-es').val()
            },
            guid: `VoidByBetId-${NapTicketControl.Helper.createGUID()}`
        };

        if (VoidByBetId.isFilterByUserName()) {
            param.FilterUserName = $('#txt-username').val();
            param.Products = $('#product-select').val().join(',');
            param.StatusIds = $('#ticket-status-select').val().join(',');
            param.FromDate = $("#from-date").val();
            param.ToDate = $("#to-date").val();
        }

        if (VoidByBetId.matchId != "0") {
            param.Match = VoidByBetId.matchInfo;
        }
        else {
            param.Match = null;
        }

        param.isAbnormalBet = $('#ckbox-abnormal-bet').is(':checked');

        if ($("#fsAbnormalBetReason").is(':visible')) {
            param.IssueTypeId = VoidByBetId.issueType.issueTypeId.toString();
            param.SubIssueTypeId = $("#ddl-abnormal-reason").val();
            param.SubIssueTypeName = VoidByBetId.subIssueTypes.find(x => x.subIssueTypeId.toString() === param.SubIssueTypeId).subIssueTypeName;
            param.SubIssueTypeNameCS = VoidByBetId.subIssueTypes.find(x => x.subIssueTypeId.toString() === param.SubIssueTypeId).subIssueTypeNameCS;
        }

        var results = null;
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/VoidByBetId/VoidBet",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                results = rs;
            },
            error: function () {
                results = null;
            },
            complete: function () {
                if (results) {
                    VoidByBetId.handleAfterVoid(results);
                } else {
                    VoidByBetId.getVoidResultCache(param.guid);
                }
            }
        });
    },

    getVoidResultCache: function (guid) {
        var isChecking = false;
        var interval = setInterval(() => {
            if (!isChecking) {
                isChecking = true;

                $.ajax({
                    type: "POST",
                    url: window.rootUrl + "api/SharedApi/GetVoidResultCache",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify({ guid: guid }),
                    success: function (results) {
                        if (results && results.length > 0) {
                            var pascalResults = results.map(x => ({ ErrorCode: x.errorCode, ErrorMsg: x.errorMsg, IsSuccessful: x.isSuccessful }));

                            VoidByBetId.handleAfterVoid(pascalResults);
                            clearInterval(interval);
                        }
                        isChecking = false;
                    }
                });
            }
        }, 2000);
    },

    handleAfterVoid: function (result) {
        var ERROR_CODE_MOVE_BET_PROCESS = 112;

        if (result !== null && result.every(x => x.ErrorCode > 0)) {
            result[0].ErrorCode === ERROR_CODE_MOVE_BET_PROCESS ? NapTicketControl.Helper.displayContent(false) : NapTicketControl.Helper.displayContent(true);
        }
        else {
            VoidByBetId.resetInput();
        }

        NapTicketControl.Helper.showPopupMessageDetail(result);
        if (VoidByBetId.isFilterByUserName()) {
            VoidByBetId.setupCalendar();
        }

        NapTicketControl.enableInput();
        $('#affected-licensees').hide();
    },

    getBalanceUp: function () {
        $.ajax({
            type: "GET",
            url: window.rootUrl + "api/SharedApi/GetBalanceUp",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (result) {
                VoidByBetId.storageParams.BalanceUp = result;
            }
        });
    },

    checkUsername: function (username) {
        var param = {
            Username: username
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/VoidByBetId/CheckUsername",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: JSON.stringify(param),
            success: function (result) {
                VoidByBetId.storageParams.CustomerIds = result;
            }
        });
    },

    isFromDateBefore: function () {
        var fromDate = $("#from-date").val();
        var toDate = $("#to-date").val() !== null ? $("#to-date").val() : $("#from-date").val();

        return Date.parse(fromDate) <= Date.parse(toDate);
    },

    checkParamBeforeVoidTicket: function () {
        $('#msg').hide();

        if (VoidByBetId.isDisplayBetList(VoidByBetId.storageParams.TotalItem) && NapTicketControl.Helper.getSubTicketsChecked("checkBoxItem") === '') {
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

    checkParamBeforeGetTicket: function () {
        if (VoidByBetId.isFilterByBetId()) {
            if (VoidByBetId.getBetIds() === '') {
                $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
                return false;
            }
        }
        else if ($('#label-tab-by-username').hasClass('active')) {
            if ($('#txt-username').val().toString() === '') {
                $('#msg').html(tooltip.show('txt-username', messages.userNameRequired)).show();
                return false;
            }

            if ($('#product-select').val() === null) {
                $('#msg').html(tooltip.show('product-select', 'At least one must be selected')).show();
                return false;
            }

            if ($('#ticket-status-select').val() === null) {
                $('#msg').html(tooltip.show('ticket-status-select', 'At least one must be selected')).show();
                return false;
            }
        }

        return true;
    },

    getTransIdsOnDisplayedBetList: function () {
        var transIds = $('.checkBoxItem:checkbox:enabled:checked').not('#chk-ticket-all').map(function () {
            if (!isNaN(parseFloat(this.value))) {
                return this.value;
            }
        }).get();

        if (VoidByBetId.userBetTrade.length > 0) {
            transIds = transIds.filter(function (x) { return $.inArray(x, VoidByBetId.userBetTrade) < 0; });
        }

        transIds = transIds.length > 0 ? transIds.join(',') + ',' + NapTicketControl.Helper.getTicketsBetTradeChecked(".chk-ticket-sold")
            : NapTicketControl.Helper.getTicketsBetTradeChecked(".chk-ticket-sold");

        return transIds;
    },

    getTransIdsOnHideBetList: function () {
        var transIds = '';
        $(ContextMenu.Helper.groups).each(function () {
            transIds = transIds + ',' + this.Tickets.map(y => y.BetId).join(',');
        });

        return transIds;
    },

    checkNegativeBetCredit: function () {
        if (!VoidByBetId.checkParamBeforeVoidTicket()) {
            return;
        }

        var transIds = VoidByBetId.isDisplayBetList(VoidByBetId.storageParams.TotalItem) ? VoidByBetId.getTransIdsOnDisplayedBetList() : VoidByBetId.getTransIdsOnHideBetList();
        var transIdList = transIds.split(',');
        var param =
        {
            TransIds: transIds,
            ExcludeRunning: false,
            Type: false
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/SharedApi/CheckNegativeBalance",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (result) {
                var confirmationMessage = '';
                if (result.length > 0) {
                    var username = $.trim(result[0].userName);
                    for (var index = 1; index < result.length; index++) {
                        username += ', ' + result[index].userName;
                    }
                    VoidByBetId.storageParams.UsersNegativeCredit = username;
                    confirmationMessage = messages.confirmNegativeCustomer +
                        username + '\n ' + messages.confirmVoidTicket;
                }
                else {
                    confirmationMessage = messages.confirmVoidTicket;
                    VoidByBetId.storageParams.UsersNegativeCredit = '';
                }

                if (confirm(confirmationMessage)) {
                    var params = {
                        tickets: VoidByBetId.tickets,
                        isCashOutAsUnSettledTicket: false,
                        apikey: "void-by-bet-id-check-void-bet-permission"
                    };
                    NapTicketControl.Helper.checkVoidBetPermission(params, $(".btn-search"), function () {
                        VoidByBetId.VoidBet();
                    });
                }
                else {
                    NapTicketControl.enableInput();
                }
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }
            }
        });
    },

    checkSettledTickets: function () {
        if (VoidByBetId.isFilterByBetId()) {
            var statusCheckedTransIds = $('.chk-ticket-all:checkbox:enabled:checked').not('#chk-ticket-all').parents('tr').find('td.free-grid-td-9').map(function () {
                return this.innerText;
            }).get().join(',');
            VoidByBetId.checkSettled = NapTicketControl.Helper.isSettledTicket(statusCheckedTransIds);
        } else {
            VoidByBetId.checkSettled = VoidByBetId.isHasSettledTickets(VoidByBetId.storageParams.StatusIds);
        }
    },

    resetInput: function () {
        NapTicketControl.Helper.displayContent(false);
        NapTicketControl.Helper.ResetReason();
        Message.Helper.clearMsgContent();
        $('#password').val('');
        VoidByBetId.intByBetId();
    },

    setupCalendar: function (txtDate) {
        VoidByBetId.intDateTime();
        $(txtDate).datepicker({
            dateFormat: 'M dd, yy'
        });

        $('.icon-from-transdate-calendar').click(function () {
            $('#from-date').datetimepicker("show");
        });

        $('.icon-to-transdate-calendar').click(function () {
            $('#to-date').datetimepicker("show");
        });
    },

    checkCanShowRemoveInvalid: function () {
        if ($('div.item-number:has(span.value-number-invalid)').length > 0) {
            $(".btn-remove-invalid").show();
        } else {
            $(".btn-remove-invalid").hide();
        }
    },

    intDateTime: function () {
        var params = {};

        $("form input[type=hidden]").each(function () {
            params[this.id] = this.value === "" ? null : this.value;
        });

        $.extend(VoidByBetId.storageParams, params);

        $('#from-date').val($.datepicker.formatDate("M dd, yy", new Date()));
        $('#to-date').val($.datepicker.formatDate("M dd, yy", new Date()));

        var minDate = $("#from-date").datepicker("option", "minDate");
        var minDateValue = new Date(VoidByBetId.storageParams.BalanceUp.moveBetsDay);
        minDateValue.setDate(minDateValue.getDate() + 1);
        $("#from-date").datepicker("option", "minDate", minDateValue);
    },

    intByUsername: function () {
        $("#number-group").removeClass('number-group');
        $("#number-group").addClass('number-group-disabled');
        $('#txtTransId').focus();
        $('.item-number').remove();
    },

    intByBetId: function () {
        VoidByBetId.getTemplateFromSubIssueType(parseInt(NapTicketControl.Helper.issueTypeAbnormalBet));
        if ($('#ckbox-include-parlay').is(':checked') === false) {
            $('#ckbox-abnormal-bet').removeAttr('disabled');
        }
        if ($('#ckbox-abnormal-bet').is(':checked') === false) {
            $('#ckbox-include-parlay').removeAttr('disabled');
        }
        $("#number-group").removeClass('number-group-disabled');
        $("#number-group").addClass('number-group');
        $('#txtTransId').focus();
        $('.item-number').remove();
    },

    init: function () {
        VoidByBetId.getBalanceUp();
        $(document).ready(function ($) {
            $(".btn-remove-invalid").hide();
            $('.tab-content').hide();
            $('.tab-content:first').show();
            $('.tabs li:first').addClass('active');
            $('.tabs li').click(function (event) {
                $('.tabs li').removeClass('active');
                $(this).addClass('active');
                $('.tab-content').hide();
                var selectTab = $(this).find('a').attr("href");
                $(selectTab).show();
            });

            $('#product-select').multiselect({
                buttonWidth: '148px',
                numberDisplayed: 1,
                nonSelectedText: 'Select product',
                includeSelectAllOption: true,
            });

            $('#ticket-status-select').multiselect({
                buttonWidth: '148px',
                numberDisplayed: 1,
                nonSelectedText: 'Select status',
                includeSelectAllOption: true,
            });
        });

        $(document).on('click', '#btnExportExcelTicket', function (e) {
            e.stopPropagation();
            VoidByBetId.exportExcel();
        });

        $(document).click(function () {
            $('#show-error-move-bet').hide();
        });

        jQuery("#void-by-bet-id-form").validationEngine();
        var self = this;

        self.setupCalendar('.txt-calendar');

        $('#label-tab-by-username').click(function () {
            if (!self.isFilterByUserName()) {
                self.resetFilter();
                self.resetData();
                self.intDateTime();
                self.intByUsername();
            }
        });

        $('#label-tab-by-betid').click(function () {
            if (!self.isFilterByBetId()) {
                self.resetFilter();
                self.resetData();
                self.intByBetId();
            }
        });

        $('#ckbox-include-parlay').click(function () {
            if (this.checked) {
                $('#ckbox-abnormal-bet').attr('disabled', 'disabled');
            } else {
                $('#ckbox-abnormal-bet').removeAttr('disabled');
            }
            self.resetData();
        });

        $('#ckbox-abnormal-bet').click(function () {
            if (this.checked) {
                $('#ckbox-include-parlay').attr('disabled', 'disabled');
            } else {
                $('#ckbox-include-parlay').removeAttr('disabled');
            }
            self.resetData();
        });

        $("#txtTransId").change(function () {
            self.resetData();
        });

        $('.btn-remove-invalid').click(function (e) {
            $(".btn-remove-invalid").hide();
            $('div.item-number:has(span.value-number-invalid)').remove();
        });

        $('.btn-search').click(function (e) {
            e.stopPropagation();
            VoidByBetId.search();
            NapTicketControl.Helper.ResetReason();
            return false;
        });

        $('#btnVoidBet').click(function (e) {
            e.stopPropagation();
            VoidByBetId.checkNegativeBetCredit();

            return false;
        });

        $("#copy-clipboard").live("click", function (e) {
            NapTicketControl.Helper.copyToClipboard();
        });

        $("#affected-licensees-highlight").live("click", function (e) {
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById("affected-licensees-highlight"));
            selection.addRange(range);
            document.execCommand("copy");
            alert("The Licensee list has been copied to clipboard.");
        });

        $('#reason').keyup(function () {
            NapTicketControl.Helper.ReasonKeyUpHandle($(this));
        }).keydown(function (e) {
            NapTicketControl.Helper.ReasonKeyDownHandle(e, $(this));
        });

        $('#reasonSC').keyup(function () {
            NapTicketControl.Helper.ReasonKeyUpHandleSC($(this));
        }).keydown(function (e) {
            NapTicketControl.Helper.ReasonKeyDownHandleSC(e, $(this));
        });

        NapTicketControl.Helper.MaxTransIdPerBatch = VoidByBetId.MaxTransIdPerBatch;
        $("#txtTransId").keyup(function () {
            var value = $('#txtTransId').val();
            if (value.length === 0) {
                $('#txtTransId').addClass("text-number");
                $('#txtTransId').removeClass("text-number-invalid");
            }
            else {
                if (!VoidByBetId.isNumber(value)) {
                    $('#txtTransId').removeClass("text-number");
                    $('#txtTransId').addClass("text-number-invalid");
                }
                else {
                    $('#txtTransId').addClass("text-number");
                    $('#txtTransId').removeClass("text-number-invalid");
                }
            }
        }).ForceIntegerOnly();

        NapTicketControl.Helper.InitNumberGroup();

        VoidByBetId.getMessageTemplate();

        $("#ddl-abnormal-reason").change(function () {
            VoidByBetId.loadMessageTemplate();
        });
    },

    isNumber: function (e) {
        var number = /^\+?(0|[1-9]\d*)$/.test(e);
        if (!number) {
            return false;
        }

        return true;
    },

    resetFilter: function () {
        $('#ckbox-include-parlay').prop('checked', false);
        $('#ckbox-abnormal-bet').prop('checked', false);
        $('#txt-username').val('');
        $('#from-date').datepicker('setDate', null);
        $('#to-date').datepicker('setDate', null);
        $('#txtTransId').val('');
        $('.txt-calendar').val('');
    },

    resetData: function () {
        $('#ddl-abnormal-reason').val(NapTicketControl.Helper.issueTypeAbnormalBet);
        $('#report-content').hide();
        $('#show-error-move-bet').hide();
        $('#affected-licensees').hide();
        $('#msg-box').hide();
        $('#msg').hide();
    },

    isHasSettledTickets: function (statusIds) {
        const WON = '112';
        const LOSE = '113';
        const DRAW = '111';
        var statusIdList = statusIds.split(',');
        if (statusIdList.includes(WON) || statusIdList.includes(LOSE) || statusIdList.includes(DRAW)) {
            return true;
        }

        return false;
    },

    isFilterByBetId: function () {
        if ($('#label-tab-by-betid').hasClass('active')) {
            return true;
        }

        return false;
    },

    isFilterByUserName: function () {
        if ($('#label-tab-by-username').hasClass('active')) {
            return true;
        }

        return false;
    }
};

$(function () {
    VoidByBetId.init();
});