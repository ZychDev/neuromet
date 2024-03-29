using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<LectureUser> Users { get; set; }
        public DbSet<AppUser> UsersRoot { get; set; }
        public DbSet<SpamList> SpamLists { get; set; }
        public DbSet<SeminarArchive> SeminarArchives { get; set; }

    }
}