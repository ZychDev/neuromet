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
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class SeminarController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly EmailService _emailService;
        private readonly IUserRepository _userRepository;

        public SeminarController(IUserRepository userRepository, DataContext context, ITokenService tokenService, EmailService emailService)
        {
            _tokenService = tokenService;
            _context = context;
            _emailService = emailService;
            _userRepository = userRepository;
        }

        [HttpGet]      
        public async Task<ActionResult<IEnumerable<UserDto>>> GetSeminarArchives()
        {
            var seminarArchives = await _userRepository.GetSeminarAsync();
            return Ok(seminarArchives);
        }


    }
}