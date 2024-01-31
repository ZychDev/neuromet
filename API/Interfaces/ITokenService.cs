using API.Entities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
        string CreateTokenLecture(LectureUser user);

    }
}