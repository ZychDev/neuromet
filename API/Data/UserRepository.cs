using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void Add(LectureUser user)
        {
            _context.Users.Add(user);
        }

        public void Delete(LectureUser user)
        {
            _context.Users.Remove(user);
        }

        public async Task<LectureUser> GetMemberAsync(string firstname)
        {
            return await _context.Users
                .Where(x => x.FirstName == firstname)
                .ProjectTo<LectureUser>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<LectureUser>> GetMembersAsync()
        {
            var users = await _context.Users
                .Select(user => new LectureUser
                {
                    FirstName = user.FirstName,
                    SecondName = user.SecondName,
                    EmailAddress = user.EmailAddress,
                    University = user.University,
                    Presentation = user.Presentation
                })
                .ToListAsync();

            return users;
        }


        public async Task<LectureUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<LectureUser> GetUserByUsernameAsync(string firstName)
        {
            return await _context.Users
                .SingleOrDefaultAsync(x => x.FirstName == firstName);
        }

        public async Task<IEnumerable<LectureUser>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(LectureUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<LectureUser> GetUserAsync(LectureUser userToDelete)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.FirstName == userToDelete.FirstName
                                        && u.SecondName == userToDelete.SecondName
                                        && u.EmailAddress == userToDelete.EmailAddress
                                        && u.University == userToDelete.University
                                        );
        }
    }
}