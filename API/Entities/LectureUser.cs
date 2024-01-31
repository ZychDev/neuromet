using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class LectureUser
    {        
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string EmailAddress { get; set; }
        public string University { get; set; }
        public string Presentation {get; set; }

    }
}