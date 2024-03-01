namespace Server.Models;

public class TodoItemDTO
{
    public long Id { get; set; }
    public string? Content { get; set; }
    public bool Complete { get; set; }
}