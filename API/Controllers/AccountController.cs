using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Mail;
using System.Collections.Generic;
using System.Linq;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly EmailService _emailService;

        public AccountController(DataContext context, ITokenService tokenService, EmailService emailService)
        {
            _tokenService = tokenService;
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.EmailAddress))
            {
                return BadRequest("Email address is already registered.");
            }
            var user = new LectureUser
            {
                FirstName = registerDto.FirstName,
                SecondName = registerDto.SecondName,
                EmailAddress = registerDto.EmailAddress,
                University = registerDto.University,
                Presentation = registerDto?.Presentation
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            await SendWelcomeEmail(user);

            return new UserDto
            {
                Username = user.FirstName,
                Token = _tokenService.CreateTokenLecture(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.UsersRoot
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpGet("users")]      
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(user => new RegisterDto
                {
                    FirstName = user.FirstName,
                    SecondName = user.SecondName,
                    EmailAddress = user.EmailAddress,
                    University = user.University,
                    Presentation = user.Presentation
                })
                .ToListAsync();

            return Ok(users);
        }

        private async Task SendWelcomeEmail(LectureUser user)
        {
            var subject = "Potwierdzenie rejestracji na wydarzenie Neuromet 2024";
            var body = $"Drogi uczestniku,\r\n\r\n" +
                    "Z przyjemnością informujemy, że Twoja rejestracja na wydarzenie Neuromet 2024 została pomyślnie przetworzona. " +
                    "Z poważaniem,\r\n" +
                    "Zespół organizacyjny Neuromet";
            await _emailService.SendEmailAsync(user.EmailAddress, subject, body);
        }

        private async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.EmailAddress == email);
        }

    }
}