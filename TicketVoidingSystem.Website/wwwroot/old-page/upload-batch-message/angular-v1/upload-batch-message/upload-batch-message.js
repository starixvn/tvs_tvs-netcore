(function (angular) {
    'use strict';

    angular
        .module('app.uploadBatchMessage')
        .controller('UploadBatchMessageController', UploadBatchMessageController);

    UploadBatchMessageController.$inject = ['$http'];
    function UploadBatchMessageController($http) {
        var vm = this;
        vm.MaxTransIdPerBatch = 1000;
        vm.products = getProducts();
        vm.creditTrans = [];
        init();

        function init() {
            $('#fsMessage').show();

            NapTicketControl.Helper.MaxTransIdPerBatch = vm.MaxTransIdPerBatch;
            NapTicketControl.Helper.InitNumberGroup();
        }

        function getProducts() {
            $http.get("UploadBatchMessage/BatchMessage/GetProducts").success(function (data) {
                vm.products = data;
            });
        }

        vm.onGroup = function (groupName) {
            var products = vm.products;
            angular.forEach(products, function (product) {
                product.IsChecked = product.Name === groupName ? true : false;
            });

            $('.value-number-invalid').each(function () {
                $(this).removeClass("value-number-invalid").addClass("value-number");
            });
        };

        vm.clearBetID = function () {
            $(':input[type=text]').val('');
            $('.item-number').remove();
        };

        vm.clearMessage = function () {
            $('.msg-void-ticket').val('');
        };

        vm.updateBatchMessage = function (event) {
            var transIDs = vm.getTransId();
            var productIds = vm.getProductIds();
            var messageType = vm.getMessageType();

            if (!vm.checkValidateParam(productIds, transIDs, messageType)) {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }

            vm.checkVoidedTrainsId(productIds, transIDs);
        };

        vm.checkVoidedTrainsId = function (productIds, transIDs) {
            var data = {
                transIDs: transIDs,
                productIds: productIds,
                groupName: vm.getGroupName()
            };
            var url = "UploadBatchMessage/BatchMessage/CheckTransIds";

            $http.post(url, data).then(function (response) {
                var result = response.data;
                var invalidTransIds = result.InvalidTransId;
                vm.creditTrans = result.CreditTrans;
                if (invalidTransIds !== null && invalidTransIds.length > 0) {
                    vm.showInvalidTransIds(invalidTransIds);
                }

                vm.showTooltipInvalidTransIds();
                vm.updateMessage();
            });
        };

        vm.updateMessage = function () {
            var transIds = vm.getTransId();
            var messageType = vm.getMessageType();
            if (transIds === '' || messageType === '') {
                return;
            }

            var data = {
                message: {
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
                creditTrans: vm.creditTrans,
                messageContentType: messageType
            };

            var url = "UploadBatchMessage/BatchMessage/UpdateMessage";
            $http.post(url, data).then(function successCallback(response) {
                var result = response.data;
                if (result.ErrorCode === 0) {
                    $('#txtTransId').val('');
                    $(".value-number").each(function () {
                        $(this).parent().remove();
                    });
                }

                vm.showPopupMessage(result);
            });
        };

        vm.showPopupMessage = function (result) {
            var message;
            if (result.ErrorCode > 0) {
                message = '<div class="msg-fail row">&nbsp;<div class="icon-warning-sign"></div>&nbsp;<div class="span23"><span>' +
                                result.ErrorMsg + '</span></div></div>';
            } else {
                message = '<div class="msg-success row">&nbsp;<div class="icon-ok"></div>&nbsp;<div class="span23"><span>' +
                                result.ErrorMsg + '</span></div></div>';
            }

            $("#show-message").empty();
            $("#show-message").append(message);
            $("#show-message").dialog({
                dialogClass: "no-close",
                resizable: false,
                width: 860,
                autoResize: true,
                position: { my: "center", at: "center", of: window }
            });
        };

        vm.showTooltipInvalidTransIds = function () {
            $('#msg-box').hide();
            if ($('.value-number-invalid').length > 0) {
                $('#msg').html(tooltip.show('errorBetId', messages.hightlightInvalidBetId)).show();
            }
        };

        vm.showInvalidTransIds = function (invalidTransIds) {
            var arrayInvalidTransId = invalidTransIds.split(',');
            $('.value-number').each(function () {
                for (var index = 0; index < arrayInvalidTransId.length; index++) {
                    var a = arrayInvalidTransId[index];
                    var b = $(this).text();
                    if (a === b) {
                        $(this).removeClass("value-number");
                        $(this).addClass("value-number-invalid");
                        break;
                    }
                }
            });
        };

        vm.checkValidateParam = function (productIds, transIDs, messageType) {
            if (productIds === "") {
                var groupChecked = $('input[name=group]:checked').val();
                var inputGroup = "group-" + groupChecked;
                $('#msg').html(tooltip.show(inputGroup, messages.selectProduct)).show();
                return false;
            }

            if (transIDs === "") {
                if ($('.value-number-invalid').length > 0) {
                    $('#msg').html(tooltip.show('errorBetId', messages.hightlightInvalidBetId)).show();
                }
                else {
                    $('#msg').html(tooltip.show('errorBetId', messages.betIdRequired)).show();
                }

                return false;
            }

            if (messageType === "") {
                $('#msg').html(tooltip.show('ddl-message-type', messages.pleaseSelect)).show();
                return false;
            }

            if (!Message.Validator.validateMessageConstraints()) {
                return false;
            }

            return true;
        };

        vm.getGroupName = function () {
            var groupName = '';
            var products = vm.products;
            angular.forEach(products, function (product) {
                groupName = product.IsChecked ? product.Name : groupName;
            });

            return groupName;
        };

        vm.getProductIds = function () {
            return $('.product-id:checkbox:checked').map(function () {
                return this.value;
            }).get().join(',');
        };

        vm.getTransId = function () {
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
        };

        vm.getMessageType = function () {
            return $('#ddl-message-type').val();
        };
    }
})(angular);