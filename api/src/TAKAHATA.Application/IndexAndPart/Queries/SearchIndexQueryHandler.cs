using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class SearchIndexQueryHandler : IRequestHandler<SearchIndexQuery, ErrorOr<SearchResponse<List<IndexResponse>>>>
    {
        private readonly IIndexRepository _indexRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public SearchIndexQueryHandler(IIndexRepository indexRepository, UserManager<ApplicationUser> userManager)
        {
            _indexRepository = indexRepository;
            _userManager = userManager;
        }

        public async Task<ErrorOr<SearchResponse<List<IndexResponse>>>> Handle(
            SearchIndexQuery request,
            CancellationToken cancellationToken)
        {
         var response = await _indexRepository.SearchAsync(
             request.Keyword,
             request.Page,
             request.PageZie);

            var users = _userManager.Users.ToList();

            response.Data.ForEach(item =>
            {
                var createdUser = users.FirstOrDefault(u => u.Id == item.CreateBy);
                if (createdUser != null)
                    item.CreateBy = createdUser.FullName;

                var updatedUser = users.FirstOrDefault(u => u.Id == item.UpdateBy);
                if (updatedUser != null)
                    item.UpdateBy = updatedUser.FullName;
            });

            return response;
        }
    }
}
