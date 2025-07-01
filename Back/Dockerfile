FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Back/Back.API/Back.sln", "Back.API/"]
COPY ["Back/Back.API/Back.API.csproj", "Back.API/"]
COPY ["Back/Back.Application/Back.Application.csproj", "Back.Application/"]
COPY ["Back/Back.Domain/Back.Domain.csproj", "Back.Domain/"]
COPY ["Back/Back.Infrastructure/Back.Infrastructure.csproj", "Back.Infrastructure/"]

RUN dotnet restore "Back.API/Back.sln"

COPY . .

WORKDIR "/src/Back.API"
RUN dotnet publish "Back.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Back.API.dll"]
