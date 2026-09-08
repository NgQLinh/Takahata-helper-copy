using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Queries
{
    public class MachinesByPermissionQuery : IRequest<ErrorOr<IEnumerable<MachineResponse>>>;
}
