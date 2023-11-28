using Microsoft.Extensions.DependencyInjection;
using NUglify.Css;
using NUglify.JavaScript;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class WebOptimizerExtension
{
    public static void RegisterWebOptimizer(this IServiceCollection services)
    {
        services.AddWebOptimizer(pipeline =>
        {
            var cssSetting = new CssSettings { OutputMode = NUglify.OutputMode.SingleLine, CommentMode = CssComment.None };
            var scriptSetting = new CodeSettings { MinifyCode = true };

            pipeline.AddLayoutBundle(cssSetting, scriptSetting);
            pipeline.AddUploadBatchMessageBundle(scriptSetting);
            pipeline.AddVoidByBetIdBundle(scriptSetting);
            pipeline.AddCancelCashOutBundle(scriptSetting);
        });
    }
}