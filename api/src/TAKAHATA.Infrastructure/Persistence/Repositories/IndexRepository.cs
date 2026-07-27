using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Contracts.IndexAndPart;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class IndexRepository : BaseRepository<Index>, IIndexRepository
    {
        private readonly IMapper _mapper;

        public IndexRepository(AppDbContext dbContext, IMapper mapper) : base(dbContext)
        {
            _mapper = mapper;
        }

        public async Task<Index?> GetAsync(string indexCode)
        {
            return _dbContext.Indexes.FirstOrDefault(e => e.Code == indexCode);
        }

        public async Task<bool> IsExistedAsync(string indexCode)
        {
            var index = await _dbContext.Indexes.FirstOrDefaultAsync(x => x.Code == indexCode);
            return index != null;
        }

        public async Task<bool> IsExistedAsync(long id, string indexCode)
        {
            var index = await _dbContext.Indexes.FirstOrDefaultAsync(x => x.Id != id && x.Code == indexCode);
            return index != null;
        }

        public async Task<SearchResponse<List<IndexResponse>>> SearchAsync(string? keyword, int? page, int? pageSize)
        {
            var query = _dbContext.Indexes
             .AsNoTracking()
             .AsQueryable();


            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var searchText = keyword.Trim();

                query = query.Where(x =>
                    x.Code.Contains(searchText));
            }

            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Clamp(pageSize ?? 10, 1, 100);

            var totalItems = await query.CountAsync();

            var values = await query
                .OrderByDescending(x => x.CreateAt)
                    .ThenBy(x => x.Id)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Select(e => new IndexResponse
                {
                    Id = e.Id,
                    Code = e.Code,
                    CreateAt = e.CreateAt,
                    CreateBy = e.CreateBy,
                    UpdateAt = e.UpdateAt,
                    UpdateBy = e.UpdateBy,
                    CountPart = e.Parts != null ? e.Parts.Count : 0
                })
                .ToListAsync();

            return new SearchResponse<List<IndexResponse>>(
                       currentPage,
                       currentPageSize,
                       totalItems,
                       values);
        }
    }
}
