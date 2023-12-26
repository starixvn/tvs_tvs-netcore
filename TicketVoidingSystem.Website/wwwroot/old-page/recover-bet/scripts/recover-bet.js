/* File Created: March 8, 2013 */
/*global NapTicketControl, tooltip, ContextMenu*/

"use strict";

var recoverBet = {
    MaxTransIdPerBatch: 1000,
    CentralDb: 0,
    storageParams: {
        DataRequest: {
            PageIndex: "0",
            PageSize: "0"
        },
        MAX_ROW_PER_PAGE: "3000",
        TotalItem: "0",
        FirstTime: true
    },

    listUsernameNagativeCredit: '',

    init: function () {
        $(document).click(function () {
            $('#show-error-move-bet').hide();
        });

        jQuery("#recoverBetForm").validationEngine();

        $('body').delegate('#btnSearch', 'click', function (e) {
            e.stopPropagation();
            recoverBet.search(e);
        });

        $('#Recover').on("click", function (e) {
            e.stopPropagation();
            recoverBet.actionRecover();
        });

        $("#copy-clipboard").live("click", function (e) {
            NapTicketControl.Helper.copyToClipboard();
        });

        NapTicketControl.Helper.MaxTransIdPerBatch = recoverBet.MaxTransIdPerBatch;
        $('#txtTransId').keyup(function () {
            var value = $('#txtTransId').val();
            if (value.length === 0) {
                $('#txtTransId').addClass("text-number");
                $('#txtTransId').removeClass("text-number-invalid");
            }
            else {
                if (!recoverBet.isNumber(value)) {
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
    },

    clearAllInput: function () {
        $(':input[type=text]').val('');
        $('.item-number').remove();
    },

    isNumber: function (e) {
        return /^\+?(0|[1-9]\d*)$/.test(e);
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

    search: function () {
        var pagingParam = {
            PageIndex: "0",
            PageSize: recoverBet.storageParams.MAX_ROW_PER_PAGE
        };

        var dataRequest = {};
        $.extend(dataRequest, pagingParam);
        $('#show-error-move-bet').hide();
        NapTicketControl.Helper.displayContent(false);
        var betIds = recoverBet.getBetIds();
        if (betIds.length === 0) {
            $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
            return false;
        }

        var param = {
            TransIds: betIds,
        };

        $.extend(dataRequest, param);

        recoverBet.getTicket(dataRequest);
    },

    getTicket: function (dataRequest) {
        $.extend(recoverBet.storageParams.DataRequest, dataRequest);

        $.ajax({
            type: "POST",
            url: window.rootUrl + "SportBook/RecoverBet/GetTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(dataRequest),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                NapTicketControl.Helper.showInvalidTransIds(rs.InvalidTransIds);
                NapTicketControl.Helper.checkValidateIsMoveTicket();
                recoverBet.storageParams.TotalItem = rs.TotalItem;
                ContextMenu.Helper.groups = rs.Groups;
                recoverBet.loadTicket(rs, dataRequest.PageIndex, dataRequest.PageSize);
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
                    SubRows: recoverBet.generateTicketData(group.Tickets, groupName)
                }
            );
        }

        return rows;
    },

    generateTicketData: function (tickets, groupName) {
        var rows = [];
        recoverBet.storageParams.userBetTrade = [];
        for (var index = 0; index < tickets.length; index++) {
            var currentRow = tickets[index];
            var className = groupName;
            className = currentRow.IsCricket ? className + ' netposition' : className;
            if (currentRow.Player.toLowerCase().indexOf('bettrade') !== -1) {
                recoverBet.storageParams.userBetTrade.push(currentRow.BetId.toString());
            }

            rows.push({
                Columns: [
                    {
                        Name: "CustomAdd", Value: currentRow.BetId,
                        CssClass: currentRow.Status.toLowerCase().indexOf("sold") !== -1 ? "sold " + className : className + " checkBoxItem",
                        MainTransId: currentRow.MainTransId, IsDisable: currentRow.IsDisable,
                        SiteDbGroupId: currentRow.SiteDbGroupId
                    },
                    { Name: "No", Value: currentRow.No, CssClass: "NoColumn" },
                    { Name: "BetId", Value: currentRow.BetId },
                    { Name: "Player", Value: currentRow.Player },
                    { Name: "TransDate", Value: currentRow.TransDate },
                    { Name: "Odds", Value: currentRow.Odds },
                    { Name: "Stake", Value: currentRow.Stake },
                    { Name: "WinLoss", Value: currentRow.WinLost },
                    { Name: "Status", Value: currentRow.Status },
                    { Name: "Score", Value: currentRow.Score },
                    { Name: "HDP", Value: currentRow.Handicap },
                    { Name: "Choice", Value: currentRow.Choice }
                ]
            });
        }

        return rows;
    },

    loadTicket: function (betGroups, pageIndex, pageSize) {
        var count = betGroups.Groups.length;

        if (count > 0) {
            $('#Recover').show();
        } else {
            $('#Recover').hide();
        }

        NapTicketControl.Helper.displayContent(true);
        var gridOptions = {
            columns: [
                {
                    HeaderText: ContextMenu.Helper.RenderCheckBoxAll(length), Name: "CustomAdd", Width: 50, HeaderAlign: "center", CellAlign: "center",
                    CustomCellRender: recoverBet.optionCustomRender, CssClass: 'bold'
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
                { HeaderText: "Status", Name: "Status", Width: 65, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Score", Name: "Score", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "HDP", Name: "HDP", Width: 50, HeaderAlign: "center", CellAlign: "center", CssClass: 'bold' },
                { HeaderText: "Choice", Name: "Choice", Width: 250, HeaderAlign: "center", CellAlign: "right", CssClass: 'bold' }
            ],

            bodyRows: recoverBet.generateGroupData(betGroups.Groups),
            showTree: true,
            hideYBackGroundScroller: true,
            fullHeight: false,
            gridHeight: 600,
            showPager: true,
            customPager: true,
            pagerOption: {
                itemsPerPage: pageSize,
                currentPage: pageIndex,
                totalItem: betGroups.TotalItem,
                itemsPerPageArray: [500, 1000, 2000, 3000],
                pagerSelectCallBack: function (pageIndex, pageSize) {
                    recoverBet.renderPagingEvent(pageIndex, pageSize);
                }
            },
            marginRight: 0
        };

        $('#ticketInfo').fanexGrid(gridOptions);

        if (recoverBet.storageParams.FirstTime) {
            $('#itemperpage').val(recoverBet.storageParams.MAX_ROW_PER_PAGE);
        }

        recoverBet.storageParams.FirstTime = false;
        NapTicketControl.Helper.initCheckBoxGroup(betGroups.Groups);
        ContextMenu.Helper.InitContextMenu(ContextMenu.Helper.showContextMenu);
    },

    optionCustomRender: function (cell) {
        var disabled = cell.IsDisable ? "disabled" : "";
        var checked = !cell.IsDisable ? " checked='checked'" : "";

        return "<input class='chk-ticket-all chk-ticket-" + cell.CssClass + "' value='" + cell.Value +
            "' type='checkbox'" + checked + " site-db-group-id='" + cell.SiteDbGroupId + "'" + " main-trans-id='" + cell.MainTransId + "'" + disabled + "/>";
    },

    renderPagingEvent: function (pageIndex, pageSize) {
        if (recoverBet.storageParams.DataRequest !== null) {
            var dataRequest = {};
            var pagingParams = {
                PageIndex: pageIndex,
                PageSize: pageSize
            };

            $.extend(dataRequest, recoverBet.storageParams.DataRequest, pagingParams);
            if ($("#radio-by-match").is(":checked")) {
                dataRequest.TransIds = '';
            }

            recoverBet.getTicket(dataRequest);
        }

        return false;
    },

    actionRecover: function () {
        var cricketTickets = NapTicketControl.Helper.getSubTicketModelsChecked("netposition");
        var enableCheckedTickets = $('.chk-ticket-all:checkbox:enabled:checked').not('#chk-ticket-all').map(function () {
            if (!isNaN(parseFloat(this.value))) {
                return { transId: this.value, siteDbGroupId: this.getAttribute('site-db-group-id') };
            }
        }).get();
        var param = {
            Tickets: enableCheckedTickets,
            TransIdCrickets: cricketTickets
        };

        if (param.Tickets.length === 0) {
            $('#msg').html(tooltip.show('chk-ticket-all', messages.selectOneTicket)).show();
            return;
        }

        recoverBet.checkNegativeBetCredit(param);
    },

    checkNegativeBetCredit: function (param) {
        var transIds = $('.checkBoxItem:checkbox:enabled:checked').not('#chk-ticket-all').map(function () {
            if (this.value !== '') {
                return this.value;
            }
        }).get();

        if (recoverBet.storageParams.userBetTrade.length > 0) {
            transIds = transIds.filter(function (x) { return $.inArray(x, recoverBet.storageParams.userBetTrade) < 0; });
        }

        transIds = transIds.length > 0 ? transIds.join(',') + ',' + NapTicketControl.Helper.getTicketsBetTradeChecked(".chk-ticket-sold")
            : NapTicketControl.Helper.getTicketsBetTradeChecked(".chk-ticket-sold");

        var paramNegativeBet = {
            TransIds: transIds,
            Type: true
        };

        $.ajax({
            type: "POST",
            url: window.rootUrl + "Tickets/CheckNegativeBalance",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(paramNegativeBet),
            beforeSend: function () {
                NapTicketControl.disableInput();
            },
            success: function (rs) {
                recoverBet.storageParams.MAX_ROW_PER_PAGE = $('select[id=itemperpage]').val();

                var confirmMessage = '';
                var isReloadPage = recoverBet.storageParams.TotalItem <= recoverBet.storageParams.MAX_ROW_PER_PAGE ?
                    true : false;
                if (rs !== null && rs.length > 0) {
                    var username = $.trim(rs[0].userName);
                    for (var index = 1; index < rs.length; index++) {
                        username += ', ' + rs[index].userName;
                    }

                    recoverBet.listUsernameNagativeCredit = username;
                    confirmMessage = isReloadPage ?
                        messages.confirmNegativeCustomer + username + '\n ' + messages.confirmRecoverTicket :
                        messages.confirmNegativeCustomer + username + '\n ' + messages.confirmRecoverInPage;
                }
                else {
                    confirmMessage = isReloadPage ?
                        messages.confirmRecoverTicket :
                        messages.confirmRecoverInPage;
                    recoverBet.listUsernameNagativeCredit = '';
                }

                if (confirm(confirmMessage)) {
                    param.UsersNegativeCredit = recoverBet.listUsernameNagativeCredit;
                    recoverBet.proceedRecoverTicket(param, isReloadPage);
                }
                else {
                    NapTicketControl.enableInput();
                }
            }
        });
    },

    proceedRecoverTicket: function (param, willReloadPage) {
        var lastPageIndex = recoverBet.findLastPageIndex();
        var totalCheckBox = $('input[type=checkbox].checkBoxItem').length;
        var totalChecked = $('.checkBoxItem:checked').length;
        var ERROR_CODE_MOVE_BET_PROCESS = 112;

        $.ajax({
            type: "POST",
            url: window.rootUrl + "SportBook/RecoverBet/RecoverTickets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            success: function (rs) {
                if (rs.Results !== null && rs.Results.every(x => x.ErrorCode > 0)) {
                    rs.Results[0].ErrorCode === ERROR_CODE_MOVE_BET_PROCESS ? NapTicketControl.Helper.displayContent(false) : NapTicketControl.Helper.displayContent(true);
                }
                else {
                    NapTicketControl.Helper.displayContent(false);

                    if (willReloadPage === true) {
                        recoverBet.clearAllInput();
                    } else {
                        var dataRequest = {};

                        if (totalCheckBox === totalChecked) {
                            if (parseInt(recoverBet.storageParams.DataRequest.PageIndex) === lastPageIndex) {
                                recoverBet.storageParams.DataRequest.PageIndex -= 1;
                            }
                        }

                        $.extend(dataRequest, recoverBet.storageParams.DataRequest);
                        recoverBet.removeBetIdAfterRecover(param.Tickets);

                        recoverBet.getTicket(dataRequest);
                    }
                }

                NapTicketControl.Helper.showPopupMessageDetail(rs.Results);
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

    findLastPageIndex: function () {
        var dividedItem = Math.floor(recoverBet.storageParams.TotalItem / recoverBet.storageParams.MAX_ROW_PER_PAGE);
        var addPage = recoverBet.storageParams.MAX_ROW_PER_PAGE * dividedItem
            === parseInt(recoverBet.storageParams.TotalItem) ? -1 : 0;
        return dividedItem + addPage;
    },

    removeBetIdAfterRecover: function (tickets) {
        var transIds = tickets.map(x => x.transId).join(',');
        $('.value-number').each(function () {
            for (var index = 0; index < transIds.length; index++) {
                if (transIds[index].toString() === $(this).text()) {
                    $(this).parent().remove();
                }
            }
        });
    }
};

$(function () {
    recoverBet.init();
});