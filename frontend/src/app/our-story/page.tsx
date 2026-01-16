import { Metadata } from 'next';
import StoryContent from './StoryContent';

export const metadata: Metadata = {
    title: 'Our Story | Preserving Traditional Village Heritage',
    description: 'Learn about Grama Harvest\'s journey from the city back to our roots in rural Andhra Pradesh. Discover our commitment to Bilona Ghee and organic farming.',
    openGraph: {
        title: 'The Grama Harvest Journey | Our Story',
        description: 'Preserving traditions, one harvest at a time.',
    }
};

export default function StoryPage() {
    return <StoryContent />;
}
