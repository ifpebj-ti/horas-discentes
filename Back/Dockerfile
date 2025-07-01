# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia toda a pasta Back com a estrutura completa
COPY Back/ ./Back/

# Entra na pasta Back
WORKDIR /src/Back

# Restaura os pacotes
RUN dotnet restore Back.sln

# Publica o projeto
RUN dotnet publish Back.API/Back.API.csproj -c Release -o /app/out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Back.API.dll"]
