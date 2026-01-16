"use client";
import React from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-nature-earth mb-8">Privacy Policy</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-nature-earth/80 leading-relaxed">
                    <p>Last updated: January 16, 2026</p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">1. Introduction</h2>
                    <p>
                        Gramaharvest ("we," "our," or "us") respects the privacy of our users ("user" or "you").
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website gramaharvest.shop.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">2. Collection of Information</h2>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Personal Data:</strong> Name, shipping address, email address, and telephone number when you register or place an order.</li>
                        <li><strong>Derivative Data:</strong> Info our servers automatically collect (IP address, browser type, etc.) when you access the Site.</li>
                        <li><strong>Financial Data:</strong> We do not store financial information. Payment data is processed by our payment gateway (Razorpay).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">3. Use of Your Information</h2>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Process your payments and fulfill your orders.</li>
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Send you a newsletter (if opted in).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">4. Disclosure of Your Information</h2>
                    <p>
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share information with third parties that perform services for us (e.g., payment processing, shipping).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">5. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at:<br />
                        <strong>support@gramaharvest.shop</strong>
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
