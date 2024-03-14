namespace Server.Services.EmailService
{
  using Server.DataTransferObjects;
  ﻿using MailKit.Net.Smtp;
  using MailKit.Security;
  using MimeKit;
  using MimeKit.Text;
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            this._configuration = configuration;
        }
        public void SendEmail(EmailDTO request)
        {
          var email = new MimeMessage();
          email.From.Add(MailboxAddress.Parse(_configuration["EmailService:EmailUsername"]));
          email.To.Add(MailboxAddress.Parse(request.To));
          email.Subject = request.Subject;
          email.Body = new TextPart(TextFormat.Html) { Text = request.Body };

          using var smtp = new SmtpClient();
          smtp.Connect(_configuration["EmailService:EmailHost"], 587, SecureSocketOptions.StartTls);
          smtp.Authenticate(_configuration["EmailService:EmailUsername"], _configuration["EmailService:EmailPassword"]);
          smtp.Send(email);
          smtp.Disconnect(true);
        }
    }
}
