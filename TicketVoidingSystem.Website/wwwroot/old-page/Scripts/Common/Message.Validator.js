/*global  tooltip, Message: true*/
"use strict";

if (Message === undefined) {
    Message = {};
}

Message.Validator = (function ($) {
    return {
        validateMessageConstraints: function () {
            if ($("#msg-en").val().toString() === "") {
                $('#msg').html(tooltip.show('msg-en', 'You must enter English message')).show();
                return false;
            }
            if ($("#msg-en").val().indexOf("@@") < 0) {
                $('#msg').html(tooltip.show('msg-en', 'You must include @@ in English message for replacing ticket number')).show();
                return false;
            }
            if ($("#msg-ch").val().toString() === "") {
                $('#msg').html(tooltip.show('msg-ch', 'You must enter Chinese Traditional message')).show();
                return false;
            }
            if ($("#msg-ch").val().indexOf("@@") < 0) {
                $('#msg').html(tooltip.show('msg-ch', 'You must include @@ in Chinese Traditional message for replacing ticket number')).show();
                return false;
            }

            if ($("#msg-cs").val().toString() === "") {
                $('#msg').html(tooltip.show('msg-cs', 'You must enter Chinese Simplified message')).show();
                return false;
            }
            if ($("#msg-cs").val().indexOf("@@") < 0) {
                $('#msg').html(tooltip.show('msg-cs', 'You must include @@ in Chinese Simplified message for replacing ticket number')).show();
                return false;
            }
            if ($("#msg-zhcn").val().toString() === "") {
                $('#msg').html(tooltip.show('msg-zhcn', 'You must enter New Chinese Simplified message')).show();
                return false;
            }
            if ($("#msg-zhcn").val().indexOf("@@") < 0) {
                $('#msg').html(tooltip.show('msg-zhcn', 'You must include @@ in New Chinese Simplified message for replacing ticket number')).show();
                return false;
            }

            if ($("#msg-th").val().toString() !== '' && $("#msg-th").val().indexOf("@@") < 0) {
                Message.Helper.showMoreMessage();
                $('#msg').html(tooltip.show('msg-th', 'You must include @@ in Thai message for replacing ticket number')).show();
                return false;
            }

            if ($("#msg-ko").val().toString() !== '' && $("#msg-ko").val().indexOf("@@") < 0) {
                Message.Helper.showMoreMessage();
                $('#msg').html(tooltip.show('msg-ko', 'You must include @@ in Korean message for replacing ticket number')).show();
                return false;
            }

            if ($("#msg-jp").val().toString() !== '' && $("#msg-jp").val().indexOf("@@") < 0) {
                Message.Helper.showMoreMessage();
                $('#msg').html(tooltip.show('msg-jp', 'You must include @@ in Japanese message for replacing ticket number')).show();
                return false;
            }
            if ($("#msg-it").val().toString() !== '' && $("#msg-it").val().indexOf("@@") < 0) {
                Message.Helper.showMoreMessage();
                $('#msg').html(tooltip.show('msg-it', 'You must include @@ in Italian message for replacing ticket number')).show();
                return false;
            }

            if ($("#msg-es").val().toString() !== '' && $("#msg-es").val().indexOf("@@") < 0) {
                Message.Helper.showMoreMessage();
                $('#msg').html(tooltip.show('msg-es', 'You must include @@ in Spanish message for replacing ticket number')).show();
                return false;
            }

            return true;
        }
    };
}(jQuery));