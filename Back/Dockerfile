FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Back.API/Back.sln Back.API/
COPY Back.API/Back.API.csproj Back.API/
COPY Back.Application/Back.Application.csproj Back.Application/
COPY Back.Domain/Back.Domain.csproj Back.Domain/
COPY Back.Infrastructure/Back.Infrastructure.csproj Back.Infrastructure/

WORKDIR /src/Back.API
RUN dotnet restore "Back.sln"

COPY Back.API/. Back.API/
COPY Back.Application/. Back.Application/
COPY Back.Domain/. Back.Domain/
COPY Back.Infrastructure/. Back.Infrastructure/

RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Back.API.dll"]
