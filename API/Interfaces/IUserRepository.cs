using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(LectureUser user);
        void Delete(LectureUser user);
        void Add(LectureUser user);
        void DeleteSpamAccount(SpamList user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<LectureUser>> GetUsersAsync();
        Task<LectureUser> GetUserByIdAsync(int id);
        Task<LectureUser> GetUserByUsernameAsync(string username);
        Task<IEnumerable<LectureUser>> GetMembersAsync();
        Task<LectureUser> GetMemberAsync(string username);
        Task<LectureUser> GetUserAsync(LectureUser userToDelete);
        Task<IEnumerable<SpamList>> GetSpamListMemberAsync();
        Task<SpamList> GetSpamMailAsync(string email);
    }
}