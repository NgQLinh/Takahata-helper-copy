using Microsoft.EntityFrameworkCore;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Infrastructure.Persistence;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Services
{
    public static class SampleDataSeeder
    {
        public static async Task SeedAsync(
            AppDbContext dbContext)
        {
            Console.WriteLine("Seeding indexes...");

            await SeedIndexesAsync(dbContext);

            Console.WriteLine("Seeding parts...");

            await SeedPartsAsync(dbContext);

            Console.WriteLine("Seeding part processes...");

            await SeedPartProcessesAsync(dbContext);

            Console.WriteLine("Seed completed.");
        }

        private static async Task SeedIndexesAsync(AppDbContext dbContext)
        {
            if (await dbContext.Indexes.AnyAsync())
                return;

            const int totalIndexes = 2_000;

            var random = new Random(2026);

            var indexes = new List<Index>(totalIndexes);

            for (var i = 1; i <= totalIndexes; i++)
            {
                indexes.Add(new Index
                {
                    Code = $"IDX-{i:D6}",
                    CreateAt = RandomDate2026(random),
                    CreateBy = "Seeder"
                });
            }

            await dbContext.Indexes.AddRangeAsync(indexes);
            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedPartsAsync(AppDbContext dbContext)
        {
            const int totalParts = 200_000;
            const int totalIndexes = 2_000;
            const int batchSize = 10_000;

            var random = new Random(202601);

            dbContext.ChangeTracker.AutoDetectChangesEnabled = false;

            try
            {
                for (var start = 1; start <= totalParts; start += batchSize)
                {
                    var count = Math.Min(batchSize, totalParts - start + 1);

                    var parts = new List<Part>(count);

                    for (var offset = 0; offset < count; offset++)
                    {
                        var partNumber = start + offset;

                        // Phân bố tương đối đều 1 triệu part cho 2000 Index
                        var indexId = ((partNumber - 1) % totalIndexes) + 1;

                        var quantity = random.Next(1, 11);

                        parts.Add(new Part
                        {
                            IndexId = indexId,
                            Code = $"PART-{partNumber:D7}",
                            Quantity = quantity,
                            ProcessedQuantity = random.Next(0, quantity + 1),
                            Status = RandomProcessStatus(random),
                            Prioritize = random.NextDouble() < 0.1,
                            PartType = RandomPartType(random),
                            CreateAt = RandomDate2026(random),
                            CreateBy = "Seeder",
                        });
                    }

                    await dbContext.Parts.AddRangeAsync(parts);
                    await dbContext.SaveChangesAsync();

                    dbContext.ChangeTracker.Clear();

                    Console.WriteLine(
                        $"Parts: {Math.Min(start + count - 1, totalParts):N0}/{totalParts:N0}"
                    );
                }
            }
            finally
            {
                dbContext.ChangeTracker.AutoDetectChangesEnabled = true;
            }
        }

        private static async Task SeedPartProcessesAsync(AppDbContext dbContext)
        {
            const int totalParts = 200_000;
            const int processesPerPart = 8;

            // 2,000 part mỗi batch
            // => 16,000 PartProcess / batch
            const int partBatchSize = 2_000;

            var random = new Random(202602);

            dbContext.ChangeTracker.AutoDetectChangesEnabled = false;

            try
            {
                for (
                    var partStart = 1;
                    partStart <= totalParts;
                    partStart += partBatchSize)
                {
                    var partCount = Math.Min(
                        partBatchSize,
                        totalParts - partStart + 1);

                    var processes =
                        new List<PartProcess>(
                            partCount * processesPerPart);

                    for (var p = 0; p < partCount; p++)
                    {
                        var partId = partStart + p;

                        var createAt = RandomDate2026(random);

                        for (
                            var sequence = 1;
                            sequence <= processesPerPart;
                            sequence++)
                        {
                            processes.Add(new PartProcess
                            {
                                PartId = partId,
                                MachineId = random.Next(1, 25),
                                Sequence = sequence,
                                WorkingTime = Math.Round(random.NextDouble() * 470 + 10, 2),
                                SetupTime = Math.Round(random.NextDouble() * 85 + 5, 2),
                                WaitingTime = Math.Round(random.NextDouble() * 240, 2),
                                ProgrammingTime = Math.Round(random.NextDouble() * 120, 2),
                                AssemblyTime = Math.Round(random.NextDouble() * 180, 2),
                                MeasurementTime = Math.Round(random.NextDouble() * 60, 2),
                                ProcessedQuantity = random.Next(0, 11),
                                WorkerNote = random.NextDouble() < 0.1 ? "Sample worker note" : string.Empty,
                                CreateAt = createAt.AddMinutes(sequence),
                                PlantDate = new DateOnly(createAt.Year, createAt.Month, createAt.Day),
                                StartTime = createAt,
                                EndTime = createAt.AddDays(0.5),
                                EstimatedTime = Math.Round(random.NextDouble() * 500 + 10, 2),
                                Status = ProcessStatus.Completed,
                                Note = "Gia công",
                                CreateBy = "Seeder"
                            });
                        }
                    }

                    await dbContext.PartProcesses
                        .AddRangeAsync(processes);

                    await dbContext.SaveChangesAsync();

                    dbContext.ChangeTracker.Clear();

                    var completedParts =
                        Math.Min(
                            partStart + partCount - 1,
                            totalParts);

                    var completedProcesses =
                        completedParts * processesPerPart;

                    Console.WriteLine(
                        $"PartProcesses: " +
                        $"{completedProcesses:N0}/8,000,000");
                }
            }
            finally
            {
                dbContext.ChangeTracker.AutoDetectChangesEnabled = true;
            }
        }

        private static ProcessStatus RandomProcessStatus(Random random)
        {
            var values = Enum.GetValues<ProcessStatus>();

            return values[random.Next(values.Length)];
        }

        private static PartType RandomPartType(Random random)
        {
            var values = Enum.GetValues<PartType>();

            return values[random.Next(values.Length)];
        }

        private static DateTime RandomDate2026(Random random)
        {
            var start = new DateTime(2026, 1, 1, 0, 0, 0);
            var end = new DateTime(2026, 12, 31, 23, 59, 59);

            var range = end - start;

            return start.AddSeconds(
                random.NextInt64(0, (long)range.TotalSeconds)
            );
        }
    }
}
