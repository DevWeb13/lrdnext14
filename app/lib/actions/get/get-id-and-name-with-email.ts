// app/lib/actions/get/get-id-and-name-with-email.ts

import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import type { EmailVerificationAppUserInfo } from '@/types/app-user';

export async function getIdAndNameWithEmail(
  email: string,
): Promise<EmailVerificationAppUserInfo | null> {
  try {
    await connect();

    const user = await User.findOne({ email });

    const { _id, name } = user;

    if (user) {
      const simpleUser = {
        id: _id.toString(),
        name,
      };

      return simpleUser;
    }
    return null;
  } catch (error) {
    console.error('Failed to connect database ', error);
    return null;
  }
}
