export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const BACKEND_API = BACKEND_URL;
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'your_razorpay_key_id';

const config = {
    API_BASE_URL: BACKEND_URL,
};
export default config;
