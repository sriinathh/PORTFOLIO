/**
 * Generates a premium HTML email template for portfolio contact form submissions.
 * Replicates the award-winning Vercel/Linear light dashboard notifications.
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

  const phoneClean = phone !== 'Not Available' && phone !== 'Not Provided' ? phone.replace(/[^0-9+]/g, '') : '';
  const waClean = phoneClean; // WhatsApp uses clean phone number directly

  const hasEmail = email && email !== 'Not Available' && email !== 'Not Provided';
  const hasPhone = phone && phone !== 'Not Available' && phone !== 'Not Provided';
  const hasCompany = company && company !== 'Not Available' && company !== 'Not Provided';

  // Format Email and Phone details with links dynamically
  const emailRow = hasEmail
    ? `<a href="mailto:${email}" style="color: #2563EB; text-decoration: none; font-weight: 500;">${email}</a>`
    : `<span style="color: #F59E0B; font-weight: 500;">Not Provided</span>`;

  const phoneRow = hasPhone
    ? `<a href="tel:${phoneClean}" style="color: #2563EB; text-decoration: none; font-weight: 500;">${phone}</a>`
    : `<span style="color: #F59E0B; font-weight: 500;">Not Provided</span>`;

  // Format location
  const locationParts = [city, finalState, country].filter(p => p && p !== 'Not Available');
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Not Available';

  // Format browser version
  const browserStr = browser !== 'Not Available'
    ? `${browser}`.trim()
    : 'Not Available';
  
  // Format Date and Time
  let dateStr = '';
  let timeStr = '';
  let tzStr = '';

  if (finalSubmittedAt) {
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
    tzStr = 'GMT+5:30'; 
  }

  const dateTimeStr = tzStr ? `${dateStr}, ${timeStr} ${tzStr}` : (timeStr ? `${dateStr} at ${timeStr}` : dateStr);

  // Security checks
  const vpnDetected = security.vpn ? '<span style="color: #DC2626; font-weight: bold;">Detected</span>' : '<span style="color: #16A34A; font-weight: bold;">Not Detected</span>';
  const proxyDetected = security.proxy ? '<span style="color: #DC2626; font-weight: bold;">Detected</span>' : '<span style="color: #16A34A; font-weight: bold;">Not Detected</span>';
  const botDetected = security.bot ? '<span style="color: #DC2626; font-weight: bold;">Detected</span>' : '<span style="color: #16A34A; font-weight: bold;">Human Verified</span>';
  const finalRequestId = requestId || `req_${Date.now().toString(36)}`;

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
      background-color: #F8FAFC;
      font-family: Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #111827;
    }
    @media screen and (max-width: 680px) {
      .container {
        width: 100% !important;
        padding: 0 16px !important;
      }
      .col-half {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .quick-actions td {
        display: block !important;
        margin-bottom: 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; color: #111827;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="640" class="container" style="max-width: 640px; width: 100%; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          
          <!-- Gradient Top Border -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563EB 0%, #7C3AED 100%); line-height: 4px; font-size: 1px;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #F1F5F9;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: bold; color: #111827; letter-spacing: -0.5px;">Srinath.dev</span>
                    <span style="font-size: 13px; color: #64748B; margin-left: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Full Stack Developer</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- STATUS & TITLE -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 999px; padding: 4px 12px; display: inline-block; margin-bottom: 16px;">
                <span style="color: #059669; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">&#9679; NEW MESSAGE</span>
              </div>
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold; color: #111827;">New Portfolio Contact</h1>
              <p style="margin: 0; font-size: 15px; color: #64748B; line-height: 1.5;">A new visitor has contacted you through your portfolio.</p>
            </td>
          </tr>

          <!-- CONTACT INFORMATION -->
          <tr>
            <td style="padding: 16px 32px;">
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Contact Information</h3>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 12px; font-size: 15px;">
                      <span style="color: #64748B; display: inline-block; width: 24px;">&#128100;</span>
                      <strong style="color: #111827; display: inline-block; width: 80px;">NAME</strong>
                      <span style="color: #334155;">${name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; font-size: 15px;">
                      <span style="color: #64748B; display: inline-block; width: 24px;">&#9993;</span>
                      <strong style="color: #111827; display: inline-block; width: 80px;">EMAIL</strong>
                      ${emailRow}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; font-size: 15px;">
                      <span style="color: #64748B; display: inline-block; width: 24px;">&#128241;</span>
                      <strong style="color: #111827; display: inline-block; width: 80px;">PHONE</strong>
                      ${phoneRow}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 15px;">
                      <span style="color: #64748B; display: inline-block; width: 24px;">&#127991;</span>
                      <strong style="color: #111827; display: inline-block; width: 80px;">SUBJECT</strong>
                      <span style="color: #334155; font-weight: 500;">${subject}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- VISITOR MESSAGE -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Visitor Message</h3>
              <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid #2563EB; border-radius: 4px 8px 8px 4px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #111827; white-space: pre-wrap; word-break: break-word;">${message}</p>
              </div>
            </td>
          </tr>

          <!-- VISITOR DETAILS (ANALYTICS) -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Visitor Details</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px;">
                <tr>
                  <td class="col-half" width="50%" valign="top" style="padding: 20px; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
                    <span style="font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">&#127757; Location</span><br>
                    <span style="font-size: 14px; color: #111827; font-weight: 500; display: block; margin-top: 4px;">${locationStr}</span>
                  </td>
                  <td class="col-half" width="50%" valign="top" style="padding: 20px; border-bottom: 1px solid #E2E8F0;">
                    <span style="font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">&#127760; Browser</span><br>
                    <span style="font-size: 14px; color: #111827; font-weight: 500; display: block; margin-top: 4px;">${browserStr}</span>
                  </td>
                </tr>
                <tr>
                  <td class="col-half" width="50%" valign="top" style="padding: 20px; border-right: 1px solid #E2E8F0;">
                    <span style="font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">&#128187; Device & OS</span><br>
                    <span style="font-size: 14px; color: #111827; font-weight: 500; display: block; margin-top: 4px;">${finalDevice} &bull; ${os}</span>
                  </td>
                  <td class="col-half" width="50%" valign="top" style="padding: 20px;">
                    <span style="font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600;">&#128338; Time</span><br>
                    <span style="font-size: 14px; color: #111827; font-weight: 500; display: block; margin-top: 4px;">${dateTimeStr}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SECURITY STATUS -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Security Status</h3>
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="padding-bottom: 10px; color: #334155;">&#128373; VPN Detection</td>
                    <td align="right" style="padding-bottom: 10px;">${vpnDetected}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px; color: #334155;">&#128373; Proxy Detection</td>
                    <td align="right" style="padding-bottom: 10px;">${proxyDetected}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px; color: #334155;">&#129302; Bot Detection</td>
                    <td align="right" style="padding-bottom: 10px;">${botDetected}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px; color: #334155;">&#128202; Spam Score</td>
                    <td align="right" style="padding-bottom: 10px;"><strong style="color: #111827;">${spamScore} / 10</strong></td>
                  </tr>
                  <tr>
                    <td style="color: #334155;">&#128273; Request ID</td>
                    <td align="right"><span style="color: #64748B; font-family: monospace;">${finalRequestId}</span></td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- QUICK ACTIONS -->
          <tr>
            <td style="padding: 24px 32px;">
              <h3 style="margin: 0 0 16px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Quick Actions</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="quick-actions">
                <tr>
                  ${hasEmail ? `
                  <td valign="top" style="padding-right: 12px;">
                    <a href="mailto:${email}" style="display: block; text-align: center; background-color: #2563EB; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 20px; border-radius: 6px;">&#9993; Reply to Visitor</a>
                  </td>
                  ` : ''}
                  ${hasPhone ? `
                  <td valign="top" style="padding-right: 12px;">
                    <a href="tel:${phoneClean}" style="display: block; text-align: center; background-color: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; font-size: 14px; font-weight: 600; text-decoration: none; padding: 11px 20px; border-radius: 6px;">&#128222; Call</a>
                  </td>
                  <td valign="top" style="padding-right: 12px;">
                    <a href="https://wa.me/${waClean}" style="display: block; text-align: center; background-color: #F0FDF4; color: #16A34A; border: 1px solid #BBF7D0; font-size: 14px; font-weight: 600; text-decoration: none; padding: 11px 20px; border-radius: 6px;">&#128172; WhatsApp</a>
                  </td>
                  ` : ''}
                  ${!hasEmail && !hasPhone ? `
                  <td valign="top">
                    <span style="color: #94A3B8; font-size: 14px; font-style: italic;">No contact methods provided</span>
                  </td>
                  ` : ''}
                </tr>
              </table>
            </td>
          </tr>

          <!-- PORTFOLIO PROFILE CARD -->
          <tr>
            <td style="padding: 16px 32px 32px 32px;">
              <div style="background-color: #111827; border-radius: 12px; padding: 24px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td>
                      <h4 style="margin: 0 0 4px 0; font-size: 18px; color: #FFFFFF; font-weight: bold;">Srinath</h4>
                      <p style="margin: 0 0 16px 0; font-size: 14px; color: #94A3B8;">Full-Stack Developer</p>
                      <p style="margin: 0 0 16px 0; font-size: 12px; color: #CBD5E1; line-height: 1.6;">
                        React &bull; Node.js &bull; MongoDB &bull; Java<br>
                        Python &bull; Android &bull; AWS &bull; Docker &bull; Linux
                      </p>
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right: 16px;"><a href="${portfolioUrl}" style="color: #38BDF8; font-size: 13px; text-decoration: none; font-weight: 500;">Portfolio &rarr;</a></td>
                          <td style="padding-right: 16px;"><a href="${resumeUrl}" style="color: #38BDF8; font-size: 13px; text-decoration: none; font-weight: 500;">Resume &rarr;</a></td>
                          <td style="padding-right: 16px;"><a href="${linkedinUrl}" style="color: #38BDF8; font-size: 13px; text-decoration: none; font-weight: 500;">LinkedIn &rarr;</a></td>
                          <td><a href="${githubUrl}" style="color: #38BDF8; font-size: 13px; text-decoration: none; font-weight: 500;">GitHub &rarr;</a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <!-- FOOTER -->
        <table border="0" cellpadding="0" cellspacing="0" width="640" style="max-width: 640px; width: 100%;">
          <tr>
            <td align="center" style="padding: 24px 32px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #64748B;">Srinath.dev &bull; Full-Stack Developer</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #94A3B8;">Built with passion and code.</p>
              <p style="margin: 0; font-size: 11px; color: #CBD5E1;">This email was automatically generated by Srinath.dev.</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #CBD5E1;">&copy; ${new Date().getFullYear()} Srinath Potharaju. All rights reserved.</p>
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
 * Generates a premium HTML email template for the visitor confirmation.
 * Replicates the SaaS light notification style.
 *
 * @param {Object} data - The template variables.
 */
