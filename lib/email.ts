import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLoveLetterNotification(title: string) {
  const recipientEmail = process.env.NOTIFICATION_EMAIL;

  if (!recipientEmail) {
    console.warn('NOTIFICATION_EMAIL not configured, skipping email notification');
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Love Letters <onrender@resend.dev>',
      to: recipientEmail,
      subject: '💌 You have received a new love letter!',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d9534f; text-align: center;">💕 You have received a new love letter!</h2>
          <p style="font-size: 18px; color: #333; text-align: center; margin: 20px 0;">
            <strong>${title || 'Untitled'}</strong>
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://love-letters.onrender.com'}"
               style="background-color: #d9534f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
              Read the Letter
            </a>
          </p>
          <p style="color: #666; font-size: 14px; text-align: center;">
            Open the app to read your new love letter 💌
          </p>
        </div>
      `,
    });

    console.log('Email notification sent to:', recipientEmail);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw - we don't want email failures to break letter creation
  }
}
