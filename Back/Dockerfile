# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos de projeto para restaurar dependências
COPY Back/Back.sln Back/
COPY Back/Back.API/Back.API.csproj Back/Back.API/
COPY Back/Back.Application/Back.Application.csproj Back/Back.Application/
COPY Back/Back.Domain/Back.Domain.csproj Back/Back.Domain/
COPY Back/Back.Infrastructure/Back.Infrastructure.csproj Back/Back.Infrastructure/

# Restaura os pacotes
WORKDIR /src/Back
RUN dotnet restore Back.sln

# Copia o restante do código
COPY Back/. ./

# Publica o projeto
RUN dotnet publish Back.API/Back.API.csproj -c Release -o /app/out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Back.API.dll"]
