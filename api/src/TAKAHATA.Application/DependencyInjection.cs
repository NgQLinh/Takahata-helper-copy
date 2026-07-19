using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TAKAHATA.Application.Common.Behaviors;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Application.Services;

namespace TAKAHATA.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(typeof(DependencyInjection).Assembly);

            services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            services.AddSingleton<IMachinePollingManager, MachinePollingManager>();

            services.AddHostedService<MachinePollingBackgroundService>();

            return services;
        }
    }
}
