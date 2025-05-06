# Stage de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
RUN echo "Conteúdo de /src antes da cópia do Back:"
RUN ls -al /src
COPY ["Back/Back.csproj", "Back/"]
RUN dotnet restore "Back/Back.csproj"
COPY . .
WORKDIR "/src/Back"
RUN echo "Conteúdo de /src/Back antes do build:"
RUN ls -al .
RUN dotnet build "Back.csproj" -c Release -o /app/build

# Stage de publicação
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS publish
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Back.dll"]