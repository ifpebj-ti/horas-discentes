# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia os arquivos de projeto individualmente
COPY Back.API/Back.API.csproj Back.API/
COPY Back.Application/Back.Application.csproj Back.Application/
COPY Back.Domain/Back.Domain.csproj Back.Domain/
COPY Back.Infrastructure/Back.Infrastructure.csproj Back.Infrastructure/
COPY Back.API/Back.sln .

# Restaura as dependências
RUN dotnet restore

# Copia todo o restante do código
COPY . .

# Publica o projeto principal
RUN dotnet publish Back.API/Back.API.csproj -c Release -o /app/out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copia os arquivos publicados da etapa de build
COPY --from=build /app/out .

# Define o entrypoint
ENTRYPOINT ["dotnet", "Back.API.dll"]
