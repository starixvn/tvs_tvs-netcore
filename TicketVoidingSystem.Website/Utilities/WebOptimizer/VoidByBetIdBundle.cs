using Microsoft.Extensions.DependencyInjection;
using NUglify.JavaScript;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class VoidByBetIdBundle
{
    public static void AddVoidByBetIdBundle(this IAssetPipeline pipeline, CodeSettings scriptSetting)
    {
        //// style bundle
        pipeline.AddLessBundle("/old-page/bundle/void-by-bet-id-style.css", "old-page/void-by-bet-id/void-by-bet-id.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/void-by-bet-id.js", scriptSetting,
            "~/old-page/Scripts/_Libs/TimePicker/jquery-ui-timepicker-addon.js",
            "old-page/Scripts/_Libs/Utils/stdlib.js",
            "old-page/Scripts/_Libs/ContextMenu/jquery.contextMenu.js",
            "old-page/Scripts/_Libs/BootstrapMultiselect/bootstrap-multiselect.js",
            "old-page/Scripts/_Libs/BootstrapMultiselect/bootstrap-3.0.3.min.js",
            "old-page/Scripts/Common/Message.Helper.js",
            "old-page/Scripts/Common/Message.Validator.js",
            "old-page/Scripts/Common/ContextMenu.Helper.js",
            "old-page/void-by-bet-id/scripts/void-by-bet-id.js",
            "old-page/void-by-bet-id/scripts/sub-parlay-ticket.js");
    }
}