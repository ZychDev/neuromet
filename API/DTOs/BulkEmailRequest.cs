namespace API.DTOs
{
    public class BulkEmailRequest
    {
        public List<string> EmailAddresses { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }

}