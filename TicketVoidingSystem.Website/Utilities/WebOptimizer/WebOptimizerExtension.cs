using Microsoft.Extensions.DependencyInjection;
using NUglify.Css;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class WebOptimizerExtension
{
    public static void AddWebOptimizer(this IServiceCollection services)
    {
        services.AddWebOptimizer(pipeline =>
        {
            var cssSetting = new CssSettings { OutputMode = NUglify.OutputMode.SingleLine, CommentMode = CssComment.None };

            pipeline.AddLayoutBundle(cssSetting);
            pipeline.AddUploadBatchMessageBundle();
            pipeline.AddVoidByBetIdBundle();
            pipeline.AddCancelCashOutBundle();
            pipeline.AddRecoverCashOutBundle();
            pipeline.AddRecoverBetBundle();
            pipeline.AddRecoverParlayBetBundle();

            //// Minify all css and js files
            pipeline.MinifyCssFiles("old-page/**/*.css");
            pipeline.MinifyJsFiles("old-page/**/*.css");
        });
    }
}