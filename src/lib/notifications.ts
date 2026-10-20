/**
 * Kalaivani Sainik Academy — Lead & Staff Notification Dispatcher
 * Dispatches real-time alerts when new admissions inquiries arrive.
 */

export interface LeadNotificationPayload {
  contactId: string;
  parentName: string;
  phone: string;
  studentName?: string | null;
  courseInterest: string;
  preferredCallbackWindow?: string | null;
  message?: string | null;
  sourceUrl?: string | null;
}

export async function dispatchLeadNotification(lead: LeadNotificationPayload): Promise<void> {
  const webhookUrl = process.env.LEAD_NOTIFICATION_WEBHOOK_URL;
  const alertEmail = process.env.ADMISSIONS_ALERT_EMAIL;

  const summary = `🎓 New Admission Lead: ${lead.parentName} (${lead.phone}) | Course: ${lead.courseInterest} | Callback: ${lead.preferredCallbackWindow || 'Standard'}`;
  console.log(`[LEAD NOTIFICATION] ${summary}`);

  // 1. Dispatch Webhook (Slack, Discord, WhatsApp Gateway, Zapier, Make)
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead.created',
          timestamp: new Date().toISOString(),
          lead: {
            id: lead.contactId,
            parentName: lead.parentName,
            phone: lead.phone,
            studentName: lead.studentName || 'Not specified',
            course: lead.courseInterest,
            preferredCallback: lead.preferredCallbackWindow || 'Anytime',
            message: lead.message || 'None',
            sourceUrl: lead.sourceUrl || '/',
          },
          text: `🔔 *New Sainik Academy Enquiry*\n*Parent:* ${lead.parentName}\n*Phone:* ${lead.phone}\n*Course:* ${lead.courseInterest}\n*Callback:* ${lead.preferredCallbackWindow || 'Standard'}`,
        }),
      });

      if (!response.ok) {
        console.warn(`[NOTIFICATION WARNING] Webhook returned status: ${response.status}`);
      }
    } catch (err: unknown) {
      console.error('[NOTIFICATION ERROR] Failed to dispatch lead webhook:', err);
    }
  }

  // 2. Email Notification Hook (e.g. Resend / SMTP if configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && alertEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Kalaivani Sainik Academy <admissions@kalaivanisainikcoachingcentre.org.in>',
          to: alertEmail,
          subject: `New Admission Enquiry: ${lead.parentName} (${lead.courseInterest})`,
          html: `
            <h2>New Student Admission Enquiry</h2>
            <p><strong>Parent Name:</strong> ${lead.parentName}</p>
            <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
            <p><strong>Student Name:</strong> ${lead.studentName || 'Not specified'}</p>
            <p><strong>Course of Interest:</strong> ${lead.courseInterest}</p>
            <p><strong>Preferred Callback Window:</strong> ${lead.preferredCallbackWindow || 'Standard'}</p>
            <p><strong>Notes / Message:</strong> ${lead.message || 'None'}</p>
            <hr />
            <p><a href="https://kalaivanisainikcoachingcentre.org.in/admin/pipeline">Open Admission CRM Pipeline</a></p>
          `,
        }),
      });
    } catch (emailErr) {
      console.error('[NOTIFICATION ERROR] Failed to dispatch alert email:', emailErr);
    }
  }
}
