const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    rateLimit: 10,
  });

  return transporter;
};

/**
 * Styled HTML OTP email template
 */
const buildOtpEmailHTML = (otp, recipientName = 'Developer') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email — SkillBridge</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6C63FF,#00D4FF);border-radius:14px;width:48px;height:48px;text-align:center;vertical-align:middle;">
                    <span style="font-size:22px;line-height:48px;">🛡️</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="font-size:22px;font-weight:800;color:#E8E8F0;letter-spacing:-0.5px;">
                      Skill<span style="color:#6C63FF;">Bridge</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#12121A;border-radius:20px;border:1px solid #1E1E2E;overflow:hidden;">

              <!-- Card top accent -->
              <tr>
                <td style="height:4px;background:linear-gradient(90deg,#6C63FF,#00D4FF);"></td>
              </tr>

              <!-- Card body -->
              <tr>
                <td style="padding:40px 40px 32px;">

                  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#E8E8F0;letter-spacing:-0.5px;">
                    Verify Your Email
                  </h1>
                  <p style="margin:0 0 28px;font-size:15px;color:#9CA3AF;line-height:1.6;">
                    Hi <strong style="color:#E8E8F0;">${recipientName.split(' ')[0]}</strong>,
                    welcome to SkillBridge! Use the code below to verify your email address and activate your account.
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td align="center">
                        <div style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#4F46E5);border-radius:16px;padding:24px 40px;">
                          <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">
                            Your OTP Code
                          </p>
                          <p style="margin:0;font-size:42px;font-weight:900;color:#ffffff;letter-spacing:12px;font-family:'Courier New',monospace;">
                            ${otp}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry warning -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="background:rgba(255,193,7,0.08);border:1px solid rgba(255,193,7,0.2);border-radius:10px;padding:14px 16px;">
                        <p style="margin:0;font-size:13px;color:#FCD34D;">
                          ⏱ <strong>This code expires in 10 minutes.</strong>
                          Do not share it with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.5;">
                    If you didn't create a SkillBridge account, you can safely ignore this email.
                    Someone may have entered your email address by mistake.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0D0D15;padding:20px 40px;border-top:1px solid #1E1E2E;">
                  <p style="margin:0;font-size:12px;color:#4B5563;text-align:center;">
                    © ${new Date().getFullYear()} SkillBridge. All rights reserved.<br/>
                    Bridge the Gap Between Learning and Earning.
                  </p>
                </td>
              </tr>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buildPasswordResetHTML = (resetUrl, recipientName = 'Developer') => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Reset Password — SkillBridge</title></head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#12121A;border-radius:20px;border:1px solid #1E1E2E;overflow:hidden;">
        <tr><td style="height:4px;background:linear-gradient(90deg,#6C63FF,#00D4FF);"></td></tr>
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#E8E8F0;">Reset Your Password</h1>
          <p style="margin:0 0 28px;font-size:15px;color:#9CA3AF;line-height:1.6;">
            Hi ${recipientName.split(' ')[0]}, click the button below to reset your password.
            This link expires in <strong style="color:#E8E8F0;">1 hour</strong>.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td>
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#00D4FF);color:white;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">
                Reset Password →
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:12px;color:#6B7280;">
            If you didn't request this, ignore this email. Your password will not change.
          </p>
        </td></tr>
        <tr><td style="background:#0D0D15;padding:16px 40px;border-top:1px solid #1E1E2E;">
          <p style="margin:0;font-size:12px;color:#4B5563;text-align:center;">© ${new Date().getFullYear()} SkillBridge</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/**
 * Send OTP verification email
 */
const sendOtpEmail = async (email, otp, recipientName) => {
  const transport = getTransporter();

  await transport.sendMail({
    from: `"SkillBridge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'SkillBridge — Verify Your Email (OTP)',
    text: `Your SkillBridge verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`,
    html: buildOtpEmailHTML(otp, recipientName),
  });

  console.log(`📧 OTP email sent to ${email}`);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetUrl, recipientName) => {
  const transport = getTransporter();

  await transport.sendMail({
    from: `"SkillBridge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'SkillBridge — Reset Your Password',
    text: `Reset your password here: ${resetUrl}\n\nThis link expires in 1 hour.`,
    html: buildPasswordResetHTML(resetUrl, recipientName),
  });

  console.log(`📧 Password reset email sent to ${email}`);
};

/**
 * Verify transporter connectivity (called on server start)
 */
const verifyEmailConnection = async () => {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log('✅ Email service ready');
    return true;
  } catch (err) {
    console.warn(`⚠️  Email service not configured: ${err.message}`);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  verifyEmailConnection,
};
