"use client";
import React, { useState } from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { BACKEND_API } from '@/config';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const form = e.currentTarget as HTMLFormElement;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value
        };

        try {
            const res = await fetch(`${BACKEND_API}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setStatus('success');
            } else {
                const errorData = await res.json();
                setStatus('error');
                setErrorMessage(errorData.message || 'Failed to send message');
            }
        } catch (err) {
            console.error('Contact error:', err);
            setStatus('error');
            setErrorMessage('Could not connect to server');
        }
    };

    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-nature-earth text-nature-cream pt-32 pb-20 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl font-serif font-bold mb-4">Get in Touch</h1>
                    <p className="text-xl text-nature-gold/80 max-w-2xl mx-auto">
                        Have a question about our products or want to visit our farm? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <section className="flex-grow container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                    {/* Contact Info Card */}
                    <div className="bg-nature-green text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-nature-gold rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                        <h2 className="text-3xl font-serif font-bold mb-8 relative z-10">Contact Information</h2>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin size={24} className="text-nature-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Our Farm</h3>
                                    <p className="text-white/80 leading-relaxed">
                                        Gramaharvest Farm,<br />
                                        Gampalagudem,<br />
                                        NTR District, Andhra Pradesh - 521403
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <Phone size={24} className="text-nature-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                                    <p className="text-white/80">+91 9492704264</p>
                                    <p className="text-white/60 text-sm mt-1">Mon-Sat, 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <Mail size={24} className="text-nature-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email</h3>
                                    <p className="text-white/80">support@gramaharvest.shop</p>
                                    <p className="text-white/60 text-sm mt-1">We reply within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links or Extra text */}
                        <div className="mt-12 pt-8 border-t border-white/20">
                            <p className="text-white/60 text-sm">Follow our journey on social media @gramaharvest</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-nature-earth/10">
                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-nature-earth mb-2">Message Sent!</h3>
                                <p className="text-zinc-500 mb-8">Thank you for reaching out. We will get back to you shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-nature-green font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-nature-earth mb-6">Send us a Message</h2>

                                {status === 'error' && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center mb-6">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-bold text-nature-earth/80 ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-nature-cream/30 border border-nature-earth/10 focus:border-nature-green focus:bg-white focus:outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold text-nature-earth/80 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-nature-cream/30 border border-nature-earth/10 focus:border-nature-green focus:bg-white focus:outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-bold text-nature-earth/80 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-nature-cream/30 border border-nature-earth/10 focus:border-nature-green focus:bg-white focus:outline-none transition-all"
                                        placeholder="Order Inquiry / General Question"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-bold text-nature-earth/80 ml-1">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-nature-cream/30 border border-nature-earth/10 focus:border-nature-green focus:bg-white focus:outline-none transition-all resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-nature-earth text-white font-bold py-4 rounded-xl hover:bg-nature-green transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'submitting' ? (
                                        <span className="animate-pulse">Sending...</span>
                                    ) : (
                                        <>Send Message <Send size={18} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
