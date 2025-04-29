# Stage de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Back/Back.csproj", "Back/"]
RUN dotnet restore "Back/Back.csproj"
COPY . .
WORKDIR "/src/Back"
RUN dotnet build "Back.csproj" -c Release -o /app/build

# Stage de publicação
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS publish
WORKDIR /app
COPY --from=build /app/build .
ENTRYPOINT ["dotnet", "Back.dll"]