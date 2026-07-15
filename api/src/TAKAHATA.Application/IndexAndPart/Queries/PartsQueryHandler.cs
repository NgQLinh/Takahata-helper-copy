using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class PartsQueryHandler : IRequestHandler<PartsQuery, ErrorOr<SearchResponse<List<PartResponse>>>>
    {
        private readonly IMapper _mapper;

        private readonly IPartRepository _partRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public PartsQueryHandler(
            IPartRepository partRepository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            _partRepository = partRepository;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<ErrorOr<SearchResponse<List<PartResponse>>>> Handle(
            PartsQuery request,
            CancellationToken cancellationToken)
        {

            var response = await _partRepository.SearchAsync(
                 request.SearchText,
                 request.Statuses,
                 request.PlantFrom,
                 request.PlantTo,
                 request.ActualFrom,
                 request.ActualTo,
                 request.Page,
                 request.PageSize);


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
