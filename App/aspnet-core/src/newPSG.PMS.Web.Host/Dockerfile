FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base

WORKDIR /app
COPY . .

ENTRYPOINT ["dotnet", "newPSG.PMS.Web.Host.dll"]