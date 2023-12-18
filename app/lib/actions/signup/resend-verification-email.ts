// app/lib/actions/signup/resend-verification-email.ts

'use server';

import connect from '@/app/utils/connect-db';
import { FormErrorState } from '@/types/form-error-state';
import { redirect } from 'next/navigation';
import { sendVerificationEmail } from './send-verification-email';
import { addEmailVerificationToken } from './add-email-verification-token';
import User from '@/models/User';
import { getIdAndNameWithEmail } from '../get/get-id-and-name-with-email';

export async function resendVerificationEmail(
  prevState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  const resendVerificationEmailData = {
    email: formData.get('email')!.toString(),
  };

  const { email } = resendVerificationEmailData;

  try {
    await connect();

    const idAndName = await getIdAndNameWithEmail(email);

    if (!idAndName) {
      return {
        errors: {
          email: ['Cet e-mail n’est associé à aucun compte.'],
        },
        message: 'Veuillez vérifier vos saisies.',
      };
    }

    const { id, name } = idAndName;

    const { emailVerificationToken, emailVerificationTokenExpiredAt } =
      await addEmailVerificationToken(id, User);

    console.log({ emailVerificationToken, emailVerificationTokenExpiredAt });
    await sendVerificationEmail({
      name,
      id,
      email,
      emailVerificationToken,
      emailVerificationTokenExpiredAt,
    });
    console.log('Email sent');

    prevState.message = null;
  } catch (error) {
    return {
      errors: {},
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }
  redirect('/auth/checked-email');
}
