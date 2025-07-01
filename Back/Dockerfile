# Stage 1: restore & build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 1) Copia só os arquivos de projeto + solução para usar cache no restore
COPY Back/Back.API/Back.sln .
COPY Back/Back.API/Back.API.csproj ./Back.API/
COPY Back/Back.Application/Back.Application.csproj ./Back.Application/
COPY Back/Back.Domain/Back.Domain.csproj ./Back.Domain/
COPY Back/Back.Infrastructure/Back.Infrastructure.csproj ./Back.Infrastructure/

# 2) Restore da solução inteira
RUN dotnet restore Back.sln

# 3) Copia todo o restante do código
COPY . .

# 4) Publica em RELEASE
RUN dotnet publish Back/Back.API/Back.API.csproj -c Release -o /app/out

# Stage 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Back.API.dll"]
