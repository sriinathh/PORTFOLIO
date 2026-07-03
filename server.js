const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL || 'psrinath821@gmail.com';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
    'https://srinath-potharaju-zsv4.onrender.com',
    'https://srinath-potharaju.onrender.com',
    'https://srinath-potharaju.vercel.app',
    'file://'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, contact, email, subject, message } = req.body;
    const contactValue = String(contact || email || '').trim();

    if (!name || !contactValue || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,10}$/;
    const isEmail = emailRegex.test(contactValue);
    const isPhone = phoneRegex.test(contactValue);

    if (!isEmail && !isPhone) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address or phone number.' });
    }

    if (resend) {
      await resend.emails.send({
        from: 'Srinath Portfolio <onboarding@resend.dev>',
        to: TO_EMAIL,
        reply_to: contactValue,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px;">
            <h2 style="margin:0 0 8px;color:#0f172a;">New Portfolio Contact</h2>
            <p style="margin:0 0 12px;color:#475569;">You received a new message from your portfolio contact form.</p>
            <div style="background:#f8fafc;padding:16px;border-radius:12px;margin-bottom:16px;">
              <p style="margin:2px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin:2px 0;"><strong>Contact:</strong> ${contactValue}</p>
              <p style="margin:2px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="white-space:pre-wrap;background:#fff;padding:16px;border-radius:12px;border:1px solid #e2e8f0;">${message}</div>
          </div>
        `
      });
    } else {
      console.warn('RESEND_API_KEY not configured. Contact message accepted but email not sent.');
    }

    return res.status(200).json({
      success: true,
      message: 'Thanks for reaching out! Your message has been sent successfully.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending your message. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Contact endpoint ready at http://localhost:${PORT}/api/contact`);
  console.log(`🔑 Resend API Key: ${RESEND_API_KEY ? 'CONFIGURED (' + RESEND_API_KEY.slice(0, 8) + '...)' : 'MISSING'}`);
  console.log(`📩 Target Email: ${TO_EMAIL}`);
});
