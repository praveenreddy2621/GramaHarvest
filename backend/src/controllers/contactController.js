const sendEmail = require('../utils/sendEmail');

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    console.log('Contact form submission received:', { name, email, subject });

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const supportEmail = process.env.SUPPORT_EMAIL || 'support@gramaharvest.shop';
    console.log(`Sending inquiry to support at: ${supportEmail}`);

    try {
        // Send email to support
        await sendEmail({
            email: supportEmail,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #1a5d1a; border-bottom: 2px solid #1a5d1a; padding-bottom: 10px;">New Inquiry from ${name}</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                        This email was sent from the Gramaharvest contact form.
                    </p>
                </div>
            `
        });

        // Optionally send a confirmation email to the user
        try {
            await sendEmail({
                email: email,
                subject: 'We received your message! - Gramaharvest',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #1a5d1a;">Hello ${name},</h2>
                        <p>Thank you for reaching out to Gramaharvest! We've received your message and will get back to you within 24 hours.</p>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Your Message Subject:</strong> ${subject}</p>
                        </div>
                        <p>Best regards,<br>The Gramaharvest Team</p>
                    </div>
                `
            });
        } catch (confirmError) {
            console.error('Confirmation email failed', confirmError);
        }

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Error sending message, please try again later' });
    }
};

module.exports = { submitContactForm };
