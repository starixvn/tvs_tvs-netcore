/*jshint loopfunc: true, strict: false */
/*global tooltip, NapTicketControl*/

var ContextMenu = (function () {
    return {};
}(jQuery));

(function ($) {
    $.fn.checkBoxGroup = function () {
        var allChk = this.first();
        var elseChk = this.slice(1);
        elseChk = elseChk.filter(":not(:disabled)");

        allChk.attr('checked', elseChk.filter(":checked").length >= elseChk.length && elseChk.length > 0);

        allChk.change(function () {
            var isChecked = $(this).is(':checked');
            elseChk.attr('checked', isChecked);
            ContextMenu.Helper.ChangeCheckBoxAll();
            var groupName = ContextMenu.Helper.GetGroupName(this).toLowerCase();
            var subTickets = $('input[main-trans-id].chk-ticket-all:disabled:not([main-trans-id="0"])');
            subTickets.each(function () {
                if ($(this).hasClass('chk-ticket-' + groupName) || $(this).hasClass(groupName)) {
                    $(this).attr('checked', isChecked);
                }
            });

            ContextMenu.Helper.ShowWarningBetTradePaging();
        });

        elseChk.change(function () {
            var checked = $(this).is(':checked') ? elseChk.filter(":checked").length >= elseChk.length : false;
            allChk.attr('checked', checked);

            ContextMenu.Helper.ChangeCheckBoxAll();
            var subTickets = $('input[type="checkbox"].chk-ticket-all:disabled:not([main-trans-id="0"])');
            var subTicketsLenght = subTickets.length;
            for (var j = 0; j < subTicketsLenght; j++) {
                var element = subTickets[j];
                if (this.value === element.attributes['main-trans-id'].value) {
                    $(element).attr('checked', $(this).is(':checked'));
                }
            }

            ContextMenu.Helper.ShowWarningBetTradePaging();
        });

        return this;
    };

    $.fn.toggleGroup = function () {
        var allChk = this.first();
        var elseChk = this.slice(1);

        var thisIsChecked = $(allChk).is(':checked');
        elseChk.not(':disabled').attr('checked', !thisIsChecked);
        allChk.not(':disabled').attr('checked', !thisIsChecked);
        ContextMenu.Helper.ChangeCheckBoxAll();
        for (var index = 0; index < ContextMenu.Helper.groups.length; index++) {
            var group = ContextMenu.Helper.groups[index];
            var groupName = group.Name.toLowerCase().replace(/ /g, '-').replace(/\//g, '-').replace('(', '').replace(')', '');
            var isChecked = $("input[type=checkbox].chk-ticket-" + groupName).prop('checked');
            var subTickets = $('input[main-trans-id].chk-ticket-all:disabled:not([main-trans-id="0"])');
            subTickets.each(function () {
                if ($(this).hasClass('chk-ticket-' + groupName) || $(this).hasClass(groupName)) {
                    $(this).attr('checked', isChecked);
                }
            });
        }

        ContextMenu.Helper.ShowWarningBetTradePaging();

        return this;
    };
}(jQuery));

ContextMenu.Helper = (function ($) {
    return {
        groups: null,
        groupBetFair: "betfair",
        group8RM: "8rm",
        group8RMBARM: "8rm-barm",
        groupPhoneBetting: "phone-betting",
        groupParlay: "parlay",

        InitContextMenu: function (showContextMenu) {
            $('.componentCheckBoxAll').on('click', showContextMenu);
            $('.contextMenu').disableSelection();
            $('.componentCheckBoxAll').disableSelection();
            ContextMenu.Helper.ChangeCheckBoxAll();
            ContextMenu.Helper.InitBetTradeTicket();

            $('.checkBoxAll').click(function (event) {
                if ($('input[type=checkbox].checkBoxItem').not(':disabled').length === 0) {
                    return;
                }

                var self = this;
                $.contextMenu('destroy');
                if ($(self).hasClass('checkedAll')) {
                    $(self).removeClass('checkedAll');
                    $('.checkBoxItem').removeAttr('checked', 'checked');
                } else if ($(self).hasClass('checked')) {
                    $(self).removeClass('checked');
                    $('.checkBoxItem').removeAttr('checked', 'checked');
                } else {
                    $(self).not(':disabled').addClass('checkedAll');
                    $(self).removeClass('checked');
                    $('.checkBoxItem').not(':disabled').attr('checked', 'checked');
                }

                var isChecked = $(self).hasClass('checkedAll');
                var subTickets = $('input[main-trans-id].chk-ticket-all:disabled:not([main-trans-id="0"])');
                subTickets.each(function () {
                    var mainTransId = this.attributes['main-trans-id'].value;
                    var item = $("input[type=checkbox][value=" + mainTransId + "]");
                    if (item.length > 0) {
                        $(this).attr('checked', isChecked);
                    }
                });

                ContextMenu.Helper.ShowWarningBetTradePaging();
                if (typeof event === 'undefined') {
                    event = window.event;
                }

                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            });
        },

        InitBetTradeTicket: function () {
            var lengthGroup = ContextMenu.Helper.groups.length;
            if (lengthGroup === 0) {
                return;
            }

            var lastedGroup = ContextMenu.Helper.groups[lengthGroup - 1];
            var lastedTicket = lastedGroup.Tickets[lastedGroup.Tickets.length - 1];
            ContextMenu.LastedTicket = lastedTicket;
            ContextMenu.LastedGroup = lastedGroup;
            var isShowWarningBetTradePaging = lastedTicket.Status.toLowerCase() !== 'sold' && !NapTicketControl.Helper.isSettledTicket(lastedTicket.Status) &&
                lastedTicket.Player.toLowerCase().indexOf('bettrade') !== -1;
            if (isShowWarningBetTradePaging) {
                var listTicket = $('.checkBoxItem');
                var lastedItem = listTicket[listTicket.length - 1];
                $(lastedItem).attr('id', 'lastedItem');
                if ($('#show-message-betTrade').length > 0) {
                    $('#show-message-betTrade').html(tooltip.show('pagination',
                        'Let it be noted that this BetTrade ticket has a "SOLD" ticket on the next page which will be voided also.')).show();
                }
            }

            for (var index = 0; index < lengthGroup; index++) {
                var group = ContextMenu.Helper.groups[index];
                var groupName = group.Name.toLowerCase().replace(/ /g, '-').replace(/\//g, '-').replace('(', '').replace(')', '');
                var isChecked = $("input[type=checkbox].chk-ticket-" + groupName).prop('checked');
                var subTickets = $('input[main-trans-id].chk-ticket-all:disabled:not([main-trans-id="0"])');
                subTickets.each(function () {
                    if ($(this).hasClass('chk-ticket-' + groupName) || $(this).hasClass(groupName)) {
                        $(this).attr('checked', isChecked);
                    }
                });
            }
        },

        ShowWarningBetTradePaging: function () {
            if ($('#lastedItem').is(':checked')) {
                if ($('#show-message-betTrade').length > 0) {
                    $('#show-message-betTrade').html(tooltip.show('pagination',
                        'Let it be noted that this BetTrade ticket has a "SOLD" ticket on the next page which will be voided also.')).show();
                }
            }
            else {
                $('#show-message-betTrade').hide();
            }
        },

        GetGroupName: function (group) {
            var lengthGroup = ContextMenu.Helper.groups.length;
            for (var index = 0; index < lengthGroup; index++) {
                var groupItem = ContextMenu.Helper.groups[index];
                var groupName = 'group-' + groupItem.Name.toLowerCase().replace(/ /g, '-').replace(/\//g, '-').replace('(', '').replace(')', '');
                console.log()
                if ($(group).hasClass(groupName)) {
                    return groupItem.Name.toLowerCase();
                }
            }
        },

        RenderCheckBoxAll: function (length) {
            var chkAllMenuHtml = '<div class="componentCheckBoxAll" id="componentCheckBoxAll" title="Select">';
            chkAllMenuHtml += '<span class="checkBoxAll" id="chk-ticket-all"></span>';
            chkAllMenuHtml += '<i class="contextMenu">&nbsp</i>';
            chkAllMenuHtml += '</div>';

            return chkAllMenuHtml;
        },

        ChangeCheckBoxAll: function () {
            var totalCheckBox = $('input[type=checkbox].checkBoxItem').not(':disabled').length;
            var totalChecked = $('.checkBoxItem:checked').not(':disabled').length;
            switch (totalChecked) {
                case 0:
                    $('.checkBoxAll').removeClass('checked');
                    $('.checkBoxAll').removeClass('checkedAll');
                    break;
                case totalCheckBox:
                    $('.checkBoxAll').removeClass('checked');
                    $('.checkBoxAll').addClass('checkedAll');
                    break;
                default:
                    $('.checkBoxAll').removeClass('checkedAll');
                    $('.checkBoxAll').addClass('checked');
                    break;
            }
        },

        CheckOrNotCheckBoxAll: function (isChecked) {
            if (isChecked) {
                $('.checkBoxAll').addClass('checkedAll');
                $('.checkBoxAll').removeClass('checked');
                $('.checkBoxItem').not(':disabled').attr('checked', 'checked');
            }
            else {
                $('.checkBoxAll').removeClass('checkedAll');
                $('.checkBoxAll').removeClass('checked');
                $('.checkBoxItem').removeAttr('checked', 'checked');
            }

            var subTickets = $('input[main-trans-id].chk-ticket-all:disabled:not([main-trans-id="0"])');
            subTickets.each(function () {
                $(this).attr('checked', isChecked);
            });

            ContextMenu.Helper.ShowWarningBetTradePaging();
        },

        showContextMenu: function (e) {
            var items = {};
            var isCheckedAll = $('.checkBoxAll').hasClass("checkedAll");
            var totalChecked = $('.checkBoxItem:checked').length;
            if ($('input[type=checkbox].checkBoxItem').not(':disabled').length === 0) {
                return;
            }

            if (totalChecked === 0) {
                isCheckedAll = false;
            }

            items.all = {
                name: 'All',
                className: isCheckedAll ? 'iconChecked' : '',
                callback: function () {
                    ContextMenu.Helper.CheckOrNotCheckBoxAll(!isCheckedAll);
                }
            };

            for (var index = 0; index < ContextMenu.Helper.groups.length; index++) {
                var group = ContextMenu.Helper.groups[index];
                var groupName = group.Name;
                var isChecked = $("input[type=checkbox].chk-ticket-" + groupName.toLowerCase()).prop('checked');

                items[groupName] = {
                    name: groupName,
                    className: isChecked ? 'iconChecked' : '',
                    callback: function (groupName) {
                        var checkBox = $("input[type=checkbox].chk-ticket-" + groupName.toLowerCase());
                        checkBox.toggleGroup();
                    }
                };
            }

            $.contextMenu('destroy');
            $.contextMenu({
                selector: '.componentCheckBoxAll',
                items: items,
                trigger: 'none',
                ignoreRightClick: true
            });

            e.preventDefault();
            var offset = $(".componentCheckBoxAll").offset();
            $(".componentCheckBoxAll").contextMenu({ x: offset.left, y: offset.top + 46 });
        }
    };
}(jQuery));