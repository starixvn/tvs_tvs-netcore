"use strict";

var recoverParlayService = {
    tickets: [],

    getBetIds: function () {
        var betIds = '';
        var betId = $('#txtTransId').val();
        $('.value-number').each(function () {
            var transId = $(this).text();
            betIds += betIds.length === 0 ? transId : "," + transId;
        });

        if (betId.length > 0) {
            betIds += betIds.length === 0 ? betId : "," + betId;
        }

        return betIds;
    },

    checkMatchId: function (event) {
        var matchId = $('#matchId').val();
        if (!matchId) {
            return true;
        }

        var param = {
            MatchId: $('#matchId').val(),
            IsExcludeChildMatchCricket: true
        };
        var result = true;

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/MatchInfo/GetInfo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: JSON.stringify(param),
            success: function (match) {
                result = match !== null;
            }
        });

        return result;
    },

    searchSubParlay: function () {
        var param = {
            betType: $('#bet-type').val(),
            matchId: $('#matchId').val(),
            transIds: recoverParlayService.getBetIds()
        };
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/RecoverSubParlay/GetTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (result) {
                recoverParlayService.displayData(result);
            },
            complete: function (event) {
                if (parseInt(event.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }

                NapTicketControl.enableInput();
            }
        });
    },

    searchMainParlay: function () {
        var param = {
            betType: $('#bet-type').val(),
            transIds: recoverParlayService.getBetIds()
        };
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/RecoverMainParlay/GetTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (result) {
                recoverParlayService.displayData(result);
            },
            complete: function (event) {
                if (parseInt(event.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }

                NapTicketControl.enableInput();
            }
        });
    },

    displayData: function (result) {
        NapTicketControl.Helper.showInvalidTransIds(result.InvalidTransIds);
        NapTicketControl.Helper.checkValidateIsMoveTicket();
        ContextMenu.Helper.groups = result.Groups;
        recoverParlayService.displayTicket(result);
        recoverParlayService.tickets = result.Tickets;
    },

    displayTicket: function (result) {
        result.Groups.length > 0 ? $('#recover').show() : $('#recover').hide();
        $('#report-content').show();
        var gridOptions = {
            columns: [
                {
                    HeaderText: ContextMenu.Helper.RenderCheckBoxAll(length), Name: "CustomAdd", Width: 50, HeaderAlign: "center", CellAlign: "center",
                    CustomCellRender: recoverParlayService.optionCustomRender, CssClass: 'bold'
                },
                { HeaderText: "No", Name: "No", Width: 30, HeaderAlign: "center", CellAlign: "center", ShowCollapseExpand: true, CssClass: 'bold' },
                { HeaderText: "BetID", Name: "BetId", Width: 140, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                {
                    HeaderText: "Member", Name: "Member", Width: 180, HeaderAlign: "center", CellAlign: "center",
                    CssClass: 'bold', CustomCellRender: NapTicketControl.Helper.renderName
                },
                { HeaderText: "Trans.Date", Name: "TransDate", Width: 140, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Bettype", Name: "BetType", Width: 110, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Odds", Name: "Odds", Width: 70, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' },
                { HeaderText: "Stake", Name: "Stake", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.00", CssClass: 'bold' },
                { HeaderText: "Win Loss", Name: "WinLoss", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.[00]", CssClass: 'bold' },
                { HeaderText: "Status", Name: "Status", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Choice", Name: "Choice", Width: 250, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' }
            ],

            bodyRows: recoverParlayService.generateGroupData(result.Groups),
            showTree: true,
            hideYBackGroundScroller: true,
            fullHeight: false,
            gridHeight: 600,
            marginRight: 0
        };

        $('#ticketInfo').fanexGrid(gridOptions);
        NapTicketControl.Helper.initCheckBoxGroup(result.Groups);
        ContextMenu.Helper.InitContextMenu(ContextMenu.Helper.showContextMenu);
    },

    optionCustomRender: function (cell) {
        var disabled = cell.IsDisable ? "disabled" : "";
        var checkBoxItem = "<input class='chk-ticket-all chk-ticket-" + cell.CssClass + "' value='" + cell.Value +
            "' type='checkbox'" + disabled;

        var isNotGroupSpecial = parseInt(cell.CssClass.indexOf(ContextMenu.Helper.groupBetFair)) === -1 &&
            parseInt(cell.CssClass.indexOf(ContextMenu.Helper.group8RM)) === -1;
        checkBoxItem += isNotGroupSpecial && !cell.IsDisable ? " checked='checked' />" : " />";

        return checkBoxItem;
    },

    generateGroupData: function (groups) {
        var rows = [];
        for (var index = 0; index < groups.length; index++) {
            var group = groups[index];
            var groupName = group.Name.toLowerCase();
            rows.push(
                {
                    Columns: [
                        { Name: "CustomAdd", Value: "", CssClass: groupName + " group-" + groupName + " checkBoxItem" },
                        { Name: "No", Value: group.Name, MergeColNumber: 11, CellAlign: "left" }
                    ],
                    SubRows: recoverParlayService.generateTicketData(group.Tickets, groupName)
                }
            );
        }

        return rows;
    },

    generateTicketData: function (tickets, groupName) {
        var rows = [];
        for (var index = 0; index < tickets.length; index++) {
            var currentRow = tickets[index];
            rows.push({
                Columns: [
                    {
                        Name: "CustomAdd", Value: currentRow.BetId,
                        CssClass: groupName + " checkBoxItem",
                        IsDisable: currentRow.IsDisable
                    },
                    { Name: "No", Value: currentRow.No, CssClass: "NoColumn" },
                    { Name: "BetId", Value: `${currentRow.BetId}${currentRow.IsHybrid && currentRow.BetId !== currentRow.SubTransId ? `<div>SubId:<br/>${currentRow.SubTransId}</div>` : ''}` },
                    { Name: "Member", Value: currentRow.Player },
                    { Name: "TransDate", Value: currentRow.TransDate },
                    { Name: "BetType", Value: currentRow.BetType },
                    { Name: "Odds", Value: currentRow.Odds },
                    { Name: "Stake", Value: currentRow.Stake },
                    { Name: "WinLoss", Value: currentRow.WinLost },
                    { Name: "Status", Value: currentRow.Status },
                    { Name: "Choice", Value: currentRow.Choice }
                ]
            });
        }

        return rows;
    },

    confirmBeforeRecover: function () {
        if (confirm(messages.confirmRecoverTicket)) {
            recoverParlayService.recoverTicket();
        }
    },

    recoverTicket: function () {
        var ticketType = $('input[name=ticket-type]:checked').val();
        if (ticketType === 'sub') {
            recoverParlayService.recoverSub();
        }
        else {
            recoverParlayService.recoverMain();
        }
    },

    recoverSub: function () {
        var transIds = NapTicketControl.Helper.getSubTicketsChecked("checkBoxItem").split(',');
        var params = {
            Tickets: recoverParlayService.tickets.filter(x => transIds.includes(x.TransId)),
            MatchId: $('#matchId').val(),
            betType: $('#bet-type').val()
        };
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/RecoverSubParlay/Recover",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (result) {
                recoverParlayService.displayMessageRecover(result);
            },
            error: function () {
                NapTicketControl.Helper.showMsgBox(messages.errorOccurredMessage);
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }

                NapTicketControl.enableInput();
            }
        });
    },

    recoverMain: function () {
        var transIds = NapTicketControl.Helper.getSubTicketsChecked("checkBoxItem").split(',');
        var params = {
            Tickets: recoverParlayService.tickets.filter(x => transIds.includes(x.TransId))
        };
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/RecoverMainParlay/Recover",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (result) {
                recoverParlayService.displayMessageRecover(result);
            },
            error: function () {
                NapTicketControl.Helper.showMsgBox(messages.errorOccurredMessage);
            },
            complete: function (e) {
                if (parseInt(e.status) === 403) {
                    NapTicketControl.Helper.showMsgBox(messages.authorizedMessage);
                }

                NapTicketControl.enableInput();
            }
        });
    },

    displayMessageRecover: function (result) {
        var ERROR_CODE_MOVE_BET_PROCESS = 112;

        if (result !== null && result.every(x => x.ErrorCode > 0)) {
            result[0].ErrorCode === ERROR_CODE_MOVE_BET_PROCESS ? NapTicketControl.Helper.displayContent(false) : NapTicketControl.Helper.displayContent(true);
        }
        else {
            recoverParlayDirective.clearInput();
            NapTicketControl.Helper.displayContent(false);
        }

        if (result !== null && result.IsSettledBet) {
            $("#show-settle-bet").dialog({
                dialogClass: "no-close",
                resizable: false,
                width: 600,
                position: { my: "center bottom", at: "center", of: window },
                buttons: [
                    {
                        text: "OK",
                        click: function () {
                            $(this).dialog("close");
                            NapTicketControl.Helper.showPopupMessage(result);
                        }
                    }
                ]
            });
        }
        else {
            NapTicketControl.Helper.showPopupMessage(result);
        }
    }
};