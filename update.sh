#!/bin/bash

# Pull the latest changes from the repository
git pull origin main

# Install any new dependencies
pnpm install

# Build the project
pnpm build

# Restart the service to apply changes
sudo systemctl restart eztorrent.service

