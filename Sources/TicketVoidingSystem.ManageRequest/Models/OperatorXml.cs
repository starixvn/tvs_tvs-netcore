using System.Xml.Serialization;

namespace TicketVoidingSystem.ManageRequest.Models;

[XmlRoot(ElementName = "r")]
public class OperatorXml
{
    [XmlAttribute(AttributeName = "OperatorId")]
    public int OperatorId { get; set; }

    [XmlAttribute(AttributeName = "TypeId")]
    public byte TypeId { get; set; }
}

[XmlRoot(ElementName = "root")]
public class RootOperatorsXml
{
    [XmlElement(ElementName = "r")]
    public List<OperatorXml> OperatorXmls { get; set; } = [];
}