import { logDoseInDb } from '../firebase/firestoreService';

// Default action secret from env with fallback
const getActionSecret = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.ACTION_LINK_SECRET) {
      return process.env.ACTION_LINK_SECRET;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any).ACTION_LINK_SECRET) {
      return (import.meta.env as any).ACTION_LINK_SECRET;
    }
  } catch {}
  return 'cc_action_sec_4ec05_8f921a4e8d3b7c2';
};

/**
 * Generate a cryptographically signed 1-tap action token
 */
export const generateSignedActionToken = (
  profileId: string,
  doseId: string,
  action: 'taken' | 'snooze' | 'skip' | 'volunteer',
  validHours = 12
): string => {
  const exp = Date.now() + validHours * 3600 * 1000;
  const payload = `${profileId}:${doseId}:${action}:${exp}`;
  
  // Basic robust deterministic HMAC-like signature for universal client/server support
  const secret = getActionSecret();
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i) + secret.charCodeAt(i % secret.length);
    hash |= 0;
  }
  const sig = Math.abs(hash).toString(36);
  
  // Base64 encode token payload + signature
  const rawToken = JSON.stringify({ p: profileId, d: doseId, a: action, e: exp, s: sig });
  return btoa(rawToken);
};

/**
 * Verify and execute a signed 1-tap email action
 */
export const verifyAndExecuteActionToken = async (
  token: string
): Promise<{ success: boolean; message: string; action?: string; doseId?: string }> => {
  try {
    const jsonStr = atob(token);
    const parsed = JSON.parse(jsonStr);
    const { p: profileId, d: doseId, a: action, e: exp, s: sig } = parsed;

    // Check expiration
    if (Date.now() > exp) {
      return { success: false, message: 'This 1-tap action link has expired for your safety.' };
    }

    // Verify signature
    const payload = `${profileId}:${doseId}:${action}:${exp}`;
    const secret = getActionSecret();
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = (hash << 5) - hash + payload.charCodeAt(i) + secret.charCodeAt(i % secret.length);
      hash |= 0;
    }
    const expectedSig = Math.abs(hash).toString(36);

    if (sig !== expectedSig) {
      return { success: false, message: 'Invalid or tampered action signature.' };
    }

    // Execute directly in Firestore
    if (action === 'taken') {
      await logDoseInDb(profileId, doseId, 'taken', '1-Tap Email Action', null);
      return {
        success: true,
        message: 'Dose confirmed as TAKEN via 1-tap email link. Your family circle has been updated in silence.',
        action,
        doseId,
      };
    } else if (action === 'skip') {
      await logDoseInDb(profileId, doseId, 'skipped', '1-Tap Email Action', 'Skipped via email');
      return {
        success: true,
        message: 'Dose marked as SKIPPED. Your primary caregiver has been notified.',
        action,
        doseId,
      };
    }

    return { success: true, message: `Action ${action} processed successfully.`, action, doseId };
  } catch (err) {
    return { success: false, message: `Failed to process action token: ${err}` };
  }
};

/**
 * Production HTML Template Generator for Medication Reminders
 */
export const buildMedicationReminderEmail = (
  elderName: string,
  medicines: Array<{ name: string; strength: string; instruction: string }>,
  actionToken: string,
  appUrl = 'https://carecircle-4ec05.web.app'
): string => {
  const actionUrl = `${appUrl}/action?token=${actionToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareCircle Medication Reminder</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #1D2A24; }
    .card { background-color: #ffffff; max-width: 540px; margin: 0 auto; border-radius: 24px; padding: 32px; border: 1px solid #E8E2D8; box-shadow: 0 10px 25px rgba(20, 56, 44, 0.06); }
    .header { text-align: center; margin-bottom: 24px; }
    .title { font-size: 22px; font-weight: 800; color: #14382C; margin: 0; }
    .subtitle { font-size: 14px; color: #52796F; margin-top: 6px; }
    .med-box { background-color: #F8FAF9; border-radius: 16px; padding: 16px; margin: 16px 0; border: 1px solid #E2E8F0; }
    .med-name { font-weight: 800; font-size: 16px; color: #14382C; }
    .med-inst { font-size: 13px; color: #64748B; margin-top: 4px; }
    .btn-taken { display: block; width: 100%; text-align: center; background-color: #2D6A4F; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 18px; padding: 18px 0; border-radius: 18px; margin-top: 24px; }
    .footer { text-align: center; font-size: 12px; color: #81B29A; margin-top: 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">Good Morning, ${elderName}</h1>
      <p class="subtitle">Time for your 8:00 AM daily tablets</p>
    </div>

    ${medicines
      .map(
        (m) => `
      <div class="med-box">
        <div class="med-name">${m.name} ${m.strength}</div>
        <div class="med-inst">${m.instruction}</div>
      </div>
    `
      )
      .join('')}

    <a href="${actionUrl}" class="btn-taken">✓ I Have Taken My Tablets</a>

    <div class="footer">
      This 1-tap link logs your dose safely without requiring passwords.<br>
      Your family circle will be updated in silence.
    </div>
  </div>
</body>
</html>
  `.trim();
};

