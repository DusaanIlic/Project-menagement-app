namespace Server.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string? Content { get; set; }
    public bool Complete { get; set; }
}