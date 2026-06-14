using TAKAHATA.Api.Services;
using TAKAHATA.Application.Common.Interface;

namespace TAKAHATA.Api
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApi(this IServiceCollection services)
        {
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            return services;
        }
    }
}
