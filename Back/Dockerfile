# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./ /src/Back

WORKDIR /src/Back/Back.API

RUN dotnet restore "Back.sln"

RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Back.API.dll"]