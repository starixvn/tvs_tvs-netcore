using System.Collections.Generic;
using System.Xml.Serialization;

namespace TicketVoidingSystem.Models;

[XmlRoot("root")]
public class Root<T>
{
    [XmlElement("r")]
    public List<T> Rows { get; set; }
}