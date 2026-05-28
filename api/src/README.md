## Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

## Build or Update Migrations

```bash
dotnet ef migrations add InitialCreate --project ./TAKAHATA.Infrastructure/ --startup-project ./TAKAHATA.Api/ --output-dir Persistence/Migrations
dotnet ef database update --project ./TAKAHATA.Infrastructure/ --startup-project ./TAKAHATA.Api/
```

## Docker

```bash
docker compose up -d
```
