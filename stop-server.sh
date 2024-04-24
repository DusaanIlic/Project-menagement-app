SERVER_USER="logic_tenacity"
SERVER_IP="softeng.pmf.kg.ac.rs"

# SSH to server and execute start-server.sh
echo "Stopping the server..."
ssh ${SERVER_USER}@${SERVER_IP} "./stop-server.sh"
echo "Server stopped."