function generateVisitorEmailHTML(data) {
  const {
    name = 'Visitor',
    subject = 'No Subject',
    message = 'Not Available'
  } = data;

  const portfolioUrl = 'https://srinathdev.codes';
  const resumeUrl = 'https://srinathdev.codes/Resume.pdf';
  const linkedinUrl = 'https://www.linkedin.com/in/srinath-potharaju/';
  const githubUrl = 'https://github.com/sriinathh';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received</title>
  <style>
    body, table, td, a { text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      background-color: #F8FAFC;
      font-family: Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #111827;
    }
    @media screen and (max-width: 680px) {
      .container {
        width: 100% !important;
        padding: 0 16px !important;
      }
      .actions-link td {
        display: block !important;
        padding: 8px 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; color: #111827;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="640" class="container" style="max-width: 640px; width: 100%; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          
          <!-- Gradient Top Border -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563EB 0%, #7C3AED 100%); line-height: 4px; font-size: 1px;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #F1F5F9;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: bold; color: #111827; letter-spacing: -0.5px;">Srinath.dev</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- STATUS & TITLE -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 999px; padding: 4px 12px; display: inline-block; margin-bottom: 16px;">
                <span style="color: #059669; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">&#10003; MESSAGE RECEIVED</span>
              </div>
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #111827;">Message Confirmed</h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #334155; line-height: 1.6;">Hi ${name},</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #334155; line-height: 1.6;">Thanks for reaching out through my portfolio. I've successfully received your message regarding:</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827;">"${subject}"</p>
              <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">I will review your message and respond as soon as possible.</p>
            </td>
          </tr>

          <!-- SUBMITTED MESSAGE -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Your Submitted Message</h3>
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569; white-space: pre-wrap; font-style: italic;">"${message}"</p>
              </div>
            </td>
          </tr>

          <!-- EXPLORE LINKS -->
          <tr>
            <td style="padding: 24px 32px 16px 32px;">
              <h3 style="margin: 0 0 16px 0; font-size: 12px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Explore My Work</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="actions-link">
                <tr>
                  <td style="padding-right: 16px;"><a href="${portfolioUrl}" style="color: #2563EB; font-size: 14px; font-weight: 600; text-decoration: none;">&#127760; Open Portfolio</a></td>
                  <td style="padding-right: 16px;"><a href="${resumeUrl}" style="color: #2563EB; font-size: 14px; font-weight: 600; text-decoration: none;">&#128196; View Resume</a></td>
                  <td style="padding-right: 16px;"><a href="${linkedinUrl}" style="color: #2563EB; font-size: 14px; font-weight: 600; text-decoration: none;">&#128188; LinkedIn</a></td>
                  <td><a href="${githubUrl}" style="color: #2563EB; font-size: 14px; font-weight: 600; text-decoration: none;">&#128187; GitHub</a></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PORTFOLIO PROFILE CARD -->
          <tr>
            <td style="padding: 16px 32px 32px 32px;">
              <div style="background-color: #111827; border-radius: 12px; padding: 24px; text-align: center;">
                <h4 style="margin: 0 0 4px 0; font-size: 18px; color: #FFFFFF; font-weight: bold;">Srinath</h4>
                <p style="margin: 0; font-size: 14px; color: #94A3B8;">Full-Stack Developer</p>
              </div>
            </td>
          </tr>
        </table>

        <!-- FOOTER -->
        <table border="0" cellpadding="0" cellspacing="0" width="640" style="max-width: 640px; width: 100%;">
          <tr>
            <td align="center" style="padding: 24px 32px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #64748B;">Srinath.dev &bull; Full-Stack Developer</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #94A3B8;">Built with passion and code.</p>
              <p style="margin: 0; font-size: 11px; color: #CBD5E1;">This email was automatically generated by Srinath.dev.</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #CBD5E1;">&copy; ${new Date().getFullYear()} Srinath Potharaju. All rights reserved.</p>
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
