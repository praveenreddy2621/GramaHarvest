"use client";
import React from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-nature-earth mb-8">Terms and Conditions</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-nature-earth/80 leading-relaxed">
                    <p>Last updated: January 16, 2026</p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">1. Agreement to Terms</h2>
                    <p>
                        These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Gramaharvest (“we,” “us” or “our”), concerning your access to and use of the gramaharvest.shop website.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">2. Intellectual Property Rights</h2>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">3. User Representations</h2>
                    <p>
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms and Conditions.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">4. Products</h2>
                    <p>
                        We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">5. Purchases and Payment</h2>
                    <p>
                        We accept various forms of payment. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in INR.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">6. Contact Us</h2>
                    <p>
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br />
                        <strong>support@gramaharvest.shop</strong>
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
