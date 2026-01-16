"use client";
import React from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export default function ShippingPolicyPage() {
    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-nature-earth mb-8">Shipping & Delivery Policy</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-nature-earth/80 leading-relaxed">
                    <p>Last updated: January 16, 2026</p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">1. Processing Time</h2>
                    <p>
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                        If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">2. Shipping Rates & Delivery Estimates</h2>
                    <p>
                        Shipping charges for your order will be calculated and displayed at checkout.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Standard Shipping:</strong> 3-5 business days - Free for orders above ₹500.</li>
                        <li><strong>Express Shipping:</strong> 1-2 business days - ₹100 flat rate.</li>
                    </ul>
                    <p>Delivery delays can occasionally occur.</p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">3. Shipment Confirmation & Order Tracking</h2>
                    <p>
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                        The tracking number will be active within 24 hours.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">4. Damages</h2>
                    <p>
                        Gramaharvest is not liable for any products damaged or lost during shipping. If you received your order damaged,
                        please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
                    </p>

                    <h2 className="text-2xl font-bold text-nature-earth mt-4">5. International Shipping</h2>
                    <p>
                        We currently do not ship outside of India.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
