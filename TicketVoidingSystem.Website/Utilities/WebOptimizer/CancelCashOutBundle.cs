using Microsoft.Extensions.DependencyInjection;
using NUglify.JavaScript;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class CancelCashOutBundle
{
    public static void AddCancelCashOutBundle(this IAssetPipeline pipeline, CodeSettings scriptsetting)
    {
        //// style bundle
        pipeline.AddLessBundle("/old-page/bundle/cancel-cash-out-style.css", "old-page/cancel-cash-out/cancel-cash-out.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/cancel-cash-out.js", scriptsetting,
            "old-page/scripts/_libs/bootstrap-datepicker/bootstrap-datepicker.js",
            "old-page/scripts/_libs/Moment/moment-2.24.0.js",
            "old-page/scripts/_libs/ContextMenu/jquery.contextMenu.js",
            "old-page/scripts/Common/Message.Helper.js",
            "old-page/scripts/Common/Message.Validator.js",
            "old-page/scripts/Common/ContextMenu.Helper.js",
            "old-page/cancel-cash-out/scripts/cancel-cash-out.directive.js",
            "old-page/cancel-cash-out/scripts/cancel-cash-out.js",
            "old-page/cancel-cash-out/scripts/cancel-cash-out.service.js",
            "old-page/cancel-cash-out/scripts/cancel-cash-out.validation.js");
    }
}