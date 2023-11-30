"use strict";

const voidCashOutService = {
    storageParams: {
        PageIndex: "0",
        PageSize: "0",
        MAX_ROW_PER_PAGE: "3000",
        TotalItem: "0",
        FirstTime: true,
        IsCashOutAsUnSettledTicket: true,
    },
    matchInfo: {},
    negativeBalanceUsers: '',

    searchTickets: function () {
        const params = this.getParams(0, this.storageParams.MAX_ROW_PER_PAGE);
        NapTicketControl.Helper.displayContent(false);
        if (this.isFilterByMatchId()) {
            if (this.checkMatchId()) {
                this.getMatch($('#txtMatchId').val());
                this.getTickets(params, true);
            }
        } else {
            this.getTickets(params, true);
        }
    },

    isFilterByMatchId: function () {
        return $("#radio-by-match").is(":checked");
    },

    checkMatchId: function () {
        let isValid = true;
        const params = {
            matchId: $('#txtMatchId').val(),
            mode: 0
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/BetTypes/GetGroupBetTypesNg",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: JSON.stringify(params),
            success: function (response) {
                if (response.result.isSuccessful === false) {
                    $('#msg').html(tooltip.show('txtMatchId', response.result.errorMsg)).show();

                    NapTicketControl.Helper.displayContent(false);
                    isValid = false;
                }
            }
        });

        return isValid;
    },

    getTransIds: function () {
        let result = "";
        const betId = $('#txtTransId').val();

        $('.value-number').each(function () {
            let transId = $(this).text();
            result += result.length === 0 ? transId : "," + transId;
        });

        if (betId.length > 0) {
            result += result.length === 0 ? betId : "," + betId;
        }

        return result;
    },

    getParams: function (index, size) {
        let durations = null;
        if (this.isFilterByMatchId()) {
            durations = [
                {
                    FromTransDate: $('#fromTransDate').val() + ' ' + $('#fromTime').val(),
                    ToTransDate: $('#toTransDate').val() + ' ' + $('#toTime').val()
                }
            ];
        }

        const params = {
            MatchId: $('#txtMatchId').val(),
            FilterBy: $('input[name="radio-time-type"]:checked').val(),
            TransIds: this.getTransIds(),
            PageIndex: index,
            PageSize: size,
            Durations: durations
        };

        return params;
    },

    getTickets: function (params, isResetMessage) {
        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/CancelCashOut/GetTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                if ($("#radio-by-bet").is(":checked")) {
                    if (rs.IsDiffMatchId) {
                        voidCashOutService.showTooltipBetIdsDiffMatch();
                    } else {
                        voidCashOutService.showInvalidTransIds(rs.InvalidTransIds);
                        voidCashOutService.showMovedTransIds(rs.MovedTransIds);
                        NapTicketControl.Helper.checkValidateIsMoveTicket();
                        if (rs.TotalItem > 0) {
                            voidCashOutService.getMatch(rs.Groups[0].Tickets[0].MatchId);
                        }
                    }
                }

                ContextMenu.Helper.groups = rs.Groups;
                voidCashOutService.storageParams.TotalItem = rs.TotalItem;
                voidCashOutService.renderTickets(rs, params.PageIndex, params.PageSize);
                voidCashOutService.storageParams.IsCashOutAsUnSettledTicket = rs.IsCashOutAsUnSettledTicket;

                if (isResetMessage) {
                    Message.Helper.clearMsgContent();
                    $('#reason').val('');
                    $('#reasonSC').val('');
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
        const list = invalidTransIds.split(',');
        $('.value-number').each(function () {
            for (const element of list) {
                if (element === $(this).text()) {
                    $(this).removeClass("value-number");
                    $(this).addClass("value-number-invalid");
                    break;
                }
            }
        });
    },

    showMovedTransIds: function (movedTransIds) {
        const list = movedTransIds.split(',');
        $('.value-number').each(function () {
            for (const element of list) {
                if (element === $(this).text()) {
                    $(this).removeClass("value-number");
                    $(this).addClass("value-number-move-bet");
                    break;
                }
            }
        });
    },

    renderTickets: function (tickets, pageIndex, pageSize) {
        const length = tickets.Groups.length;
        if (length > 0) {
            Message.Helper.displayFormMsg(true);
        } else {
            Message.Helper.displayFormMsg(false);
        }
        NapTicketControl.Helper.displayContent(true);
        const gridOptions = {
            titleInfo: {
                text: "Cancel Cash Out Action",
                showExcelButton: true,
                exportExcelFunction: function () {
                    voidCashOutService.exportExcel();
                }
            },
            showTitle: true,
            columns: [
                {
                    HeaderText: ContextMenu.Helper.RenderCheckBoxAll(length), Name: "CustomAdd", Width: 50, HeaderAlign: "center", CellAlign: "center",
                    CustomCellRender: voidCashOutService.optionCustomRender, CssClass: 'bold'
                },
                { HeaderText: "No", Name: "No", Width: 30, HeaderAlign: "center", CellAlign: "center", ShowCollapseExpand: true, CssClass: 'bold' },
                { HeaderText: "BetID", Name: "BetId", Width: 140, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                {
                    HeaderText: "Member", Name: "Player", Width: 180, HeaderAlign: "center", CellAlign: "center",
                    CssClass: 'bold', CustomCellRender: NapTicketControl.Helper.renderName
                },
                { HeaderText: "Trans.Date", Name: "TransDate", Width: 160, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Odds", Name: "Odds", Width: 70, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' },
                { HeaderText: "Stake", Name: "Stake", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.00", CssClass: 'bold' },
                { HeaderText: "Win Loss", Name: "WinLoss", Width: 100, HeaderAlign: "center", CellAlign: "right", FormatNumber: "0,0.[00]", CssClass: 'bold' },
                { HeaderText: "Status", Name: "Status", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Score", Name: "Score", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "HDP", Name: "HDP", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Choice", Name: "Choice", Width: 250, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' }
            ],

            bodyRows: voidCashOutService.generateGroupData(tickets.Groups),
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
                    voidCashOutService.pagingEvent(pageIndex, pageSize);
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
        const disabled = cell.IsDisable ? " disabled" : "";
        const checked = cell.IsDisable ? "" : " checked='checked'";
        return "<input class='chk-ticket-all chk-ticket-" + cell.CssClass + "' value='" + cell.Value +
            "' type='checkbox'" + checked + disabled + " site-db-group-id='" + cell.SiteDbGroupId + "'" + "/>";
    },

    generateGroupData: function (groups) {
        let rows = [];
        for (const element of groups) {
            let group = element;
            let groupName = group.Name.toLowerCase();
            rows.push(
                {
                    Columns: [
                        { Name: "CustomAdd", Value: "", CssClass: groupName + " group-" + groupName + " checkBoxItem" },
                        { Name: "No", Value: group.Name, MergeColNumber: 14, CellAlign: "left" }
                    ],
                    SubRows: voidCashOutService.generateTicketData(group.Tickets, groupName)
                }
            );
        }

        return rows;
    },

    generateTicketData: function (tickets, groupName) {
        let rows = [];
        for (const element of tickets) {
            const currentRow = element;
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
        let params = this.getParams(pageIndex, pageSize);
        this.getTickets(params);
    },

    exportExcel: function () {
        const param = this.getParams(0, this.storageParams.MAX_ROW_PER_PAGE);
        const totalItems = this.storageParams.TotalItem;
        const maxItemsSupport = $('#max-ticket-export').val();
        if (parseInt(totalItems) > parseInt(maxItemsSupport)) {
            NapTicketControl.MessageNotAllowExportExcel();
            return;
        }
        NapTicketControl.xhrDownloadFile(window.rootUrl + "api/CancelCashOut/ExportExcel", param);
    },

    voidTickets: function () {
        this.checkNegativeBalance();
    },

    checkNegativeBalance: function () {
        const ticketsCheckPermission = $('.checkBoxItem:checkbox').not('#chk-ticket-all').map(function () {
            if (this.value !== '') {
                return { transId: this.value, siteDbGroupId: parseInt(this.getAttribute('site-db-group-id')) };
            }
        }).get();
        const tickets = $('.checkBoxItem:checkbox:checked').not('#chk-ticket-all').map(function () {
            if (this.value !== '') {
                return { transId: this.value, siteDbGroupId: parseInt(this.getAttribute('site-db-group-id')) };
            }
        }).get();
        const param = {
            TransIds: tickets.map(x => x.transId).join(','),
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
                voidCashOutService.storageParams.MAX_ROW_PER_PAGE = $('select[id=itemperpage]').val();
                let confirmMessage = '';
                const isReloadPage = voidCashOutService.storageParams.TotalItem <= voidCashOutService.storageParams.MAX_ROW_PER_PAGE;

                if (result.length > 0) {
                    let username = $.trim(result[0].userName);
                    for (let index = 1; index < result.length; index++) {
                        username += ', ' + result[index].userName;
                    }

                    voidCashOutService.negativeBalanceUsers = username;
                    confirmMessage = isReloadPage ?
                        messages.confirmNegativeCustomer + username + '\n ' + messages.confirmVoidTicket :
                        messages.confirmNegativeCustomer + username + '\n ' + messages.confirmVoidInPage;
                }
                else {
                    confirmMessage = isReloadPage ? messages.confirmVoidTicket : messages.confirmVoidInPage;
                    voidCashOutService.negativeBalanceUsers = '';
                }

                if (confirm(confirmMessage)) {
                    const params = {
                        tickets: ticketsCheckPermission,
                        isCashOutAsUnSettledTicket: voidCashOutService.storageParams.IsCashOutAsUnSettledTicket,
                        apikey: "void-cash-out-check-void-bet-permission"
                    };
                    NapTicketControl.Helper.checkVoidBetPermission(params, $("#btnSearch"), function () {
                        voidCashOutService.deleteTickets(tickets, isReloadPage);
                    });
                }
                else {
                    NapTicketControl.enableInput();
                }
            }
        });
    },

    deleteTickets: function (tickets, isReloadPage) {
        const ERROR_CODE_MOVE_BET_PROCESS = 112;
        const totalCheckBox = $('input[type=checkbox].checkBoxItem').length;
        const totalChecked = $('.checkBoxItem:checked').length;
        const params = {
            Tickets: tickets,
            UserPassword: CryptoJS.CfsEnCode($('#password').val()),
            UserName: $('#username').val(),
            Reason: $('#reason').val(),
            ReasonSC: $('#reasonSC').val(),
            NegativeBalanceUsers: voidCashOutService.negativeBalanceUsers,
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
            Match: voidCashOutService.matchInfo
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "api/CancelCashOut/VoidTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (rs) {
                if (rs?.every(x => x.ErrorCode > 0)) {
                    rs.some(x => x.ErrorCode === ERROR_CODE_MOVE_BET_PROCESS) ? NapTicketControl.Helper.displayContent(false) : NapTicketControl.Helper.displayContent(true);
                }
                else {
                    NapTicketControl.Helper.displayContent(false);
                    if (isReloadPage === true) {
                        voidCashOutDirective.clearInput();
                    } else {
                        if (totalCheckBox === totalChecked) {
                            let lastPage = Math.ceil(voidCashOutService.storageParams.TotalItem / voidCashOutService.storageParams.PageSize) - 1;
                            if (parseInt(voidCashOutService.storageParams.PageIndex) === lastPage) {
                                voidCashOutService.storageParams.PageIndex -= 1;
                            }
                        }
                        let params = voidCashOutService
                            .getParams(voidCashOutService.storageParams.PageIndex, voidCashOutService.storageParams.PageSize);
                        voidCashOutService.getTickets(params, false);
                    }

                    $('#password').val('');
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

    getMatch: function (matchId) {
        const params = {
            matchId: matchId,
        };
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
                    voidCashOutService.matchInfo = match;
                }
            },
            error: function () { }
        });
    },

    showTooltipBetIdsDiffMatch: function () {
        $('#msg').html(tooltip.show('errorBetId', messages.allBetIdsSameMatch)).show();
    }
};