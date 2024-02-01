using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsersRoot(DataContext context)
        {
            if (await context.UsersRoot.AnyAsync()) return;

                using var hmac = new HMACSHA512();
                var userRootProfile = new AppUser
                {
                    UserName = "GAmqgZkgjhJn8xK1JRqz",
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("HM5OFBGSh8659f0cRKMU")),
                    PasswordSalt = hmac.Key
                };
                context.UsersRoot.Add(userRootProfile);

            await context.SaveChangesAsync();

        }
    }
}













