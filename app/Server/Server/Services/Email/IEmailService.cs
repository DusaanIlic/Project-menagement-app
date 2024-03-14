namespace Server.Services.EmailService
{
  using Server.DataTransferObjects;

    public interface IEmailService
    {
        void SendEmail(EmailDTO request);
    }
}
