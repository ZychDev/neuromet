using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LectureUser>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
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
                return Ok(user);
            }

            return BadRequest("Failed to add user");
        }


    }

}