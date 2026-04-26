import { sealData, unsealData } from 'iron-session';

const SECRET = process.env.SESSION_SECRET || 'default-dev-secret-change-in-production';

export interface SessionData {
  authenticated: boolean;
}

export async function encryptSession(data: SessionData): Promise<string> {
  return sealData(data, { password: SECRET });
}

export async function decryptSession(sealed: string): Promise<SessionData | null> {
  try {
    return await unsealData<SessionData>(sealed, { password: SECRET });
  } catch {
    return null;
  }
}
