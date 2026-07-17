using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Serilog;
using TAKAHATA.Api;
using TAKAHATA.Api.Middleware;
using TAKAHATA.Application;
using TAKAHATA.Application.Account.Commands;
using TAKAHATA.Application.Common.Mapping;
using TAKAHATA.Application.Equipment.Commands;
using TAKAHATA.Domain.Common.Constant;
using TAKAHATA.Infrastructure;
using TAKAHATA.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .Enrich.WithThreadId()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        fileSizeLimitBytes: 10 * 1024,
        retainedFileCountLimit: 30,
        outputTemplate:
        "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] " +
        "[CorrelationId:{CorrelationId}] " +
        "{Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


builder.Services.AddControllers();
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
        Role.Admin
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

app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<LoggingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
