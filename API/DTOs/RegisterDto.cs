using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string SecondName { get; set; }

        [Required]
        public string EmailAddress { get; set; }

        [Required]
        public string University { get; set; }
        
        public string Presentation { get; set; }
    }
}