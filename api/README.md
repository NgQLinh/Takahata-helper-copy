## Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

## Build or Update Migrations

```bash
dotnet ef migrations add InitialCreate --project ./src/TAKAHATA.Infrastructure/ --startup-project ./src/TAKAHATA.Api/ --output-dir Persistence/Migrations
dotnet ef migrations add update-db-260803-001 --project ./src/TAKAHATA.Infrastructure/ --startup-project ./src/TAKAHATA.Api/ --output-dir Persistence/Migrations


dotnet ef database update --project ./src/TAKAHATA.Infrastructure/ --startup-project ./src/TAKAHATA.Api/
```

## Docker

```bash
docker compose up -d
```
