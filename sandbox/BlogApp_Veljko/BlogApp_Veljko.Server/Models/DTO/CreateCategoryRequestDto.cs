namespace BlogApp_Veljko.Server.Models.DTO
{
    public class CreateCategoryRequestDto
    {
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Content { get; set; }
        public string Author { get; set; }
    }
}
