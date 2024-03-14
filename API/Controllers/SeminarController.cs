using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;

[ApiController]
public class SeminarController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IUserRepository _userRepository;

    public SeminarController(DataContext context, IUserRepository userRepository)
    {
        _context = context;
        _userRepository = userRepository;
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<SeminarArchive>>> GetSeminarArchives()
    {
            var seminarArchives = await _userRepository.GetSeminarAsync();
            return Ok(seminarArchives);
    }

}
