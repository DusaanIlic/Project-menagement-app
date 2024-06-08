#!/bin/bash

SERVER_USER="logic_tenacity"
SERVER_IP="softeng.pmf.kg.ac.rs"
SERVER_DIR="app/"
DOTNET_PORT=10141
SERVICE_NAME="logic_tenacity.service"

# Stop the systemd user service on the server
echo "Stopping systemd user service ${SERVICE_NAME} on the server..."
ssh ${SERVER_USER}@${SERVER_IP} "systemctl --user stop ${SERVICE_NAME}"
if [ $? -ne 0 ]; then
    echo "Failed to stop systemd user service ${SERVICE_NAME} on the server."
    exit 1
fi

# Kill the process using the specified port on the server
echo "Killing process using port ${DOTNET_PORT} on the server..."
ssh ${SERVER_USER}@${SERVER_IP} "lsof -t -i:${DOTNET_PORT} | xargs kill -9"
if [ $? -ne 0 ]; then
    echo "Failed to kill the process using port ${DOTNET_PORT} on the server."
fi

# Navigate to the Angular app directory and build it
cd app/Client
echo "Installing npm packages..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install npm packages."
    exit 1
fi

echo "Building Angular app..."
npm run build
if [ $? -ne 0 ]; then
    echo "Angular build failed."
    exit 1
fi

# Navigate back to the root directory
cd ../..

# Create the wwwroot directory if it doesn't exist
echo "Creating wwwroot directory..."
mkdir -p app/Server/Server/wwwroot

# Copy Angular build to Server/wwwroot
echo "Copying Angular build to wwwroot..."
cp -r app/Client/dist/. app/Server/Server/wwwroot/

# Navigate to the .NET app directory and publish it
cd app/Server

# Update .NET packages
echo "Updating .NET packages..."
dotnet restore
if [ $? -ne 0 ]; then
    echo ".NET restore failed."
    exit 1
fi

echo "Publishing .NET app..."
dotnet publish -c Release -r linux-x64 -o ./publish
if [ $? -ne 0 ]; then
    echo ".NET publish failed."
    exit 1
fi

# Deploy to server
echo "Deploying to server..."

# Create app directory if it doesn't exist
echo "Creating app directory on the server..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_DIR}"

# Secure copy published files to server
echo "Copying published files to the server..."
scp -r ./publish/* ${SERVER_USER}@${SERVER_IP}:${SERVER_DIR}
if [ $? -ne 0 ]; then
    echo "SCP transfer failed."
    exit 1
fi

# SSH to server and set execute permission on Server file
echo "Setting execute permission on Server file..."
ssh ${SERVER_USER}@${SERVER_IP} "chmod u+x ${SERVER_DIR}/Server"
if [ $? -ne 0 ]; then
    echo "SSH command failed."
    exit 1
fi


echo "Starting systemd user service ${SERVICE_NAME} on the server..."
ssh ${SERVER_USER}@${SERVER_IP} "systemctl --user start ${SERVICE_NAME}"
if [ $? -ne 0 ]; then
    echo "Failed to start systemd user service ${SERVICE_NAME} on the server."
    exit 1
fi

echo "Build, publish, and deploy completed successfully."

