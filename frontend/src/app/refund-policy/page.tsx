"use client";
import React from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-nature-earth mb-8">Cancellation & Refund Policy</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-nature-earth/80 leading-relaxed">
                    <p>Last updated: January 16, 2026</p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">1. Order Cancellation</h2>
                    <p>
                        You can cancel your order within 24 hours of placing it, provided it has not already been shipped.
                        To cancel, please contact our support team immediately at support@gramaharvest.shop with your order number.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">2. Returns</h2>
                    <p>
                        Due to the perishable nature of our products (Ghee, Rice, etc.), we generally do not accept returns.
                        However, we want you to be completely satisfied with your purchase.
                    </p>
                    <p>
                        If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery
                        with photos of the issue. We will evaluate the issue and make it right.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">3. Refunds</h2>
                    <p>
                        If your return is approved (for damaged/defective items), we will initiate a refund to your original method of payment.
                        You will receive the credit within a certain amount of days (usually 5-7 business days), depending on your card issuer's policies.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">4. Late or Missing Refunds</h2>
                    <p>
                        If you haven’t received a refund yet, first check your bank account again.
                        Then contact your credit card company, it may take some time before your refund is officially posted.
                        Next contact your bank. There is often some processing time before a refund is posted.
                        If you’ve done all of this and you still have not received your refund yet, please contact us at support@gramaharvest.shop.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
