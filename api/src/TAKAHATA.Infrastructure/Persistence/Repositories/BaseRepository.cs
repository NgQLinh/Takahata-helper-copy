using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Domain.Common;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : Entity
    {
        protected readonly AppDbContext _dbContext;
        protected readonly DbSet<TEntity> DbSet;

        protected BaseRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
            DbSet = dbContext.Set<TEntity>();
        }

        public virtual async Task<TEntity?> GetByIdAsync(long id)
        {
            return await DbSet.FindAsync(id);
        }

        public virtual async Task<TEntity> AddAsync(
            TEntity entity,
            CancellationToken cancellationToken = default)
        {
            await DbSet.AddAsync(entity, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return entity;
        }

        public virtual async Task<TEntity?> UpdateAsync(
            TEntity entity,
            CancellationToken cancellationToken = default)
        {
            DbSet.Update(entity);

            var affectedRows =
                await _dbContext.SaveChangesAsync(cancellationToken);

            return affectedRows > 0 ? entity : null;
        }

        public virtual async Task<IReadOnlyCollection<TEntity>> UpdateManyAsync(
            IEnumerable<TEntity> entities,
            CancellationToken cancellationToken = default)
        {
            var entityList = entities.ToList();

            if (!entityList.Any())
                return Array.Empty<TEntity>();

            DbSet.UpdateRange(entityList);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return entityList;
        }

        public virtual async Task<TEntity?> DeleteByIdAsync(
            long id,
            CancellationToken cancellationToken = default)
        {
            var entity = await DbSet.FindAsync(
                new object[] { id },
                cancellationToken);

            if (entity is null)
            {
                return null;
            }

            DbSet.Remove(entity);

            var affectedRows =
                await _dbContext.SaveChangesAsync(cancellationToken);

            return affectedRows > 0 ? entity : null;
        }
    }
}
