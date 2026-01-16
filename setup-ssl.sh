#!/bin/bash

# SSL Certificate Setup Script for gramaharvest.shop
# This script helps you obtain SSL certificates using Let's Encrypt

set -e

DOMAIN="gramaharvest.shop"
EMAIL="admin@gramaharvest.shop"  # Change this to your email

echo "🔒 SSL Certificate Setup for $DOMAIN"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt-get update
    apt-get install -y certbot
fi

# Stop nginx temporarily
echo "⏸️  Stopping Nginx..."
docker-compose stop nginx

# Obtain certificate
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --preferred-challenges http

# Copy certificates to nginx directory
echo "📋 Copying certificates..."
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/key.pem

# Set proper permissions
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem

# Restart nginx
echo "🔄 Restarting Nginx with SSL..."
docker-compose up -d nginx

echo ""
echo "✅ SSL Certificate installed successfully!"
echo ""
echo "📝 Certificate Details:"
echo "   Domain: $DOMAIN"
echo "   Expires: $(date -d "+90 days" +%Y-%m-%d)"
echo ""
echo "🔄 Auto-renewal:"
echo "   Certificates will expire in 90 days"
echo "   Set up a cron job to renew automatically:"
echo "   0 0 1 * * /path/to/renew-ssl.sh"
echo ""
echo "🌐 Your site is now accessible at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
