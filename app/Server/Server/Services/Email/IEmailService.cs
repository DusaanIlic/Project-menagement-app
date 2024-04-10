namespace Server.Services.EmailService
{
  using Server.DataTransferObjects;

    public interface IEmailService
    {
        bool SendEmail(EmailDTO request);
    }
}
