/**
 * Generates a premium HTML email template for portfolio contact form submissions.
 * Replicates the award-winning Vercel/Linear dark dashboard notifications.
 *
 * @param {Object} data - The template variables.
 */
function generateEmailHTML(data) {
  const {
    name = 'Not Available',
    email = 'Not Available',
    phone = 'Not Available',
    company = 'Not Available',
    subject = 'Not Available',
    message = 'Not Available',
    // Dynamic IP mappings
    ip = 'Not Available',
    ipAddress = 'Not Available',
    // Dynamic Location mappings
    city = 'Not Available',
    state = 'Not Available',
    region = 'Not Available',
    country = 'Not Available',
    // Browser metadata
    browser = 'Not Available',
    browserVersion = '',
    // Operating System
    os = 'Not Available',
    // Device mapping
    device = 'Not Available',
    deviceType = 'Not Available',
    // Languages and Referrer tracking
    language = 'Not Available',
    referrer = 'Not Available',
    trafficSource = 'Not Available',
    page = 'Not Available',
    contactPageUrl = 'Not Available',
    // Timestamps
    submittedAt = '',
    visitorTime = '',
    requestId = '',
    spamScore = 0,
    security = {}
  } = data;

  // Reconcile dynamic properties passed from server.js
  const finalIp = (ip && ip !== 'Not Available' ? ip : ipAddress) || 'Not Available';
  const finalState = (region && region !== 'Not Available' ? region : state) || 'Not Available';
  const finalDevice = (deviceType && deviceType !== 'Not Available' ? deviceType : device) || 'Not Available';
  const finalPage = (contactPageUrl && contactPageUrl !== 'Not Available' ? contactPageUrl : page) || 'Not Available';
  const finalSubmittedAt = visitorTime || submittedAt || '';

  const phoneClean = phone !== 'Not Available' ? phone.replace(/[^0-9+]/g, '') : '';
  const waClean = phoneClean; // WhatsApp uses clean phone number directly

  const hasEmail = email && email !== 'Not Available';
  const hasPhone = phone && phone !== 'Not Available';
  const hasCompany = company && company !== 'Not Available' && company !== 'Not Provided';

  // Format Email and Phone details with links dynamically
  const emailRow = hasEmail
    ? `<a href="mailto:${email}" style="color: #3B82F6; text-decoration: none; font-weight: bold;">${email}</a>`
    : `<span style="color: #F59E0B; font-weight: bold;">Not Provided</span>`;

  const phoneRow = hasPhone
    ? `<a href="tel:${phoneClean}" style="color: #3B82F6; text-decoration: none; font-weight: bold;">${phone}</a>`
    : `<span style="color: #F59E0B; font-weight: bold;">Not Provided</span>`;

  // Format location
  const locationParts = [city, finalState, country].filter(p => p && p !== 'Not Available');
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Not Available';

  // Format browser version
  const browserStr = browser !== 'Not Available'
    ? `${browser}`.trim()
    : 'Not Available';
  const browserVerStr = browserVersion ? `v${browserVersion.split('.')[0]}.0.0` : 'Not Available';

  // Format Date and Time
  let dateStr = '';
  let timeStr = '';
  let tzStr = '';

  if (finalSubmittedAt) {
    // If we have custom visitorTime like "Jul 6, 2026 at 10:15:33 PM IST"
    if (finalSubmittedAt.includes(' at ')) {
      const parts = finalSubmittedAt.split(' at ');
      dateStr = parts[0];
      const timeParts = parts[1].split(' ');
      timeStr = timeParts.slice(0, 2).join(' '); // 10:15:33 PM
      tzStr = timeParts.slice(2).join(' '); // IST
    } else {
      dateStr = finalSubmittedAt;
    }
  }

  if (!dateStr) {
    const now = new Date();
    dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    tzStr = 'GMT+5:30'; // Default timezone
  }

  const dateTimeStr = tzStr ? `${dateStr}, ${timeStr} ${tzStr}` : (timeStr ? `${dateStr} at ${timeStr}` : dateStr);

  // Security checks
  const vpnDetected = security.vpn ? '<span style="color: #EF4444; font-weight: bold;">🚨 YES</span>' : '<span style="color: #22C55E; font-weight: bold;">✅ NO</span>';
  const proxyDetected = security.proxy ? '<span style="color: #EF4444; font-weight: bold;">🚨 YES</span>' : '<span style="color: #22C55E; font-weight: bold;">✅ NO</span>';
  const botDetected = security.bot ? '<span style="color: #EF4444; font-weight: bold;">🚨 BOT DETECTED</span>' : '<span style="color: #22C55E; font-weight: bold;">✅ HUMAN VERIFIED</span>';

  // Social Links
  const portfolioUrl = 'https://srinathdev.codes';
  const resumeUrl = 'https://srinathdev.codes/Resume.pdf';
  const linkedinUrl = 'https://www.linkedin.com/in/srinath-potharaju/';
  const githubUrl = 'https://github.com/sriinathh';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Contact</title>
  <style>
    body, table, td, a { text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; }
    
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      background-color: #09090B;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #E4E4E7;
    }
    
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 12px !important;
      }
      .analytics-grid-row {
        display: block !important;
        width: 100% !important;
      }
      .analytics-grid-col {
        width: 46% !important;
        display: inline-block !important;
        margin: 2% !important;
        box-sizing: border-box !important;
      }
      .actions-row td {
        display: inline-block !important;
        margin: 4px 2px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; color: #E4E4E7;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table border="0" cellpadding="0" cellspacing="0" width="650" class="container" style="max-width: 650px; width: 100%; background-color: #09090B; border: none; padding: 0;">
          
          <!-- Top Neon Brand Glow Bar -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td height="4" style="background: linear-gradient(90deg, #22C55E 0%, #3B82F6 50%, #8B5CF6 100%); border-radius: 99px; line-height: 4px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HEADER CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td valign="middle">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right: 14px;">
                          <!-- Premium Glowing Vector Launch Rocket SVG -->
                          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="44" height="44" rx="10" fill="url(#headerRocketGrad)" style="filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));"/>
                            <!-- Launch Rocket Ship Details -->
                            <path d="M22 10C22 10 27 15 27 21C27 24 25 26 22 26C19 26 17 24 17 21C17 15 22 10 22 10Z" fill="#FFFFFF"/>
                            <path d="M22 26V31" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
                            <path d="M19 25L16 28V24L19 25Z" fill="#3B82F6"/>
                            <path d="M25 25L28 28V24L25 25Z" fill="#3B82F6"/>
                            <circle cx="22" cy="17" r="2.5" fill="#3B82F6"/>
                            <defs>
                              <linearGradient id="headerRocketGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#4F46E5"/>
                                <stop offset="100%" stop-color="#2563EB"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </td>
                        <td valign="middle">
                          <h1 style="margin: 0; font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1.2;">New Portfolio Contact</h1>
                          <p style="margin: 3px 0 0 0; font-size: 11px; color: #9CA3AF; line-height: 1.3;">A new visitor has contacted you through your portfolio.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" align="right" style="text-align: right;">
                    <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; line-height: 1;">
                      <span style="color: #3B82F6;">&lt;/&gt;</span> Srinath<span style="color: #3B82F6;">.dev</span>
                    </div>
                    <div style="font-size: 8px; color: #9CA3AF; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Full Stack Developer</div>
                    <div style="font-family: monospace; font-size: 9px; color: #6B7280; margin-top: 4px;">
                      ${dateStr} at ${timeStr} ${tzStr}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- STATUS BAR -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <!-- Pill Badge -->
                    <span style="display: inline-block; font-size: 9px; font-weight: bold; color: #22C55E; background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 9999px; padding: 4px 10px; letter-spacing: 0.05em; text-transform: uppercase;">
                      <span style="display: inline-block; width: 6px; height: 6px; background-color: #22C55E; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>New Lead
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTACT INFORMATION CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-size: 11px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                      <span style="margin-right: 6px;">👤</span>Contact Information
                    </div>
                    
                    <!-- Row 1: Name -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 10px; padding: 12px; margin-bottom: 8px;">
                      <tr>
                        <td width="36" valign="middle">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50%; width: 28px; height: 28px; text-align: center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size: 14px; line-height: 1;">👤</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="middle" style="padding-left: 8px;">
                          <div style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; line-height: 1;">Name</div>
                          <div style="font-size: 13px; color: #FFFFFF; font-weight: bold; text-transform: uppercase; margin-top: 2px;">${name}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Row 2: Email -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 10px; padding: 12px; margin-bottom: 8px;">
                      <tr>
                        <td width="36" valign="middle">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50%; width: 28px; height: 28px; text-align: center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size: 14px; line-height: 1;">📧</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="middle" style="padding-left: 8px;">
                          <div style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; line-height: 1;">Email</div>
                          <div style="font-size: 13px; color: #FFFFFF; font-weight: bold; margin-top: 2px;">${emailRow}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Row 3: Phone -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 10px; padding: 12px; margin-bottom: 8px;">
                      <tr>
                        <td width="36" valign="middle">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50%; width: 28px; height: 28px; text-align: center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size: 14px; line-height: 1;">📱</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="middle" style="padding-left: 8px;">
                          <div style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; line-height: 1;">Phone</div>
                          <div style="font-size: 13px; color: #FFFFFF; font-weight: bold; margin-top: 2px;">${phoneRow}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Row 4: Company (Optional) -->
                    ${hasCompany ? `
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 10px; padding: 12px; margin-bottom: 8px;">
                      <tr>
                        <td width="36" valign="middle">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50%; width: 28px; height: 28px; text-align: center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size: 14px; line-height: 1;">🏢</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="middle" style="padding-left: 8px;">
                          <div style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; line-height: 1;">Company</div>
                          <div style="font-size: 13px; color: #FFFFFF; font-weight: bold; margin-top: 2px;">${company}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <!-- Row 5: Subject -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 10px; padding: 12px; margin-bottom: 0;">
                      <tr>
                        <td width="36" valign="middle">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50%; width: 28px; height: 28px; text-align: center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size: 14px; line-height: 1;">📌</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="middle" style="padding-left: 8px;">
                          <div style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; line-height: 1;">Subject</div>
                          <div style="font-size: 13px; color: #FFFFFF; font-weight: bold; margin-top: 2px;">${subject}</div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MESSAGE CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-size: 11px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
                      <span style="margin-right: 6px;">💬</span>Visitor Message
                    </div>
                    
                    <!-- Quote Container -->
                    <div style="background-color: #09090B; border-left: 4px solid #3B82F6; border-top: 1px solid rgba(59, 130, 246, 0.1); border-right: 1px solid rgba(59, 130, 246, 0.1); border-bottom: 1px solid rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 20px; font-size: 13px; color: #E4E4E7; line-height: 1.6; white-space: pre-wrap; font-family: inherit;">${message}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- VISITOR INFORMATION CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-size: 11px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                      <span style="margin-right: 6px;">🌍</span>Visitor Analytics
                    </div>
                    
                    <!-- Grid -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <!-- Row 1 -->
                      <tr class="analytics-grid-row">
                        <!-- Card 1: IP -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">🌍</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">IP Address</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold; font-family: monospace; word-break: break-all;">${finalIp}</td></tr>
                          </table>
                        </td>
                        <!-- Card 2: Location -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">📍</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">Location</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold; word-break: break-word;">${locationStr}</td></tr>
                          </table>
                        </td>
                        <!-- Card 3: Browser -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">🌐</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">Browser</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold;">${browserStr} ${browserVerStr}</td></tr>
                          </table>
                        </td>
                        <!-- Card 4: OS -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">💻</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">OS</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold;">${os}</td></tr>
                          </table>
                        </td>
                      </tr>
                      <!-- Row 2 -->
                      <tr class="analytics-grid-row">
                        <!-- Card 5: Device -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">📱</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">Device</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold;">${finalDevice}</td></tr>
                          </table>
                        </td>
                        <!-- Card 6: Language -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">🗣</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">Language</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold;">${language}</td></tr>
                          </table>
                        </td>
                        <!-- Card 7: Referrer -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">🔗</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">Referrer</td></tr>
                            <tr><td align="center" style="font-size: 11px; color: #FFFFFF; font-weight: bold; word-break: break-all;">${referrer}</td></tr>
                          </table>
                        </td>
                        <!-- Card 8: Submission Time -->
                        <td class="analytics-grid-col" width="25%" style="padding: 6px;" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 14px; text-align: center; min-height: 105px;">
                            <tr><td align="center" style="font-size: 18px; padding-bottom: 4px;">🕒</td></tr>
                            <tr><td align="center" style="font-size: 9px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; padding-bottom: 2px;">Time</td></tr>
                            <tr><td align="center" style="font-size: 10px; color: #FFFFFF; font-weight: bold; line-height: 1.2;">${dateTimeStr}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SECURITY AUDIT CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-size: 11px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                      <span style="margin-right: 6px;">🛡️</span>Security Audit
                    </div>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; line-height: 1.9; color: #E4E4E7;">
                      <tr>
                        <td width="160" style="padding: 5px 0; color: #6B7280; font-weight: 500;">VPN Detected:</td>
                        <td style="padding: 5px 0; font-weight: bold;">${vpnDetected}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-weight: 500;">Proxy Detected:</td>
                        <td style="padding: 5px 0; font-weight: bold;">${proxyDetected}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-weight: 500;">Bot Detection:</td>
                        <td style="padding: 5px 0; font-weight: bold;">${botDetected}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-weight: 500; vertical-align: middle;">Spam Score:</td>
                        <td style="padding: 5px 0; vertical-align: middle;">
                          <!-- Visual Progress Bar -->
                          <table border="0" cellpadding="0" cellspacing="0" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <tr>
                              <td style="width: 100px; height: 8px; background-color: #09090B; border-radius: 4px; overflow: hidden; padding: 0; border: 1px solid rgba(255,255,255,0.05);">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
                                  <tr>
                                    <td width="${spamScore * 10}%" style="background-color: ${spamScore > 3 ? '#EF4444' : '#22C55E'}; border-radius: 4px; padding: 0;"></td>
                                    <td width="${100 - (spamScore * 10)}%" style="padding: 0;"></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <span style="font-size: 12px; font-weight: bold; color: ${spamScore > 3 ? '#EF4444' : '#22C55E'};">${spamScore}/10</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-weight: 500;">Request ID:</td>
                        <td style="padding: 5px 0; color: #6B7280; font-family: monospace; font-size: 11px;">${requestId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QUICK ACTIONS -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div align="center" style="font-size: 11px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                      <span style="margin-right: 6px;">⚡</span>Quick Actions
                    </div>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 16px;">
                          <!-- Primary Centered Reply Button -->
                          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #22C55E; color: #FFFFFF; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 6px; padding: 11px 24px; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.25);">
                            📧 Reply to Visitor
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <!-- Grid of Actions -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="actions-grid">
                            <tr>
                              <td width="50%" style="padding: 4px;">
                                <a href="tel:${phoneClean}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                                  📞 Call Visitor
                                </a>
                              </td>
                              <td width="50%" style="padding: 4px;">
                                <a href="https://wa.me/${waClean}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                                  💬 WhatsApp
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px;">
                                <a href="${portfolioUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                                  🌐 Open Portfolio
                                </a>
                              </td>
                              <td style="padding: 4px;">
                                <a href="${resumeUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                                  📄 View Resume
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px;">
                                <a href="${linkedinUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                                  💼 LinkedIn
                                </a>
                              </td>
                              <td style="padding: 4px;">
                                <a href="${githubUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                                  🚀 GitHub Profile
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DEVELOPER PROFILE FOOTER CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <!-- Left side: logo details -->
                  <td valign="top" style="padding-right: 15px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 50px;" valign="middle">
                          <!-- Circular styled S logo -->
                          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));">
                            <circle cx="21" cy="21" r="20" fill="#09090B" stroke="#3B82F6" stroke-width="2"/>
                            <text x="21" y="27" font-family="'Inter', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">S</text>
                          </svg>
                        </td>
                        <td valign="middle" style="padding-left: 14px;">
                          <h4 style="margin: 0; font-size: 15px; color: #FFFFFF; font-weight: 700; line-height: 1.2;">Srinath</h4>
                          <p style="margin: 2px 0 0 0; font-size: 11px; color: #9CA3AF; font-weight: bold;">Full Stack Web Developer</p>
                          <p style="margin: 6px 0 0 0; font-size: 10px; color: #9CA3AF; line-height: 1.4;">
                            React &bull; Next.js &bull; Node.js &bull; Express &bull; MongoDB &bull; Java &bull; Python &bull; Android &bull; AWS &bull; Docker &bull; Linux
                          </p>
                          <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: bold;">
                            <a href="${portfolioUrl}" style="color: #3B82F6; text-decoration: none;">https://srinathdev.codes &rarr;</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <!-- Right side: Mock IDE Code Terminal Window graphic -->
                  <td width="190" valign="middle" align="right" class="profile-right">
                    <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.45));">
                      <rect width="180" height="90" rx="8" fill="#09090B" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1.2"/>
                      <!-- Top bar -->
                      <path d="M0 8 C0 3.58 3.58 0 8 0 L172 0 C176.42 0 180 3.58 180 8 L180 20 L0 20 Z" fill="#18181B" />
                      <!-- Control Buttons -->
                      <circle cx="10" cy="10" r="3" fill="#EF4444"/>
                      <circle cx="18" cy="10" r="3" fill="#F59E0B"/>
                      <circle cx="26" cy="10" r="3" fill="#10B981"/>
                      <!-- Title -->
                      <text x="90" y="13" font-family="monospace" font-size="8" fill="#71717A" text-anchor="middle">srinath.dev ~ zsh</text>
                      <!-- Mock Code -->
                      <text x="12" y="38" font-family="monospace" font-size="8" fill="#4ADE80">&gt; <tspan fill="#F43F5E">const</tspan> developer <tspan fill="#E0F2FE">=</tspan> {</text>
                      <text x="22" y="50" font-family="monospace" font-size="8" fill="#38BDF8">name: <tspan fill="#F59E0B">"Srinath"</tspan>,</text>
                      <text x="22" y="62" font-family="monospace" font-size="8" fill="#38BDF8">role: <tspan fill="#F59E0B">"Full Stack Dev"</tspan></text>
                      <text x="12" y="74" font-family="monospace" font-size="8" fill="#4ADE80">};</text>
                      <circle cx="145" cy="55" r="16" fill="rgba(59, 130, 246, 0.08)" stroke="#3B82F6" stroke-width="1" stroke-dasharray="2 2"/>
                      <path d="M141 51 L149 55 L141 59" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
              <p style="margin: 0; font-size: 10px; color: #52525B; line-height: 1.5;">
                This email was automatically generated by Srinath.dev.<br>
                &copy; 2026 Srinath Potharaju. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a premium HTML email template for visitor auto-reply confirmations.
 * Replicates the exact visual layout from the screenshots provided.
 *
 * @param {Object} data - The template variables.
 */
function generateVisitorEmailHTML(data) {
  const {
    name = 'Visitor',
    subject = 'Not Available',
    message = 'Not Available',
    portfolioUrl = 'https://srinathdev.codes',
    resumeUrl = 'https://srinathdev.codes/Resume.pdf',
    linkedinUrl = 'https://www.linkedin.com/in/srinath-potharaju/',
    githubUrl = 'https://github.com/sriinathh'
  } = data;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Reaching Out - Srinath.dev</title>
  <style>
    body, table, td, a { text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; }
    
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      background-color: #09090B;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #E4E4E7;
    }
    
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 12px !important;
      }
      .actions-grid td {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 4px 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; color: #E4E4E7;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table border="0" cellpadding="0" cellspacing="0" width="650" class="container" style="max-width: 650px; width: 100%; background-color: #09090B; border: none; padding: 0;">
          
          <!-- Top Neon Brand Glow Bar -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td height="4" style="background: linear-gradient(90deg, #22C55E 0%, #3B82F6 50%, #8B5CF6 100%); border-radius: 99px; line-height: 4px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <!-- Row 1: Pill & Logo -->
                <tr>
                  <td valign="top" style="padding-bottom: 10px;">
                    <!-- Pill Badge -->
                    <span style="display: inline-block; font-size: 9px; font-weight: bold; color: #3B82F6; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 9999px; padding: 4px 10px; letter-spacing: 0.05em; text-transform: uppercase;">
                      <span style="display: inline-block; width: 6px; height: 6px; background-color: #3B82F6; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Received
                    </span>
                  </td>
                  <td valign="top" align="right" style="padding-bottom: 10px;">
                    <div style="font-size: 15px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; line-height: 1;">
                      <span style="color: #3B82F6;">&lt;/&gt;</span> Srinath<span style="color: #3B82F6;">.dev</span>
                    </div>
                    <div style="font-size: 8px; color: #9CA3AF; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Full Stack Dev</div>
                  </td>
                </tr>
                <!-- Row 2: Title & Date -->
                <tr>
                  <td valign="bottom" style="padding-top: 5px;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1.2;">
                      🚀 Message Confirmed
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #9CA3AF; line-height: 1.3;">
                      Thank you for contacting me through my portfolio.
                    </p>
                  </td>
                  <td valign="bottom" align="right" style="font-family: monospace; font-size: 9px; color: #6B7280; line-height: 1.3; padding-top: 5px; text-align: right;">
                    <div>${currentDate}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ACKNOWLEDGEMENT TEXT -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <p style="margin-top: 0; font-size: 14px; color: #FFFFFF; font-weight: bold;">Hi ${name},</p>
                    <p style="margin: 10px 0; font-size: 13px; color: #E4E4E7; line-height: 1.6;">
                      Thanks for reaching out! I've successfully received your message regarding <strong>"${subject}"</strong>.
                    </p>
                    <p style="margin-bottom: 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
                      I will review your message and respond as soon as possible (usually within 24 hours).
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- COPY OF SUBMITTED MESSAGE -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-left: 4px solid #22C55E; border-radius: 18px; padding: 18px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-size: 11px; font-weight: 800; color: #22C55E; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
                      <span style="margin-right: 6px;">📥</span>Your Submitted Message
                    </div>
                    
                    <div style="font-size: 13px; color: #9CA3AF; line-height: 1.6; white-space: pre-wrap; font-family: inherit;">${message}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QUICK ACTIONS -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td>
                    <!-- Heading -->
                    <div style="font-size: 11px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                      <span style="margin-right: 6px;">⚡</span>Explore My Work
                    </div>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="actions-grid">
                      <tr>
                        <td width="50%" style="padding: 4px;">
                          <a href="${portfolioUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                            🌐 Open Portfolio
                          </a>
                        </td>
                        <td width="50%" style="padding: 4px;">
                          <a href="${resumeUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                            📄 View Resume
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px;">
                          <a href="${linkedinUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                            💼 LinkedIn
                          </a>
                        </td>
                        <td style="padding: 4px;">
                          <a href="${githubUrl}" style="display: block; text-align: center; background-color: #09090B; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px; padding: 10px; text-decoration: none; color: #E4E4E7; font-size: 11px; font-weight: bold;">
                            🚀 GitHub Profile
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DEVELOPER PROFILE FOOTER CARD -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 18px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
                <tr>
                  <td style="width: 50px;" valign="middle">
                    <!-- Circular styled S logo -->
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));">
                      <circle cx="21" cy="21" r="20" fill="#09090B" stroke="#3B82F6" stroke-width="2"/>
                      <text x="21" y="27" font-family="'Inter', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">S</text>
                    </svg>
                  </td>
                  <td valign="middle" style="padding-left: 14px;">
                    <h4 style="margin: 0; font-size: 15px; color: #FFFFFF; font-weight: 700; line-height: 1.2;">Srinath</h4>
                    <p style="margin: 2px 0 0 0; font-size: 11px; color: #9CA3AF; font-weight: bold;">Full Stack Web Developer</p>
                    <p style="margin: 6px 0 0 0; font-size: 10px; color: #9CA3AF; line-height: 1.4;">
                      React &bull; Next.js &bull; Node.js &bull; Express &bull; MongoDB &bull; Java &bull; Python &bull; Android &bull; AWS &bull; Docker &bull; Linux
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: bold;">
                      <a href="${portfolioUrl}" style="color: #3B82F6; text-decoration: none;">https://srinathdev.codes &rarr;</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
              <p style="margin: 0; font-size: 10px; color: #52525B; line-height: 1.5;">
                This email was automatically generated by Srinath.dev.<br>
                &copy; 2026 Srinath Potharaju. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { generateEmailHTML, generateVisitorEmailHTML };
