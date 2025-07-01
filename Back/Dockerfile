# Etapa de build com SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1) Copia TODO o repositório
COPY . .

# 2) Roda restore e publish no projeto API
WORKDIR /src/Back/Back.API
RUN dotnet restore
RUN dotnet publish Back.API.csproj -c Release -o /app/out

# Etapa de runtime mais enxuta
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Back.API.dll"]
