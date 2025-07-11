# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiando os arquivos corretamente usando caminhos com prefixo Back/
COPY Back/Back.API/Back.sln Back.API/
COPY Back/Back.API/Back.API.csproj Back.API/
COPY Back/Back.Application/Back.Application.csproj Back.Application/
COPY Back/Back.Domain/Back.Domain.csproj Back.Domain/
COPY Back/Back.Infrastructure/Back.Infrastructure.csproj Back.Infrastructure/

# Restaura os pacotes
WORKDIR /src/Back.API
RUN dotnet restore "Back.sln"

# Copia o restante dos códigos-fonte
COPY Back/Back.API/. Back.API/
COPY Back/Back.Application/. Back.Application/
COPY Back/Back.Domain/. Back.Domain/
COPY Back/Back.Infrastructure/. Back.Infrastructure/

# Publica a aplicação
RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Back.API.dll"]
