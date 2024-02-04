# Stage 1: Build Angular app
FROM node:18 AS angular-build
WORKDIR /app
COPY client/ .  
RUN npm install
RUN npm run build 

# Stage 2: Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS dotnet-build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY API/*.csproj ./API/  
RUN dotnet restore API/API.csproj  

# Copy everything else and build
COPY API/ ./API/
RUN dotnet publish API -c Release -o out  

# Copy the Angular build artifacts to wwwroot
# Adjusted path to match the outputPath in angular.json
COPY --from=angular-build /app/dist/client /app/API/wwwroot  

# Stage 3: Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app

# Copy the appsettings files and the build output
COPY --from=dotnet-build /app/API/appsettings*.json .
COPY --from=dotnet-build /app/out .

ENTRYPOINT ["dotnet", "API.dll"]
