using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using API.DTOs;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UsersController> _logger;


        public UsersController(IUserRepository userRepository, IMapper mapper, EmailService emailService, IConfiguration configuration, ILogger<UsersController> logger)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LectureUser>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("spam")]
        public async Task<ActionResult<IEnumerable<LectureUser>>> GetSpamMailUsers()
        {
            var users = await _userRepository.GetSpamListMemberAsync();
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<LectureUser>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteUser(LectureUser userToDelete)
        {
            var user = await _userRepository.GetUserAsync(userToDelete);

            if (user == null)
            {
                return NotFound();
            }

            _userRepository.Delete(user);

            if (await _userRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<LectureUser>> AddUser(LectureUser user)
        {
            _userRepository.Add(user);
            if (await _userRepository.SaveAllAsync()) 
            {
                await SendWelcomeEmail(user);
                return Ok(user);
            }

            return BadRequest("Failed to add user");
        }

        [HttpPost("sendemail")]
        public async Task<ActionResult> SendEmailAsync([FromBody] EmailRequest request)
        {
            try
            {
                await _emailService.SendEmailAsync(request.EmailAddress, request.Subject, request.Body);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid request: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email.");
                return BadRequest($"Failed to send email: {ex.Message}");
            }
        }

        [HttpPost("sendbulkemail")]
        public async Task<ActionResult> SendBulkEmailAsync([FromBody] BulkEmailRequest request)
        {
            try
            {
                foreach (var emailAddress in request.EmailAddresses)
                {
                    if (!EmailService.IsValidEmail(emailAddress))
                    {
                        _logger.LogError($"Invalid email address format: {emailAddress}");
                        continue;
                    }
                    await _emailService.SendEmailAsync(emailAddress, request.Subject, request.Body);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send bulk emails.");
                return BadRequest($"Failed to send emails: {ex.Message}");
            }
        }


        private async Task SendWelcomeEmail(LectureUser user)
        {
            var subject = "Potwierdzenie rejestracji na wydarzenie Neuromet 2024";
            var body = "Drogi uczestniku, \n Z przyjemnością informujemy, że Twoja rejestracja na wydarzenie Neuromet została pomyślnie przetworzona. Serdecznie dziękujemy za zainteresowanie i nie możemy się doczekać, aby się z Tobą spotkać! \nZ poważaniem, Zespół organizacyjny Neuromet";
            await _emailService.SendEmailAsync(user.EmailAddress, subject, body);
        }


    }

}