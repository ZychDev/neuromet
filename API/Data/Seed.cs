using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Data
{
    public class Seed
    {
        private readonly IConfiguration _configuration;
        
        public Seed(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public static async Task SeedUsersRoot(DataContext context, IConfiguration configuration)
        {
            if (await context.UsersRoot.AnyAsync()) return;

            var username = configuration["RootUser:Username"];
            var password = configuration["RootUser:Password"];

            using var hmac = new HMACSHA512();
            var userRootProfile = new AppUser
            {
                UserName = username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
                PasswordSalt = hmac.Key
            };

            context.UsersRoot.Add(userRootProfile);
            await context.SaveChangesAsync();
            await SeedSpamList(context);

        }

        private static async Task SeedSpamList(DataContext context)
        {
            if (await context.SpamLists.AnyAsync()) return;

            var spamData = await File.ReadAllTextAsync("Data/spamMail.json");
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var spams = JsonSerializer.Deserialize<List<SpamList>>(spamData, options);
            
            foreach (var spam in spams)
            {
                var Spam = new SpamList
                {
                    Mail = spam.Mail,
                };
                context.SpamLists.Add(Spam);
            }

            await context.SaveChangesAsync();
        }
    }
}
