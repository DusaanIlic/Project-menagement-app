#!/bin/bash

# Navigate to the Angular app directory and build it
cd app/Client
npm install
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Angular build failed."
    exit 1
fi

# Navigate back to the root directory
cd ../..

# Create the wwwroot directory if it doesn't exist
mkdir -p app/Server/Server/wwwroot

# Copy Angular build to Server/wwwroot
cp -r app/Client/dist/. app/Server/Server/wwwroot/

# Navigate to the .NET app directory and publish it
cd app/Server
dotnet publish -c Release -o ./publish

# Check if the publish was successful
if [ $? -ne 0 ]; then
    echo ".NET publish failed."
    exit 1
fi