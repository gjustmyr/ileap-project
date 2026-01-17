#!/bin/bash
# Set EC2 server timezone to Philippine Time (Asia/Manila)

echo "Setting server timezone to Asia/Manila (Philippine Time)..."

# Set timezone using timedatectl (works on Amazon Linux 2, Ubuntu, etc.)
sudo timedatectl set-timezone Asia/Manila

# Verify the change
echo "Current server timezone:"
timedatectl

# Also set TZ environment variable in .env if it exists
if [ -f .env ]; then
    # Remove existing TZ line if present
    sed -i '/^TZ=/d' .env
    # Add TZ=Asia/Manila
    echo "TZ=Asia/Manila" >> .env
    echo "Added TZ=Asia/Manila to .env file"
fi

echo "✅ Timezone configuration complete!"
echo "Note: Restart the FastAPI application for changes to take effect."
