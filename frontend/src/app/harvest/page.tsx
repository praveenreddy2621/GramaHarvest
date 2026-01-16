import { Metadata } from 'next';
import HarvestContent from './HarvestContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Pure Traditional Harvest | Ghee, Rice & Spices',
    description: 'Explore our farm-fresh collection of Bilona Ghee, Guntur Chillies, and organic staples. Direct from local farmers to your home.',
    openGraph: {
        title: 'Our Harvest | Grama Harvest',
        description: 'Quality farm produce, preserving tradition and health.',
    }
};

export default function HarvestPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-nature-cream text-nature-earth font-serif text-xl">Loading shop...</div>}>
            <HarvestContent />
        </Suspense>
    );
}
