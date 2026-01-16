#!/bin/bash

# SSL Certificate Renewal Script for gramaharvest.shop
# Add this to crontab: 0 0 1 * * /path/to/renew-ssl.sh

set -e

DOMAIN="gramaharvest.shop"

echo "🔄 Renewing SSL certificate for $DOMAIN..."

# Renew certificate
certbot renew --quiet

# Copy renewed certificates
if [ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/cert.pem
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/key.pem
    
    # Reload nginx
    docker-compose exec nginx nginx -s reload
    
    echo "✅ Certificate renewed and Nginx reloaded"
else
    echo "❌ Certificate files not found"
    exit 1
fi
