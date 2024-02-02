using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks; 
using Microsoft.Extensions.Configuration;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpSettings = _configuration.GetSection("EmailSettings");

        string fromMail = smtpSettings["SmtpUsername"];
        string fromPassword = smtpSettings["SmtpPassword"];

        MailMessage message = new MailMessage();
        message.From = new MailAddress(fromMail);
        message.Subject = subject;
        message.To.Add(new MailAddress(to));

        LinkedResource footerImage = new LinkedResource("wwwroot/assets/aghLogo.png", MediaTypeNames.Image.Jpeg)
        {
            ContentId = Guid.NewGuid().ToString(),
            TransferEncoding = TransferEncoding.Base64
        };

        string footerTextLeft = "W imieniu Organizatorów:<br>dr hab. inż. Krzysztof Regulski, prof. AGH<br>tel.: (0-12) 617 41 31<br>e-mail: regulski@agh.edu.pl"; 
        string footerTextCenter = "Akademia Górniczo-Hutnicza w Krakowie<br>Wydział Inżynierii Metali i Informatyki Przemysłowej<br>http://www.isim.agh.edu.pl/";
        string footer = $@"
            <div style='text-align:center;'>
                <table style='width:100%'>
                    <tr>
                        <td style='width:33%; text-align:left;'>{footerTextLeft}</td>
                        <td style='width:33%; text-align:center;'>{footerTextCenter}</td>
                        <td style='width:33%; text-align:right;'><img src='cid:{footerImage.ContentId}' alt='Footer Image' style='max-width:100px;'></td>
                    </tr>
                </table>
            </div>";

        string emailContent = body + footer;
        AlternateView alternateView = AlternateView.CreateAlternateViewFromString(emailContent, null, MediaTypeNames.Text.Html);

        alternateView.LinkedResources.Add(footerImage);

        message.AlternateViews.Add(alternateView);
        message.IsBodyHtml = true;

        var smtpClient = new SmtpClient(smtpSettings["SmtpServer"])
        {
            Port = int.Parse(smtpSettings["SmtpPort"]),
            Credentials = new NetworkCredential(fromMail, fromPassword),
            EnableSsl = true,
        };

        await smtpClient.SendMailAsync(message);
    }

    public string ImageToBase64(string imagePath)
    {
        byte[] imageArray = System.IO.File.ReadAllBytes(imagePath);
        string base64String = Convert.ToBase64String(imageArray);
        return base64String.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""); // Remove any line breaks
    }


}
