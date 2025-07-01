# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia a solução e os arquivos de projeto
COPY Back/Back.sln ./
COPY Back/Back.API/Back.API.csproj Back.API/
COPY Back/Back.Application/Back.Application.csproj Back.Application/
COPY Back/Back.Domain/Back.Domain.csproj Back.Domain/
COPY Back/Back.Infrastructure/Back.Infrastructure.csproj Back.Infrastructure/

# Restaura as dependências
RUN dotnet restore Back.sln

# Copia o restante do código
COPY Back/. ./


# Publica a aplicação
RUN dotnet publish Back.API/Back.API.csproj -c Release -o /app/out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
EXPOSE 5000
ENTRYPOINT ["dotnet", "Back.API.dll"]
