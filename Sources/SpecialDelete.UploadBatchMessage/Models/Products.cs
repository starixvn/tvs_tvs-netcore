namespace SpecialDelete.UploadBatchMessage.Models;

using System.Collections.Generic;

public class Products
{
    public List<Group> Groups { get; set; }
}

public class Group
{
    public string Name { get; set; }

    public bool IsChecked { get; set; }

    public List<Product> Products { get; set; }
}

public class Product
{
    public string Name { get; set; }

    public int Value { get; set; }
}