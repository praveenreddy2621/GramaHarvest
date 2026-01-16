import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
    title: 'Contact Us | Get in Touch with Grama Harvest',
    description: 'Have questions about our Ghee or Spices? Contact our team at Gramaharvest. We offer customer support and inquiries for farm visits.',
    openGraph: {
        title: 'Contact Grama Harvest',
        description: 'We are here to help. Reach out to us for any farm product inquiries.',
    }
};

export default function ContactPage() {
    return <ContactContent />;
}
