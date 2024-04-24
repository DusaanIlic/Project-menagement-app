SERVER_USER="logic_tenacity"
SERVER_IP="softeng.pmf.kg.ac.rs"

# SSH to server and execute start-server.sh
echo "Launching start-server.sh on the server..."
ssh ${SERVER_USER}@${SERVER_IP} "./start-server.sh"
if [ $? -ne 0 ]; then
    echo "Failed to launch start-server.sh on the server."
    exit 1
fi

echo "start-server.sh launched successfully."