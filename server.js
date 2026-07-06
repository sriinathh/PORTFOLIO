const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');
const UAParser = require('ua-parser-js');
const { generateEmailHTML, generateVisitorEmailHTML } = require('./emailTemplate');
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

// Helper: Extract visitor public IP address
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket.remoteAddress || req.ip;
}

// Helper: Fetch IP Geolocation and security details from ipwho.is
async function getGeoData(ip) {
  const localIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
  if (!ip || localIPs.includes(ip) || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.')) {
    return {
      city: 'Localhost',
      region: 'Local Network',
      country: 'Local Network',
      timezone: undefined,
      security: { vpn: false, proxy: false, tor: false, hosting: false }
    };
  }

  try {
    const response = await fetch(`https://ipwho.is/${ip}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country || 'Unknown',
          timezone: data.timezone ? data.timezone.id : undefined,
          security: data.security || { vpn: false, proxy: false, tor: false, hosting: false }
        };
      }
    }
  } catch (error) {
    console.error(`❌ Geolocation fetch failed for IP ${ip}:`, error.message);
  }

  return {
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    timezone: undefined,
    security: { vpn: false, proxy: false, tor: false, hosting: false }
  };
}

// Helper: Resolve traffic source classification from referrer URL
function getTrafficSource(referrer) {
  if (!referrer || referrer === 'Direct' || referrer.trim() === '') {
    return 'Direct';
  }
  const refLower = referrer.toLowerCase();
  if (refLower.includes('google.com')) return 'Google Search';
  if (refLower.includes('linkedin.com')) return 'LinkedIn';
  if (refLower.includes('github.com')) return 'GitHub';
  if (refLower.includes('twitter.com') || refLower.includes('t.co') || refLower.includes('x.com')) return 'X / Twitter';
  if (refLower.includes('facebook.com')) return 'Facebook';
  if (refLower.includes('instagram.com')) return 'Instagram';
  if (refLower.includes('youtube.com')) return 'YouTube';
  if (refLower.includes('reddit.com')) return 'Reddit';
  
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch (e) {
    return referrer;
  }
}

// Helper: Calculate standard spam/threat score (0-10)
function calculateSpamScore(body, security) {
  let score = 0;
  const textToScan = `${body.name || ''} ${body.subject || ''} ${body.message || ''}`.toLowerCase();
  
  // 1. Common spam keywords
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'lottery', 'crypto', 'bitcoin', 'ethereum',
    'passive income', 'seo audit', 'seo services', 'grow traffic', 'rank page 1',
    'backlink', 'guest post', 'make money online', 'generate leads', 'marketing services'
  ];
  
  spamKeywords.forEach(kw => {
    if (textToScan.includes(kw)) score += 2;
  });

  // 2. Hyperlinks in message body
  const urlRegex = /https?:\/\/[^\s]+/g;
  const linkCount = (body.message || '').match(urlRegex)?.length || 0;
  if (linkCount > 0) {
    score += Math.min(4, linkCount * 2);
  }

  // 3. Network threat flags
  if (security.vpn) score += 2;
  if (security.proxy) score += 3;
  if (security.tor) score += 4;
  if (security.hosting) score += 2;
  
  return Math.min(10, score);
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, contact, email, subject, message, company } = req.body;
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

    // Capture visitor analytics metadata
    const ip = getClientIp(req);
    const geoData = await getGeoData(ip);
    
    // Parse user agent strings
    const userAgentStr = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentStr);
    const uaResult = parser.getResult();
    
    const deviceType = uaResult.device.type 
      ? uaResult.device.type.charAt(0).toUpperCase() + uaResult.device.type.slice(1)
      : 'Desktop';

    const acceptLang = req.headers['accept-language'] || '';
    const language = acceptLang.split(',')[0] || 'Unknown';

    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    const trafficSource = getTrafficSource(referrer);

    // Compute localized timestamps
    const visitorLocalTime = new Date().toLocaleString('en-US', {
      timeZone: geoData.timezone || undefined,
      dateStyle: 'medium',
      timeStyle: 'long'
    });

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const spamScore = calculateSpamScore(req.body, geoData.security);

    const parsedEmail = isEmail ? contactValue : 'Not Provided';
    const parsedPhone = isPhone ? contactValue : 'Not Provided';

    // Compile email dataset
    const emailData = {
      name,
      email: parsedEmail,
      phone: parsedPhone,
      company: company || '',
      subject,
      message,
      ip,
      city: geoData.city,
      region: geoData.region,
      country: geoData.country,
      browser: uaResult.browser.name || 'Unknown',
      browserVersion: uaResult.browser.version || 'Unknown',
      os: `${uaResult.os.name || 'Unknown'} ${uaResult.os.version || ''}`.trim(),
      deviceType,
      language,
      referrer,
      trafficSource,
      visitorTime: visitorLocalTime,
      contactPageUrl: referrer !== 'Direct' ? referrer : 'https://srinathdev.codes',
      requestId,
      spamScore,
      security: {
        vpn: geoData.security.vpn || false,
        proxy: geoData.security.proxy || false,
        bot: uaResult.device.type === 'bot' || /bot|crawl|spider/i.test(userAgentStr)
      }
    };

    if (resend) {
      // 1. Send lead notification to portfolio owner
      const htmlEmail = generateEmailHTML(emailData);
      await resend.emails.send({
        from: 'Srinath Portfolio <onboarding@resend.dev>',
        to: TO_EMAIL,
        reply_to: parsedEmail !== 'Not Provided' ? parsedEmail : undefined,
        subject: `🚀 Lead: ${name} - ${subject}`,
        html: htmlEmail
      });

      // 2. Send auto-reply confirmation to visitor
      if (parsedEmail !== 'Not Provided') {
        try {
          const visitorHtmlEmail = generateVisitorEmailHTML({
            name,
            subject,
            message
          });
          await resend.emails.send({
            from: 'Srinath Portfolio <onboarding@resend.dev>',
            to: parsedEmail,
            subject: `Thank you for reaching out! | Srinath.dev`,
            html: visitorHtmlEmail
          });
          console.log(`📧 Auto-reply confirmation sent to visitor: ${parsedEmail}`);
        } catch (visitorEmailError) {
          // Gracefully catch errors if using Resend's onboarding/sandbox domain which restricts recipients
          console.error(`⚠️ Failed to send visitor auto-reply (likely Resend sandbox domain restriction):`, visitorEmailError.message);
        }
      }
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
