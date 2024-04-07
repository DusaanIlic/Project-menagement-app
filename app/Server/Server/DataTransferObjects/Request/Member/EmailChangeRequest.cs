namespace Server.DataTransferObjects.Request.Member
{
    public class EmailChangeRequest
    {
        public string Password { get; set; }
        public string NewEmail { get; set; }
    }
}
