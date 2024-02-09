using MimeKit;
using MimeKit.Utils;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        if (!IsValidEmail(to))
        {
            _logger.LogError($"Invalid email address format: {to}");
            throw new ArgumentException($"Invalid email address format: {to}", nameof(to));
        }

        var smtpSettings = _configuration.GetSection("EmailSettings");
        string fromMail = smtpSettings["SmtpUsername"];

        var emailMessage = new MimeMessage();
        emailMessage.From.Add(MailboxAddress.Parse(fromMail));
        emailMessage.To.Add(MailboxAddress.Parse(to));
        emailMessage.Subject = subject;
        
        var builder = new BodyBuilder();
        builder.HtmlBody = body;

        var image = builder.LinkedResources.Add("wwwroot/assets/aghLogo.png");
        image.ContentId = MimeUtils.GenerateMessageId();

        string footerTextLeft = "W imieniu Organizatorów:<br>dr hab. inż. Krzysztof Regulski, prof. AGH<br>tel.: (0-12) 617 41 31<br>e-mail: regulski@agh.edu.pl"; 
        string footerTextCenter = "Akademia Górniczo-Hutnicza w Krakowie<br>Wydział Inżynierii Metali i Informatyki Przemysłowej<br>http://www.isim.agh.edu.pl/";
        string footer = $@"
            <div style='text-align:center;'>
                <table style='width:100%'>
                    <tr>
                        <td style='width:33%; text-align:left;'>{footerTextLeft}</td>
                        <td style='width:33%; text-align:center;'>{footerTextCenter}</td>
                        <td style='width:33%; text-align:right;'><img src='cid:{image.ContentId}' alt='Footer Image' style='max-width:100px;'></td>
                    </tr>
                </table>
            </div>";

        builder.HtmlBody += footer;
        emailMessage.Body = builder.ToMessageBody();


        using (var smtpClient = new SmtpClient())
        {
            await smtpClient.ConnectAsync(smtpSettings["SmtpServer"], int.Parse(smtpSettings["SmtpPort"]), true);
            await smtpClient.AuthenticateAsync(fromMail, smtpSettings["SmtpPassword"]);
            await smtpClient.SendAsync(emailMessage);
            await smtpClient.DisconnectAsync(true);
            _logger.LogInformation($"Email sent successfully to {to}");
        }
    }



    public static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new MailboxAddress(email, email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }


}
