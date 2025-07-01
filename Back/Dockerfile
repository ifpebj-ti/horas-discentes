# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia csproj e restaura dependências
COPY Back/*.csproj ./Back/
WORKDIR /src/Back
RUN dotnet restore

# Copia o restante do projeto
COPY Back/. ./

# Publica o projeto
RUN dotnet publish -c Release -o /app/out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
EXPOSE 5000
ENTRYPOINT ["dotnet", "Back.dll"]
