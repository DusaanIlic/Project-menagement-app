namespace BlogApp_Veljko.Server.Models.Domain
{
    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Content { get; set; }
        public string Author { get; set; }
    }
}
