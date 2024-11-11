using Microsoft.Extensions.DependencyInjection;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class UploadBatchMessageBundle
{
    public static void AddUploadBatchMessageBundle(this IAssetPipeline pipeline)
    {
        //// style bundle
        pipeline.AddLessBundle("/old-page/bundle/upload-batch-message-style.css", "old-page/upload-batch-message/batch-message.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/upload-batch-message.js",
            "old-page/Scripts/_Libs/Utils/stdlib.js",
                            "old-page/Scripts/Common/Message.Helper.js",
                            "old-page/Scripts/Common/Message.Validator.js",
                            "old-page/Scripts/_Libs/AngularJS/Angular-1.2.29.js",
                            "old-page/upload-batch-message/angular-v1/app.js",
                            "old-page/upload-batch-message/angular-v1/upload-batch-message/app.js",
                            "old-page/upload-batch-message/angular-v1/upload-batch-message/upload-batch-message.js");
    }
}