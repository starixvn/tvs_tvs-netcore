using Microsoft.Extensions.DependencyInjection;
using NUglify.Css;
using NUglify.JavaScript;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class LayoutBundle
{
    public static void AddLayoutBundle(this IAssetPipeline pipeline, CssSettings cssSetting, CodeSettings scriptSetting)
    {
        //// style bundle
        pipeline.AddCssBundle("/old-page/bundle/layout-libs.css", cssSetting,
            "old-page/content/jquery-ui/jquery-ui-1.9.1.custom.min.css",
                            "old-page/content/jquery-ui/chosen.jquery.css",
                            "old-page/scripts/_libs/fanexgrid/fanex.grid.css",
                            "old-page/scripts/_libs/fanexgrid/fanex.pagination.css",
                            "old-page/scripts/_Libs/Validation/validationEngine.jquery.css",
                            "old-page/Content/BetList.css",
                            "old-page/Content/bullfighting.css",
                            "old-page/Scripts/_Libs/FanexGrid/Fanex.Pagination.css",
                            "old-page/Scripts/_Libs/TimePicker/jquery-ui-timepicker-addon.css",
                            "old-page/Scripts/_Libs/FanexMultipleSelect/fanex.multiSelect.css",
                            "old-page/Scripts/_Libs/ContextMenu/jquery.contextMenu.css",
                            "old-page/Scripts/_Libs/toastr/toastr.css");

        pipeline.AddLessBundle("/old-page/bundle/angular-old-styles.css", "old-page/content/base/styles.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/script-libs.js", scriptSetting,
                            "old-page/Scripts/_Libs/jQuery/jquery-1.8.2.js",
                            "old-page/Scripts/_Libs/jQuery/jquery-ui-1.9.1.js",
                            "old-page/Scripts/_Libs/jQuery/jquery.formattyping.js",
                            "old-page/Scripts/_Libs/jQuery/chosen.jquery.js",
                            "old-page/Scripts/_Libs/jQuery/jquery.validate.js",
                            "old-page/Scripts/_Libs/jQuery/jquery.validate.unobtrusive.js",
                            "old-page/Scripts/_Libs/Bootstrap/bootstrap-alert.js",
                            "old-page/Scripts/_Libs/Bootstrap/bootstrap-tooltip.js",
                            "old-page/Scripts/_Libs/Bootstrap/bootstrap-dropdown.js",
                            "old-page/Scripts/_Libs/BlockUI/jquery.blockUI.1.33.js",
                            "old-page/Scripts/_Libs/FanexMultipleSelect/fanex.multiSelect.js",
                            "old-page/Scripts/_Libs/FanexGrid/Fanex.Grid.js",
                            "old-page/Scripts/_Libs/FanexGrid/Fanex.Pagination.js",
                            "old-page/Scripts/_Libs/FormatLibs/NumberFormat/numeral.js",
                            "old-page/Scripts/NapTicketControl.js",
                            "old-page/Scripts/NapTicketControl.Helper.js",
                            "old-page/Scripts/Languages.js",
                            "old-page/Scripts/_Libs/ContextMenu/jquery.contextMenu.js",
                            "old-page/Scripts/_Libs/Validation/jquery.validationEngine-en.js",
                            "old-page/Scripts/_Libs/Validation/jquery.validationEngine.js",
                            "old-page/Scripts/_Libs/FanexGrid/Fanex.Pagination.js",
                            "old-page/Scripts/_Libs/Utils/date.format.js",
                            "old-page/Scripts/Languages/messages.js");
    }
}