import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Attach requested Gmail OAuth scopes
provider.addScope('https://mail.google.com/');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google to grant Gmail access
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('تعذر الحصول على رمز الوصول من حساب Google');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Gmail OAuth sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGmail = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

interface SendVoucherParams {
  to: string;
  clientName: string;
  voucherId: string;
  consultationTitle: string;
  date: string;
  timeSlot: string;
  clientPhone: string;
  companyName?: string;
}

// Encode email into RFC 2822 base64url format for Gmail API
function encodeRFC2822(to: string, from: string, subject: string, htmlBody: string) {
  const str = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    htmlBody
  ].join('\r\n');

  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends a styled HTML Voucher Confirmation email using the active Gmail API access token
 */
export const sendGmailVoucherEmail = async (params: SendVoucherParams): Promise<{ success: boolean; id?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('يرجى تسجيل الدخول بحساب Google / Gmail أولاً لتأكيد إرسال الإشعار الإلكتروني');
  }

  const currentUser = auth.currentUser;
  const senderEmail = currentUser?.email || 'admin@sirwan-wr.com';

  const subject = `تأكيد حجز قسيمة الموعد [${params.voucherId}] - استوديو سيروان كتابة وتطوير المحتوى`;

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; direction: rtl; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #020617; color: #ffffff; padding: 30px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #f59e0b; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
        .content { padding: 28px 24px; }
        .greeting { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 12px; }
        .intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .voucher-card { background: #fffbeb; border: 1px solid #fde68a; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
        .voucher-title { font-size: 12px; font-weight: bold; color: #b45309; text-transform: uppercase; margin-bottom: 8px; }
        .voucher-id { font-family: monospace; font-size: 18px; font-weight: bold; color: #020617; background: #ffffff; padding: 6px 12px; border-radius: 8px; border: 1px solid #fcd34d; display: inline-block; }
        .details-grid { display: table; width: 100%; margin-top: 16px; border-collapse: collapse; }
        .detail-row { display: table-row; }
        .detail-cell { display: table-cell; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #fef3c7; }
        .detail-label { color: #78350f; font-weight: bold; width: 35%; }
        .detail-value { color: #0f172a; font-weight: bold; }
        .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .badge { background: #10b981; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>سيروان | SIRWAN</h1>
          <p>استوديو صياغة وتطوير المحتوى للأفراد والمنشآت</p>
        </div>
        <div class="content">
          <div class="greeting">مرحباً ${params.clientName} 👋</div>
          <div class="intro">
            تم استلام وتأكيد حجز جلسة الاستشارة بنجاح. فيما يلي بيانات قسيمة الحجز الخاصة بكم وموعد اللقاء:
          </div>
          
          <div class="voucher-card">
            <div class="voucher-title">رمز القسيمة / التكليف <span class="badge">مؤكد</span></div>
            <div class="voucher-id">${params.voucherId}</div>
            
            <div class="details-grid">
              <div class="detail-row">
                <div class="detail-cell detail-label">نوع الجلسة:</div>
                <div class="detail-cell detail-value">${params.consultationTitle}</div>
              </div>
              <div class="detail-row">
                <div class="detail-cell detail-label">التاريخ والوقت:</div>
                <div class="detail-cell detail-value">${params.date} - ${params.timeSlot}</div>
              </div>
              <div class="detail-row">
                <div class="detail-cell detail-label">المستفيد:</div>
                <div class="detail-cell detail-value">${params.clientName}</div>
              </div>
              <div class="detail-row">
                <div class="detail-cell detail-label">رقم التواصل:</div>
                <div class="detail-cell detail-value">${params.clientPhone}</div>
              </div>
            </div>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            سيتواصل معكم فريق الاستشارين قبل موعد الجلسة لتنسيق رابط الاجتماع أو تأكيد وسيلة الاتصال المباشرة.
          </p>
        </div>
        <div class="footer">
          استوديو سيروان لكتابة وتطوير المحتوى • جميع الحقوق محفوظة © ${new Date().getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `;

  const rawMessage = encodeRFC2822(params.to, senderEmail, subject, htmlContent);

  const res = await fetch('https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawMessage })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Gmail API send error:', errorData);
    throw new Error(errorData.error?.message || `خطأ في إرسال البريد عبر Gmail API (رمز ${res.status})`);
  }

  const result = await res.json();
  return { success: true, id: result.id };
};
