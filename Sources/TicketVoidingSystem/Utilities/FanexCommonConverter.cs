using System;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Utilities;

public static class FanexCommonConverter
{
    public static decimal ToDecimal(object item, decimal defaultValue = 0M)
    {
        var result = defaultValue;
        var flag = false;
        if (item != null && item != DBNull.Value)
        {
            flag = decimal.TryParse(item.ToString(), out result);
        }

        return !flag ? defaultValue : result;
    }

    public static string ConvertToXml<T>(Root<T> root)
    {
        var serializer = new XmlSerializer(typeof(Root<T>));
        var settings = new XmlWriterSettings
        {
            Indent = false,
            NewLineHandling = NewLineHandling.None,
            OmitXmlDeclaration = true
        };

        using var stringWriter = new StringWriter();
        using var xmlWriter = XmlWriter.Create(stringWriter, settings);
        serializer.Serialize(xmlWriter, root);
        return stringWriter.ToString();
    }
}