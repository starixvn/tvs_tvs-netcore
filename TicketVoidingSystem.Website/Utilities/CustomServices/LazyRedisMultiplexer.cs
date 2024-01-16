using StackExchange.Redis;
using System;

namespace TicketVoidingSystem.Website.Utilities.CustomServices;

using Fanex.Logging;
using TicketVoidingSystem.Services;

public static class LazyRedisMultiplexer
{
    private static ConnectionMultiplexer redis;
    private static readonly object multiplexerLock = new();

    private static void ConnectRedis()
    {
        try
        {
            var redisConfig = GetRedisConfig();
            var oldRedis = redis;

            redis = ConnectionMultiplexer.Connect(redisConfig);
            redis.ConfigurationChanged += Redis_ConfigurationChanged;
            redis.ConfigurationChangedBroadcast += Redis_ConfigurationChangedBroadcast;
            redis.ConnectionFailed += Redis_ConnectionFailed;
            redis.ConnectionRestored += Redis_ConnectionRestored;
            redis.InternalError += Redis_InternalError;
            redis.ErrorMessage += Redis_ErrorMessage;
            redis.HashSlotMoved += Redis_HashSlotMoved;
            if (oldRedis != null)
            {
                oldRedis.Close();
            }
        }
        catch (Exception e)
        {
            Logger.Log.Error("ConnectionMultiplexer.Connect error.", e);
        }
    }

    private static void Redis_HashSlotMoved(object sender, HashSlotMovedEventArgs e)
    {
        Logger.Log.Error("Redis_InternalError:" + e.OldEndPoint + "-" + e.NewEndPoint + "-" + e.HashSlot);
    }

    private static void Redis_ErrorMessage(object sender, RedisErrorEventArgs e)
    {
        Logger.Log.Error("Redis_InternalError:" + e.Message);
    }

    private static void Redis_InternalError(object sender, InternalErrorEventArgs e)
    {
        Logger.Log.Error("Redis_InternalError:" + e.Exception?.Message);
    }

    private static void Redis_ConnectionRestored(object sender, ConnectionFailedEventArgs e)
    {
        Logger.Log.Error("Redis_ConnectionRestored:" + e.Exception?.Message);
    }

    private static void Redis_ConnectionFailed(object sender, ConnectionFailedEventArgs e)
    {
        Logger.Log.Error("Redis_ConnectionFailed:" + e.Exception?.Message);
    }

    private static void Redis_ConfigurationChangedBroadcast(object sender, EndPointEventArgs e)
    {
        Logger.Log.Error("Redis_ConfigurationChangedBroadcast:" + e.EndPoint.ToString());
    }

    private static void Redis_ConfigurationChanged(object sender, EndPointEventArgs e)
    {
        Logger.Log.Error("Redis_ConfigurationChangedBroadcast:" + e.EndPoint.ToString());
    }

    private static ConnectionMultiplexer RedisMultiplexer
    {
        get
        {
            lock (multiplexerLock)
            {
                if (redis is not { IsConnected: true })
                {
                    ConnectRedis();
                }

                return redis;
            }
        }
    }

    public static IDatabase GetDatabase()
    {
        return RedisMultiplexer.GetDatabase();
    }

    public static ConfigurationOptions GetRedisConfig()
    {
        var redisConfig = new ConfigurationOptions();
        redisConfig.EndPoints.Add(AppSettingService.AppSetting.RedisConfig.EndPoint);
        redisConfig.Password = AppSettingService.AppSetting.RedisConfig.Password;
        redisConfig.DefaultDatabase = AppSettingService.AppSetting.RedisConfig.DefaultDatabase;
        redisConfig.ConnectRetry = 1000;
        redisConfig.ConnectTimeout = 5000;
        redisConfig.SyncTimeout = 30000;
        redisConfig.AsyncTimeout = 30000;
        redisConfig.AbortOnConnectFail = false;

        return redisConfig;
    }

}