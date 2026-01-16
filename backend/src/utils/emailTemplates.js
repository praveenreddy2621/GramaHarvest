const fs = require('fs').promises;
const path = require('path');

/**
 * Email Template Helper
 * Loads and processes HTML email templates with variable substitution
 */

class EmailTemplates {
    constructor() {
        this.templatesDir = path.join(__dirname, '../templates/emails');
    }

    /**
     * Load and process an email template
     * @param {string} templateName - Name of the template file (without .html)
     * @param {object} variables - Variables to replace in the template
     * @returns {Promise<string>} Processed HTML
     */
    async render(templateName, variables = {}) {
        try {
            const templatePath = path.join(this.templatesDir, `${templateName}.html`);
            let html = await fs.readFile(templatePath, 'utf-8');

            // Replace simple variables {{variableName}}
            Object.keys(variables).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(regex, variables[key] || '');
            });

            // Handle conditional blocks {{#if condition}}...{{/if}}
            html = this.processConditionals(html, variables);

            // Handle loops {{#each array}}...{{/each}}
            html = this.processLoops(html, variables);

            return html;
        } catch (error) {
            console.error(`Error rendering template ${templateName}:`, error);
            throw error;
        }
    }

    /**
     * Process conditional blocks in template
     */
    processConditionals(html, variables) {
        const conditionalRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
        return html.replace(conditionalRegex, (match, condition, content) => {
            return variables[condition] ? content : '';
        });
    }

    /**
     * Process loop blocks in template
     */
    processLoops(html, variables) {
        const loopRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
        return html.replace(loopRegex, (match, arrayName, template) => {
            const array = variables[arrayName];
            if (!Array.isArray(array)) return '';

            return array.map(item => {
                let itemHtml = template;
                Object.keys(item).forEach(key => {
                    const regex = new RegExp(`{{this\\.${key}}}`, 'g');
                    itemHtml = itemHtml.replace(regex, item[key] || '');
                });
                return itemHtml;
            }).join('');
        });
    }

    /**
     * Get welcome email HTML
     */
    async getWelcomeEmail(userName, websiteUrl = process.env.FRONTEND_URL || 'https://gramaharvest.shop') {
        return this.render('welcome', {
            userName,
            websiteUrl
        });
    }

    /**
     * Get order confirmation email HTML
     */
    async getOrderConfirmationEmail(orderData) {
        return this.render('order-confirmation', {
            userName: orderData.userName,
            orderId: orderData.orderId,
            orderDate: orderData.orderDate,
            paymentMethod: orderData.paymentMethod,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            shippingAddress: orderData.shippingAddress,
            websiteUrl: orderData.websiteUrl || process.env.FRONTEND_URL || 'https://gramaharvest.shop'
        });
    }

    /**
     * Get inactive user re-engagement email HTML
     */
    async getInactiveUserEmail(userName, websiteUrl = process.env.FRONTEND_URL || 'https://gramaharvest.shop', unsubscribeUrl = '') {
        return this.render('inactive-user', {
            userName,
            websiteUrl,
            unsubscribeUrl
        });
    }

    /**
     * Get discount offer email HTML
     */
    async getDiscountOfferEmail(discountData) {
        return this.render('discount-offer', {
            userName: discountData.userName,
            discountPercentage: discountData.discountPercentage,
            discountDescription: discountData.discountDescription,
            couponCode: discountData.couponCode,
            expiryDate: discountData.expiryDate,
            price1: discountData.price1 || '1200',
            price2: discountData.price2 || '800',
            websiteUrl: discountData.websiteUrl || process.env.FRONTEND_URL || 'https://gramaharvest.shop',
            unsubscribeUrl: discountData.unsubscribeUrl || ''
        });
    }
    async getWaitlistConfirmationEmail(productName, imageUrl, productUrl) {
        return this.render('waitlist-confirmation', { productName, imageUrl, productUrl });
    }

    async getLoginAlertEmail(userName, time) {
        return this.render('login-alert', { userName, time });
    }

    async getShipmentNotificationEmail(data) {
        return this.render('shipment-notification', data);
    }

    async getPasswordResetEmail(userName, resetUrl, websiteUrl = process.env.FRONTEND_URL || 'https://gramaharvest.shop') {
        return this.render('password-reset', {
            userName,
            resetUrl,
            websiteUrl
        });
    }
}

module.exports = new EmailTemplates();
