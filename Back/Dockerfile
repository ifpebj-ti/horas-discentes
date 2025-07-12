# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia tudo do projeto
COPY . .

# Define a pasta onde está o .sln
WORKDIR /src/Back/Back.API

# Restaura os pacotes
RUN dotnet restore "Back.sln"

# Publica a aplicação
RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Back.API.dll"]
