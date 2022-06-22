/* File Created: January 28, 2013 */

"use strict";

var NapTicketControl = (function ($) {
    var MessageType = {
        Success: 1,
        Warning: 2,
        Error: 3
    };

    return {
        miniMenu: null,

        init: function () {
            NapTicketControl.miniMenu = $('header .mini-menu').change(function () {
                window.location.replace($(this).val());
            });

            $(document).on("mousedown", function () {
                $('#msg').hide();
                $('#show-message-betTrade').hide();
            });

            $('header .mini-menu').val(window.location.pathname);
            $('.user-info').mouseenter(NapTicketControl.Helper.hoverMenuProfile).mouseleave(NapTicketControl.Helper.leaveMenuProfile);
        },

        registerEvent: function () {
            $('.user-info').hover(
                function () {
                    $(this).addClass("open");
                }, function () {
                    $(this).removeClass("open");
                }
            );
        },

        disableInput: function () {
            $.blockUI();
        },

        enableInput: function () {
            $.unblockUI();
        },

        popUp: {
            arrayHighLightControl: [],
            show: function (message, targets, messageType) {
                NapTicketControl.NapTicketControlPopUp
                    .removeClass("err")
                    .removeClass("info")
                    .empty()
                    .text(message);

                var bodyWith = $('body').width();
                var popUpWidth = NapTicketControl.NapTicketControlPopUp.width();
                var leftPosition = Math.round((bodyWith - popUpWidth) / 2);
                NapTicketControl.NapTicketControlPopUp.css("left", leftPosition);
                if (typeof messageType === 'undefined') {
                    NapTicketControl.NapTicketControlPopUp
                        .addClass("err")
                        .append('<a class="close" title="Close Message" href="javascript:NapTicketControl.popUp.hide();"></a>');

                    if (typeof targets !== 'undefined') {
                        NapTicketControl.popUp.highLightControl(targets);
                    }
                } else {
                    switch (messageType) {
                        case MessageType.Success:
                            NapTicketControl.NapTicketControlPopUp.addClass("info");
                            setTimeout(function () {
                                NapTicketControl.NapTicketControlPopUp.hide();
                            }, 4000);
                            break;
                        case MessageType.Warning:
                            break;
                        case MessageType.Error:
                            break;
                    }
                }

                NapTicketControl.NapTicketControlPopUp.show();
            },

            hide: function () {
                NapTicketControl.NapTicketControlPopUp.hide();
            },

            highLightControl: function (targets) {
                var controlIds = targets.split(',');
                for (var i = 0; i < controlIds.length; i++) {
                    var controlId = controlIds[i];
                    if (controlId.indexOf("#") < 0) {
                        controlId = "#" + controlId;
                    }
                    NapTicketControl.popUp.arrayHighLightControl.push(controlId);
                    $(controlId).addClass("input-validation-error");
                }
            },

            removeHighLight: function () {
                var controlIds = NapTicketControl.popUp.arrayHighLightControl;
                for (var i = 0; i < controlIds.length; i++) {
                    $(controlIds[i]).removeClass("input-validation-error");
                }
                NapTicketControl.popUp.arrayHighLightControl = [];
                NapTicketControl.popUp.hide();
            }
        },

        showMessageBox: function (type, msg) {
            var msgbox = $('#msg-box');

            if (msgbox.length === 0) {
                msgbox = $(
                    '<div class="alert alert-error" id="msg-box">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<div class="alert-content">' +
                        '</div>' +
                        '</div>').prependTo('body');
            }

            msgbox.attr('class', type).find('.alert-content').html(msg);
            msgbox.fadeIn();
        },

        ShowPopUp: function (url, title, width, height, reloadOnClose, callBack, marginRight, popupId, params) {
            var id = popupId ? popupId : 'windowPopup';
            var Form = document.createElement("div");
            var DivContent = document.createElement("div");

            var margin = '30px';

            if (marginRight) {
                margin = marginRight + 'px';
            }

            Form.setAttribute('id', id);
            Form.setAttribute('style', 'display: block; border: none; font-size:12px; z-index:999999;margin-right: ' + margin);

            DivContent.setAttribute('style', 'height: ' + (height - 80) + 'px');

            var divFrame = document.createElement("div");

            divFrame.setAttribute('style', 'height: ' + (height - 80) + 'px; margin-left: 5px; margin-right: ' + margin);
            divFrame.setAttribute('id', 'frame');

            DivContent.appendChild(divFrame);
            Form.appendChild(DivContent);

            var data = null;

            if (params) {
                data = params;
            }

            $.ajax({ url: url, data: data }).done(function (data) {
                if (data.ErrorCode !== null && data.ErrorCode.toString() === "1") {
                    DivContent.innerHTML = data.ErrorMessage.formatErrorMessage();
                }
                else {
                    DivContent.innerHTML = data;
                }

                document.body.appendChild(Form);
                $('#' + id).dialog({
                    title: title,
                    height: height,
                    width: width,
                    resizable: false,
                    draggable: true,
                    modal: true,
                    autoOpen: true,
                    position: { my: "center", at: "center", of: window },
                    close: function () {
                        NapTicketControl.ClosePopUp(reloadOnClose);
                    }
                });

                if (callBack && typeof callBack === 'function') {
                    callBack();
                }
            });
        },

        ClosePopUp: function (reload, delay, popupId) {
            var delayTime = delay ? delay : 100;
            var id = popupId ? popupId : 'windowPopup';

            reload && location.reload(true);

            var timeout = setTimeout(function () {
                $('#' + id).remove();
                clearTimeout(timeout);
            }, delayTime);
        },

        xhrDownloadFile: function (url, params) {
            NapTicketControl.disableInput();
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var downloadUrl = window.URL.createObjectURL(xhr.response);
                    var disposition = xhr.getResponseHeader('Content-Disposition').replace(/"/g, '');
                    var fileName = disposition.split('filename=');
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    a.href = downloadUrl;
                    a.download = fileName[1];
                    a.click();
                    NapTicketControl.enableInput();
                    a.parentNode.removeChild(a);
                }
            };
            xhr.responseType = 'blob';
            xhr.send(JSON.stringify(params));
        },

        MessageNotAllowExportExcel: function () {
            var html = `<div class="msg-fail row">&nbsp;
                <div class="span16">
                    <span>
                        Not allow to export large file. Please contact IT for help. Thank you!
                    </span>
                </div>
            </div>`;
            var width = 600;
            $("#show-message").empty();
            $("#show-message").append(html);
            $("#show-message").dialog({
                dialogClass: "no-close",
                resizable: false,
                width: width,
                autoResize: true,
                position: [($(window).width() - width) / 2, 240]
            });
        }
    };
}(jQuery));

$(document).ready(function () {
    NapTicketControl.init();
    NapTicketControl.registerEvent();
});