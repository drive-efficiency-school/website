#!/bin/bash

# Efficiver Website Deploy Script - Development Environment
# Uploads built website files to the development server

set -e  # Exit on any error

# Configuration
SOURCE_DIR="./dist"
REMOTE_HOST="app03.digidhamu.com"
REMOTE_PORT="2222"
REMOTE_USER="dhamukrish"
REMOTE_PATH="/home/dhamukrish/digidhamu/efficiver.com/www-dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Efficiver website deployment to DEVELOPMENT...${NC}"

# Build with the DEV robots policy. This script used to reuse whatever ./dist
# happened to contain — which was prod's build, carrying `index, follow`. That is
# why the dev site was indexable. Building here makes the environment a property
# of the deploy, not of whatever was built last.
echo -e "${YELLOW}🏗  Building with SITE_ENV=dev (noindex)...${NC}"
if ! npm run build:dev; then
    echo -e "${RED}❌ Build failed — nothing deployed.${NC}"
    exit 1
fi

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ Error: Source directory '$SOURCE_DIR' does not exist!${NC}"
    exit 1
fi

# Check if source directory has files
if [ -z "$(ls -A $SOURCE_DIR)" ]; then
    echo -e "${RED}❌ Error: Source directory '$SOURCE_DIR' is empty!${NC}"
    echo -e "${YELLOW}💡 Make sure to run 'npm run build' first${NC}"
    exit 1
fi

echo -e "${YELLOW}📁 Source directory: $SOURCE_DIR${NC}"
echo -e "${YELLOW}🌐 Target server: $REMOTE_HOST${NC}"
echo -e "${YELLOW}📍 Remote path: $REMOTE_PATH${NC}"
echo -e "${BLUE}🏷️  Environment: DEVELOPMENT${NC}"

# Create a temporary batch file for SFTP
BATCH_FILE=$(mktemp)

# Create SFTP batch commands
cat > "$BATCH_FILE" << EOF
cd $REMOTE_PATH
lcd $SOURCE_DIR
sudo put -r *
bye
EOF

echo -e "${YELLOW}🧹 Cleaning server directory...${NC}"

# Clean the server directory first
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "sudo rm -rf $REMOTE_PATH/*"

echo -e "${YELLOW}🧽 Removing unwanted files from source...${NC}"

# Remove unwanted files from local directory before upload
find "$SOURCE_DIR" -name '.DS_Store' -delete
find "$SOURCE_DIR" -name 'Thumbs.db' -delete
find "$SOURCE_DIR" -name '*.log' -delete

echo -e "${YELLOW}🔄 Uploading files via rsync with sudo...${NC}"

# Use rsync with sudo for upload
if rsync -avz -e "ssh -p $REMOTE_PORT" --exclude='.DS_Store' --exclude='Thumbs.db' --exclude='*.log' --rsync-path="sudo rsync" "$SOURCE_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"; then
    echo -e "${GREEN}✅ Deployment to DEV completed successfully!${NC}"
    echo -e "${GREEN}🌐 Development site available at: https://www-dev.efficiver.com${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${YELLOW}💡 Check your SSH keys or server permissions${NC}"
    exit 1
fi

echo -e "${GREEN}🧹 Cleanup completed${NC}"
echo -e "${GREEN}🎉 DEV deployment complete!${NC}"