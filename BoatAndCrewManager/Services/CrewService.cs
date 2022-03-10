﻿using Havbruksloggen_Coding_Challenge.BoatAndCrewManager.Models.Responses;
using Havbruksloggen_Coding_Challenge.BoatAndCrewManager.Models.Validation;
using Havbruksloggen_Coding_Challenge.BoatAndCrewManager.Repositories;
using Havbruksloggen_Coding_Challenge.BoatAndCrewMemberManager.Models.Database.Entities;
using Havbruksloggen_Coding_Challenge.Shared.Services;

namespace Havbruksloggen_Coding_Challenge.BoatAndCrewManager.Services
{
    public interface ICrewService
    {
        public CrewMemberResponse Create(CreateCrewMemberSchema model);
        public List<CrewMemberResponse> GetAll();
        public List<CrewMemberResponse> List(int page, int itemsPerPage);
        CrewMemberResponse Update(CreateCrewMemberSchema model, string id);
        public void Delete(string id);
    }

    public class CrewService: ICrewService
    {
        private readonly ICrewRepository _crewRepository;
        private readonly PathMaker _pathMaker;
        public CrewService(ICrewRepository crewRepository, PathMaker pathMaker)
        {
            _crewRepository = crewRepository;
            _pathMaker = pathMaker;
        }

        // todo usually these Image methods should be in a seperate helper since they are duplicate from BoatService
        private string SaveImage(string base64, string extension)
        {
            string[] parts = base64.Split("base64,");
            byte[] bytes = Convert.FromBase64String(parts[1]);
            var timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssffff");
            var path = _pathMaker.MakePath($"{timeStamp}.{extension}");
            using (FileStream fs = new FileStream(path, FileMode.CreateNew))
            {
                fs.Write(bytes);
            }

            return path;
        }


        private string GetBase64Image(string path)
        {
            byte[] buffer;
            using (FileStream fs = new FileStream(path, FileMode.Open))
            {
                buffer = new byte[fs.Length];
                fs.Read(buffer, 0, buffer.Length);
            }

            return Convert.ToBase64String(buffer);
        }
        public CrewMemberResponse Create(CreateCrewMemberSchema model)
        {
            CrewMemberResponse response = new CrewMemberResponse();
            try
            {
                var path = SaveImage(model.Picture, model.PictureName.Split(".").Last());
                CrewMemberEntity entity = new CrewMemberEntity()
                {
                    Name = model.Name,
                    Email = model.Email,
                    Age = model.Age,
                    BoatId = Guid.Parse(model.BoatId),
                    Role = model.Role,
                    CertifiedUntil = DateOnly.FromDateTime(model.CertifiedUntil.Date),
                    PicturesPath = path
                };

                _crewRepository.Create(entity);
                var pictureName = Path.GetRelativePath(_pathMaker.GetDirectoryPath(), entity.PicturesPath);
                response = new CrewMemberResponse()
                {
                    Id = entity.Id.ToString(),
                    Name = entity.Name,
                    Email = entity.Email,
                    Age = entity.Age,
                    BoatId = entity.BoatId.ToString(),
                    CertifiedUntil = entity.CertifiedUntil,
                    Role = entity.Role,
                    Picture = GetBase64Image(entity.PicturesPath),
                    PictureName = pictureName,
                    PictureType = MimeTypes.GetMimeType(pictureName)
                };
            }
            catch (Exception e)
            {
                // todo log exception in the database
                Console.WriteLine(e);
                throw;
            }

            return response;
        }

        public List<CrewMemberResponse> GetAll()
        {
            var list = _crewRepository.GetAll();
            List<CrewMemberResponse> response = new List<CrewMemberResponse>();
            foreach (var entity in list)
            {
                var pictureName = Path.GetRelativePath(_pathMaker.GetDirectoryPath(), entity.PicturesPath);
                var mimeType = MimeTypes.GetMimeType(pictureName);
                var item = new CrewMemberResponse()
                {
                    Id = entity.Id.ToString(),
                    Name = entity.Name,
                    Age = entity.Age,
                    Email = entity.Email,
                    Role = entity.Role,
                    CertifiedUntil = entity.CertifiedUntil,
                    Picture = $"data: {mimeType};base64, {GetBase64Image(entity.PicturesPath)}",
                    PictureName = pictureName,
                    PictureType = mimeType

                };
                response.Add(item);
            }

            return response;
        }

        public List<CrewMemberResponse> List(int page, int itemsPerPage)
        {
            throw new NotImplementedException();
        }

        public CrewMemberResponse Update(CreateCrewMemberSchema model, string id)
        {
            throw new NotImplementedException();
        }

        public void Delete(string id)
        {
            throw new NotImplementedException();
        }
    }
}
