"use strict";

var recoverCashOutService = {
    storageParams: {
        PageIndex: "0",
        PageSize: "0",
        MAX_ROW_PER_PAGE: "3000",
        TotalItem: "0",
        FirstTime: true
    },
    negativeBalanceUsers: '',

    searchTickets: function () {
        var params = this.getParams(0, this.storageParams.MAX_ROW_PER_PAGE);
        this.getTickets(params, true);
    },

    getTransIds: function () {
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

    getParams: function (index, size) {
        var params = {
            MatchId: $('#txtMatchId').val(),
            FromTransId: $('#fromRefno').val(),
            ToTransId: $('#toRefno').val(),
            TransIds: this.getTransIds(),
            PageIndex: index,
            PageSize: size
        };

        return params;
    },

    getTickets: function (params, isResetMessage) {
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/RecoverCashOut/GetTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                recoverCashOutService.showInvalidTransIds(rs.InvalidTransIds);
                recoverCashOutService.showMovedTransIds(rs.MovedTransIds);
                NapTicketControl.Helper.checkValidateIsMoveTicket();
                ContextMenu.Helper.groups = rs.Groups;
                recoverCashOutService.storageParams.TotalItem = rs.TotalItem;
                recoverCashOutService.renderTickets(rs, params.PageIndex, params.PageSize);

                if (isResetMessage) {
                    Message.Helper.clearMsgContent();
                    $('#reason').val('');
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

    showInvalidTransIds: function (invalidTransIds) {
        var list = invalidTransIds.split(',');
        $('.value-number').each(function () {
            for (var i = 0; i < list.length; i++) {
                if (list[i] === $(this).text()) {
                    $(this).removeClass("value-number");
                    $(this).addClass("value-number-invalid");
                    break;
                }
            }
        });
    },

    showMovedTransIds: function (movedTransIds) {
        var list = movedTransIds.split(',');
        $('.value-number').each(function () {
            for (var i = 0; i < list.length; i++) {
                if (list[i] === $(this).text()) {
                    $(this).removeClass("value-number");
                    $(this).addClass("value-number-move-bet");
                    break;
                }
            }
        });
    },

    renderTickets: function (tickets, pageIndex, pageSize) {
        var count = tickets.Groups.length;
        if (count > 0) {
            $('#recover').show();
        } else {
            $('#recover').hide();
        }
        NapTicketControl.Helper.displayContent(true);

        var gridOptions = {
            columns: [
                {
                    HeaderText: ContextMenu.Helper.RenderCheckBoxAll(length), Name: "CustomAdd", Width: 50, HeaderAlign: "center", CellAlign: "center",
                    CustomCellRender: recoverCashOutService.optionCustomRender, CssClass: 'bold'
                },
                { HeaderText: "No", Name: "No", Width: 30, HeaderAlign: "center", CellAlign: "center", ShowCollapseExpand: true, CssClass: 'bold' },
                { HeaderText: "BetID", Name: "BetId", Width: 140, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                {
                    HeaderText: "Member", Name: "Player", Width: 180, HeaderAlign: "center", CellAlign: "center",
                    CssClass: 'bold', CustomCellRender: NapTicketControl.Helper.renderName
                },
                { HeaderText: "Trans.Date", Name: "TransDate", Width: 140, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Odds", Name: "Odds", Width: 70, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' },
                { HeaderText: "Stake", Name: "Stake", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.00", CssClass: 'bold' },
                { HeaderText: "Win Loss", Name: "WinLoss", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.[00]", CssClass: 'bold' },
                { HeaderText: "Status", Name: "Status", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Score", Name: "Score", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "HDP", Name: "HDP", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Choice", Name: "Choice", Width: 250, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' }
            ],

            bodyRows: recoverCashOutService.generateGroupData(tickets.Groups),
            showTree: true,
            hideYBackGroundScroller: true,
            fullHeight: false,
            gridHeight: 600,
            showPager: true,
            customPager: true,
            pagerOption: {
                itemsPerPage: pageSize,
                currentPage: pageIndex,
                totalItem: tickets.TotalItem,
                itemsPerPageArray: [500, 1000, 2000, 3000],
                pagerSelectCallBack: function (pageIndex, pageSize) {
                    recoverCashOutService.pagingEvent(pageIndex, pageSize);
                }
            },
            marginRight: 0
        };

        $('#ticketInfo').fanexGrid(gridOptions);

        if (this.storageParams.FirstTime) {
            $('#itemperpage').val(this.storageParams.MAX_ROW_PER_PAGE);
        }

        this.storageParams.FirstTime = false;
        NapTicketControl.Helper.initCheckBoxGroup(tickets.Groups);
        ContextMenu.Helper.InitContextMenu(ContextMenu.Helper.showContextMenu);
    },

    optionCustomRender: function (cell) {
        var disabled = cell.IsDisable ? " disabled" : "";
        var checked = cell.IsDisable ? "" : " checked='checked'";
        return "<input class='chk-ticket-all chk-ticket-" + cell.CssClass + "' value='" + cell.Value +
            "' type='checkbox'" + checked + disabled + " site-db-group-id='" + cell.SiteDbGroupId + "'" + "/>";
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
                        { Name: "No", Value: group.Name, MergeColNumber: 14, CellAlign: "left" }
                    ],
                    SubRows: recoverCashOutService.generateTicketData(group.Tickets, groupName)
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
                        Name: "CustomAdd", Value: currentRow.BetId, CssClass: groupName + " checkBoxItem",
                        IsDisable: currentRow.IsDisable,
                        SiteDbGroupId: currentRow.SiteDbGroupId
                    },
                    { Name: "No", Value: currentRow.No, CssClass: "NoColumn" },
                    { Name: "BetId", Value: currentRow.BetId },
                    { Name: "Player", Value: currentRow.Player },
                    { Name: "TransDate", Value: currentRow.TransDate },
                    { Name: "Odds", Value: currentRow.Odds },
                    { Name: "Stake", Value: currentRow.Stake },
                    { Name: "WinLoss", Value: currentRow.WinLoss },
                    { Name: "Status", Value: currentRow.Status },
                    { Name: "Score", Value: currentRow.Score },
                    { Name: "HDP", Value: currentRow.Handicap },
                    { Name: "Choice", Value: currentRow.Choice }
                ]
            });
        }

        return rows;
    },

    pagingEvent: function (pageIndex, pageSize) {
        this.storageParams.PageIndex = pageIndex;
        this.storageParams.PageSize = pageSize;
        var params = this.getParams(pageIndex, pageSize);
        this.getTickets(params);
    },

    recoverTickets: function () {
        this.checkNegativeBalance();
    },

    checkNegativeBalance: function () {
        var tickets = $('.checkBoxItem:checkbox:checked').not('#chk-ticket-all').map(function () {
            if (this.value !== '') {
                return { transId: this.value, siteDbGroupId: this.getAttribute('site-db-group-id') };
            }
        }).get();
        var param = {
            TransIds: tickets.map(x => x.transId).join(','),
            Type: true
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
                recoverCashOutService.storageParams.MAX_ROW_PER_PAGE = $('select[id=itemperpage]').val();
                var confirmMessage = '';
                var isReloadPage = recoverCashOutService.storageParams.TotalItem <= recoverCashOutService.storageParams.MAX_ROW_PER_PAGE ?
                    true : false;

                if (result.length > 0) {
                    var username = $.trim(result[0].userName);
                    for (var index = 1; index < result.length; index++) {
                        username += ', ' + result[index].userName;
                    }

                    recoverCashOutService.negativeBalanceUsers = username;
                    confirmMessage = isReloadPage ?
                        messages.confirmNegativeCustomer + username + '\n ' + messages.confirmRecoverTicket :
                        messages.confirmNegativeCustomer + username + '\n ' + messages.confirmRecoverInPage;
                }
                else {
                    confirmMessage = isReloadPage ? messages.confirmRecoverTicket : messages.confirmRecoverInPage;
                    recoverCashOutService.negativeBalanceUsers = '';
                }

                if (confirm(confirmMessage)) {
                    recoverCashOutService.deleteTickets(tickets, isReloadPage);
                }
                else {
                    NapTicketControl.enableInput();
                }
            }
        });
    },

    deleteTickets: function (tickets, isReloadPage) {
        var ERROR_CODE_MOVE_BET_PROCESS = 112;
        var totalCheckBox = $('input[type=checkbox].checkBoxItem').length;
        var totalChecked = $('.checkBoxItem:checked').length;
        var params = {
            Tickets: tickets,
            NegativeBalanceUsers: recoverCashOutService.negativeBalanceUsers
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/RecoverCashOut/RecoverTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (rs) {
                if (rs !== null && rs.every(x => x.ErrorCode > 0)) {
                    rs.some(x => x.ErrorCode === ERROR_CODE_MOVE_BET_PROCESS) ? NapTicketControl.Helper.displayContent(false) : NapTicketControl.Helper.displayContent(true);
                }
                else {
                    NapTicketControl.Helper.displayContent(false);
                    if (isReloadPage === true) {
                        recoverCashOutDirective.clearInput();
                    } else {
                        if (totalCheckBox === totalChecked) {
                            var lastPage = Math.ceil(recoverCashOutService.storageParams.TotalItem / recoverCashOutService.storageParams.PageSize) - 1;
                            if (parseInt(recoverCashOutService.storageParams.PageIndex) === lastPage) {
                                recoverCashOutService.storageParams.PageIndex -= 1;
                            }
                        }
                        var params = recoverCashOutService
                            .getParams(recoverCashOutService.storageParams.PageIndex, recoverCashOutService.storageParams.PageSize);
                        recoverCashOutService.removeBetIdAfterrecover(param.tickets);
                        recoverCashOutService.getTickets(params, false);
                    }
                }

                NapTicketControl.Helper.showPopupMessageDetail(rs);
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

    removeBetIdAfterrecover: function (tickets) {
        var transIds = tickets.map(x => x.transId);
        $('.value-number').each(function () {
            for (var index = 0; index < transIds.length; index++) {
                if (transIds[index].toString() === $(this).text()) {
                    $(this).parent().remove();
                }
            }
        });
    }
};