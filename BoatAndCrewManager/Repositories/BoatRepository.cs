﻿using Havbruksloggen_Coding_Challenge.BoatAndCrewManager.Models.Database;
using Havbruksloggen_Coding_Challenge.BoatAndCrewMemberManager.Models.Database.Entities;

namespace Havbruksloggen_Coding_Challenge.BoatAndCrewManager.Repositories
{
    public interface IBoatRepository
    {
        public void Create(BoatEntity entity);
        public List<BoatEntity> GetAll();
        public List<BoatEntity> List(int page, int itemsPerPage);
    }
    public class BoatRepository : IBoatRepository
    {
        private BoatAndCrewDbContext _context;
        public BoatRepository(BoatAndCrewDbContext context)
        {
            _context = context;
        }

        public void Create(BoatEntity entity)
        {
            _context.Boats.Add(entity);
            _context.SaveChanges();
        }

        public List<BoatEntity> GetAll()
        {
            return _context.Boats.ToList();
        }

        public List<BoatEntity> List(int page, int itemsPerPage)
        {
            return _context.Boats
                .Skip((page - 1) * 10)
                .Take(itemsPerPage)
                .ToList(); ;
        }
    }
}