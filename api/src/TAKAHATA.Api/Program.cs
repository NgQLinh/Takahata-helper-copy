using Hangfire;
using MediatR;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Serilog;
using Serilog.Events;
using TAKAHATA.Api;
using TAKAHATA.Api.Middleware;
using TAKAHATA.Application;
using TAKAHATA.Application.Account.Commands;
using TAKAHATA.Application.Common.Mapping;
using TAKAHATA.Application.Equipment.Commands;
using TAKAHATA.Application.Services;
using TAKAHATA.Domain.Common.Constant;
using TAKAHATA.Infrastructure;
using TAKAHATA.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()

    // KhÃ´ng ghi cÃ¡c log ná»™i bá»™ Microsoft á»Ÿ má»©c Information
    .MinimumLevel.Override(
        "Microsoft",
        LogEventLevel.Warning)

    // NhÆ°ng váº«n cho phÃ©p HTTP Logging ghi request á»Ÿ má»©c Information
    .MinimumLevel.Override(
        "Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware",
        LogEventLevel.Information)

    // KhÃ´ng ghi cÃ¡c cÃ¢u SQL bÃ¬nh thÆ°á»ng nhÆ° Executed DbCommand
    .MinimumLevel.Override(
        "Microsoft.EntityFrameworkCore.Database.Command",
        LogEventLevel.Warning)

    .Enrich.FromLogContext()

    .WriteTo.Console(
        outputTemplate:
        "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] " +
        "[CorrelationId:{CorrelationId}] " +
        "[{SourceContext}] " +
        "{Message:lj}{NewLine}{Exception}")

    .WriteTo.Logger(lc => lc
        .Filter.ByExcluding(e => e.Properties.ContainsKey("MachineLog"))
        .WriteTo.File(
            "Logs/app/log-.txt",
            rollingInterval: RollingInterval.Day,
            fileSizeLimitBytes: 10 * 1024 * 1024,
            rollOnFileSizeLimit: true,
            retainedFileCountLimit: 30,
            shared: true,
            flushToDiskInterval: TimeSpan.FromSeconds(1),
            outputTemplate:
                "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] " +
                "[CorrelationId:{CorrelationId}] " +
                "[{SourceContext}] " +
                "{Message:lj}{NewLine}{Exception}"))

    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(e => e.Properties.ContainsKey("MachineLog"))
        .WriteTo.File(
            "Logs/machine/machine-.log",
            rollingInterval: RollingInterval.Day,
            fileSizeLimitBytes: 10 * 1024 * 1024,
            rollOnFileSizeLimit: true,
            retainedFileCountLimit: 30,
            shared: true,
            flushToDiskInterval: TimeSpan.FromSeconds(1)))

    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();

const string CorsPolicy = "NextJsClient";

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddMappings();
builder.Services.AddApi();
builder.Services.AddApplication();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CMS API",
        Version = "v1"
    });

    options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using Bearer scheme."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("bearer", document)] = []
    });
});

builder.Services.AddHttpLogging(options =>
{
    // Request method, path, query, headers, body,
    // response headers, status, body vÃ  duration
    options.LoggingFields = HttpLoggingFields.All;

    // KhÃ´ng nÃªn Ä‘á»ƒ khÃ´ng giá»›i háº¡n
    options.RequestBodyLogLimit = 64 * 1024;
    options.ResponseBodyLogLimit = 64 * 1024;

    // Gá»™p request vÃ  response thÃ nh má»™t event
    options.CombineLogs = true;

    // Chá»‰ nhá»¯ng header Ä‘Æ°á»£c thÃªm vÃ o Ä‘Ã¢y má»›i hiá»‡n giÃ¡ trá»‹.
    // Header khÃ¡c nhÆ° Authorization sáº½ bá»‹ redact.
    options.RequestHeaders.Add("X-Correlation-ID");
    options.RequestHeaders.Add("User-Agent");
    options.RequestHeaders.Add("Content-Type");

    options.ResponseHeaders.Add("X-Correlation-ID");
    options.ResponseHeaders.Add("Content-Type");
});


var app = builder.Build();

// Automatically apply pending migrations on application startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

using (var scope = app.Services.CreateScope())
{
    var sender = scope.ServiceProvider.GetRequiredService<ISender>();
    var registerCommand = new CreateAccountCommand
    (
        "admin",
        "123@123Aa",
        "Admin",
        Role.Admin,
        []
    );
    var createDefaultMachineCommand = new CreateDefaultMachineCommand(true);
    await sender.Send(registerCommand);
    await sender.Send(createDefaultMachineCommand);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHangfireDashboard("/hangfire");

RecurringJob.AddOrUpdate<DailyJob>(
    recurringJobId: "daily-job-at-1am",
    methodCall: job => job.ExecuteAsync(),
    cronExpression: "0 1 * * *",
    options: new RecurringJobOptions
    {
        TimeZone = GetVietnamTimeZone()
    });


app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseRouting();

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<LoggingMiddleware>();

app.UseCors(CorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static TimeZoneInfo GetVietnamTimeZone()
{
    // Windows thÆ°á»ng sá»­ dá»¥ng "SE Asia Standard Time".
    if (OperatingSystem.IsWindows())
    {
        return TimeZoneInfo.FindSystemTimeZoneById(
            "SE Asia Standard Time");
    }

    // Linux vÃ  Docker thÆ°á»ng sá»­ dá»¥ng IANA timezone.
    return TimeZoneInfo.FindSystemTimeZoneById(
        "Asia/Ho_Chi_Minh");
}


