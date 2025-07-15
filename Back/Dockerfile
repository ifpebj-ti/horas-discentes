# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia tudo da raiz do projeto
COPY . .

# Debug: mostra a estrutura copiada (opcional)
RUN ls -la /src && ls -la /src/Back.API

# Vai até onde está o .sln
WORKDIR /src/Back.API

# Restaura a solução
RUN dotnet restore "Back.sln"

# Publica a API
RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Back.API.dll"]
