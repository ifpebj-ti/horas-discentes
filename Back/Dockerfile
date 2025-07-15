# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia tudo da raiz do projeto
COPY . .

# Vai até onde está a solução
WORKDIR /src/Back/Back.API

# Restaura a solução
RUN dotnet restore "Back.sln"

# Publica o projeto
RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Back.API.dll"]
