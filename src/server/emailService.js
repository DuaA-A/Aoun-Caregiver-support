import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aoun.caregiver.support@gmail.com',
    pass: 'miht sxky dcgq oftz',
  },
});

export default function emailServicePlugin() {
  return {
    name: 'email-service',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { to, type, data } = JSON.parse(body);
              console.log(`[Email Service] Incoming request: type=${type}, to=${to}`);
              let subject = '';
              let html = '';

              const styles = `
                <style>
                  body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; padding: 20px; }
                  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                  .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
                  .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
                  .content { padding: 30px; }
                  .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
                  .btn { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
                </style>
              `;

              if (type === 'signup') {
                subject = 'Welcome to Aoun Caregiver Support!';
                html = `
                  ${styles}
                  <div class="container">
                    <div class="header">
                      <h1>Welcome to Aoun</h1>
                    </div>
                    <div class="content">
                      <h2>Hello ${data.displayName || 'Caregiver'},</h2>
                      <p>Thank you for joining the Aoun Caregiver Support community. We are here to support you in managing care for ${data.patientName || 'your loved one'}.</p>
                      <p>Our platform helps you track medications, monitor behaviors, and receive timely alerts to make your caregiving journey smoother.</p>
                      <a href="https://aoun-caregiver-support.vercel.app/" class="btn">Go to Dashboard</a>
                    </div>
                    <div class="footer">
                      &copy; ${new Date().getFullYear()} Aoun Caregiver Support. All rights reserved.
                    </div>
                  </div>
                `;
              } else if (type === 'login') {
                subject = 'New Sign-in to Your Aoun Account';
                html = `
                  ${styles}
                  <div class="container">
                    <div class="header">
                      <h1>Security Alert</h1>
                    </div>
                    <div class="content">
                      <h2>Hello,</h2>
                      <p>We noticed a new sign-in to your Aoun account on ${new Date().toLocaleString()}.</p>
                      <p>If this was you, no further action is required. If you did not authorize this login, please change your password immediately and contact support.</p>
                    </div>
                    <div class="footer">
                      &copy; ${new Date().getFullYear()} Aoun Caregiver Support. All rights reserved.
                    </div>
                  </div>
                `;
              } else if (type === 'drug_reminder') {
                subject = `Medication Reminder: ${data.drugName}`;
                html = `
                  ${styles}
                  <div class="container">
                    <div class="header">
                      <h1>Time for Medication</h1>
                    </div>
                    <div class="content">
                      <h2>Medication Alert</h2>
                      <p>It's time to administer the following medication:</p>
                      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #166534;">${data.drugName}</h3>
                        <p style="margin: 0; color: #166534; font-weight: bold;">Time: ${data.time}</p>
                      </div>
                      <p>Please log into your dashboard to mark this medication as taken to ensure accurate adherence tracking.</p>
                      <a href="https://aoun-caregiver-support.vercel.app/" class="btn">Mark as Taken</a>
                    </div>
                    <div class="footer">
                      &copy; ${new Date().getFullYear()} Aoun Caregiver Support. All rights reserved.
                    </div>
                  </div>
                `;
              }

              await transporter.sendMail({
                from: '"Aoun Support" <aoun.caregiver.support@gmail.com>',
                to,
                subject,
                html,
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              console.error('Email error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}
