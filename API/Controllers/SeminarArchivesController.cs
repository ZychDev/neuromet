using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

[Route("api/[controller]")]
[ApiController]
public class SeminarArchivesController : ControllerBase
{
    private readonly DataContext _context;

    public SeminarArchivesController(DataContext context)
    {
        _context = context;
    }

    // GET: api/SeminarArchives
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeminarArchive>>> GetSeminarArchives()
    {
        return await _context.SeminarArchives
            .Include(sa => sa.Presentations)
            .ToListAsync();
    }

    // // GET: api/SeminarArchives/5
    // [HttpGet("{year}")]
    // public async Task<ActionResult<SeminarArchive>> GetSeminarArchiveByYear(int year)
    // {
    //     var seminarArchive = await _context.SeminarArchives
    //         .Include(sa => sa.Presentations)
    //         .FirstOrDefaultAsync(sa => sa.Year == year);

    //     if (seminarArchive == null)
    //     {
    //         return NotFound();
    //     }

    //     return seminarArchive;
    // }
}
