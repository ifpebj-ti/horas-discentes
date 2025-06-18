# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia a solução e os arquivos de projeto
COPY ./Back.API/Back.sln ./Back.API/
COPY ./Back.API/Back.API.csproj ./Back.API/
COPY ./Back.Application/Back.Application.csproj ./Back.Application/
COPY ./Back.Domain/Back.Domain.csproj ./Back.Domain/
COPY ./Back.Infrastructure/Back.Infrastructure.csproj ./Back.Infrastructure/

# Define o diretório da solução para o restore
WORKDIR /app/Back.API
RUN dotnet restore

# Volta para o diretório raiz e copia tudo
WORKDIR /app
COPY . .

# Publica o projeto de entrada (Back.API)
RUN dotnet publish ./Back.API/Back.API.csproj -c Release -o /app/out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "Back.API.dll"]
