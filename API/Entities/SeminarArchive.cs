using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SeminarArchive
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Date {get; set;}
        public List<Presentation> Presentations { get; set; }
    }
}