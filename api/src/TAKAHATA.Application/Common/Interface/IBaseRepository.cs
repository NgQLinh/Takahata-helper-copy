using TAKAHATA.Domain.Common;

namespace TAKAHATA.Application.Common.Interface
{
    public interface IBaseRepository<TEntity>
        where TEntity : Entity
    {
        Task<TEntity?> GetByIdAsync(int id);

        Task<TEntity> AddAsync(
            TEntity entity,
            CancellationToken cancellationToken = default);

        Task<TEntity?> UpdateAsync(
            TEntity entity,
            CancellationToken cancellationToken = default);

        Task<TEntity?> DeleteByIdAsync(
            int id,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyCollection<TEntity>> UpdateManyAsync(
            IEnumerable<TEntity> entities,
            CancellationToken cancellationToken = default);
    }
}
