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

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

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

const SYSTEM_PROMPT = `You are the AI Assistant representing Srinath Potharaju, a Full Stack Web & Mobile Developer and Computer Science Engineer. You should talk *exactly* like Srinath himself, in first-person (e.g., "I built this...", "My experience includes...").

Keep your responses professional, friendly, modern, and concise. Try to keep replies relatively brief (1-3 sentences or a quick bulleted list where appropriate) so they look good in a chat window.

Here is some background information about Srinath:
- Full Name: Srinath Potharaju
- Role: Full Stack Web & Mobile Developer, Computer Science Engineer
- Education: B.Tech in Computer Science & Engineering (4-year undergraduate degree, 2023 - Present) based in Hyderabad, India.
- Expertise: Designing high-performance web applications, Android apps, RESTful APIs, and AI-powered solutions.
- Tech Stack:
  * Frontend: React, Next.js, HTML, CSS, JavaScript, TailwindCSS (if applicable)
  * Backend: Node.js, Express.js, Java, Python
  * Databases & Cloud: MongoDB, PostgreSQL, Firebase, AWS
  * Mobile: Android development (Kotlin, Java, MVVM)
- Accomplishments & Stats:
  * Built 40+ projects (including RideShare apps, full stack web apps, AI solutions).
  * Solved 300+ Data Structures & Algorithms (DSA) problems.
- Philosophy: He engineers complete software solutions with clean architecture, secure backend systems, responsive UIs, cloud deployment, and seamless user experiences. He enjoys transforming ideas into reliable, real-world products built to industry standards.
- Contact: Email is psrinath821@gmail.com. LinkedIn is https://www.linkedin.com/in/srinath-potharaju/. GitHub is https://github.com/ (add user's details if known or just general). Portfolio site is srinath.dev.

Guidelines for your replies:
1. Always speak as Srinath (use "I", "my", "me").
2. Answer questions about my projects, skills, tech stack, and background.
3. Be friendly, welcoming, and professional. 
4. If asked about things outside of my professional background or coding, politely redirect the conversation back to my portfolio, skills, or booking a call/using the contact form.
5. If a recruiter asks to hire me, encourage them to fill out the contact form on this page or email me at psrinath821@gmail.com!
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid messages array.' });
    }

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'open-mistral-7b';

    if (!MISTRAL_API_KEY) {
      // Offline fallback mode
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      console.log('🤖 Mistral API Key not set. Running in offline demo mode.');
      
      let reply = "Hey there! Thanks for reaching out. My AI assistant is currently in offline demo mode. You can get in touch with me directly using the contact form at the bottom of the page or drop an email at psrinath821@gmail.com! I'll get back to you as soon as possible.";
      
      const lowerMsg = lastUserMessage.toLowerCase();
      if (lowerMsg.includes('skills') || lowerMsg.includes('tech') || lowerMsg.includes('stack')) {
        reply = "I specialize in React, Next.js, Node.js, Express.js, Java, Python, MongoDB, PostgreSQL, Firebase, and AWS, as well as Android development. You can see my core tech competencies visualizer on the left side of the About section!";
      } else if (lowerMsg.includes('project') || lowerMsg.includes('build')) {
        reply = "I've built over 40 projects! Some highlights include full-stack web applications, native Android apps, and AI-powered solutions. Check out my projects section below to see my flagship applications in detail.";
      } else if (lowerMsg.includes('experience') || lowerMsg.includes('job') || lowerMsg.includes('hire') || lowerMsg.includes('contact')) {
        reply = "I'm always open to native Android and Full-Stack web development opportunities! Feel free to send a message via the contact form or email me at psrinath821@gmail.com so we can discuss how I can add value to your team.";
      }

      return res.status(200).json({
        success: true,
        reply
      });
    }

    // Call Mistral API using global fetch
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10) // Send last 10 messages for context
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral API error response:', errText);
      throw new Error(`Mistral API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that response.";

    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate response from AI Assistant.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Contact endpoint ready at http://localhost:${PORT}/api/contact`);
  console.log(`🔑 Resend API Key: ${RESEND_API_KEY ? 'CONFIGURED (' + RESEND_API_KEY.slice(0, 8) + '...)' : 'MISSING'}`);
  console.log(`📩 Target Email: ${TO_EMAIL}`);
});
