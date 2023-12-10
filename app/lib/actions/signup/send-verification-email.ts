'use server';

import ConfirmEmail from '@/components/confirm-email';
import { FormErrorState } from '@/types/form-error-state';
import { renderAsync } from '@react-email/components';
import { Resend } from 'resend';

const MODE = process.env.NODE_ENV;

export async function sendVerificationEmail(user: {
  userName: string;
  id: string;
  email: string;
  hashedPassword: string;
  emailVerificationToken: string;
  emailVerificationTokenExpiredAt: Date;
}): Promise<FormErrorState> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const URL =
    MODE === 'production'
      ? 'https://lrdnext14.vercel.app'
      : 'http://localhost:3000';

  const {
    userName,
    id,
    email,
    hashedPassword,
    emailVerificationToken,
    emailVerificationTokenExpiredAt,
  } = user;

  const html = await renderAsync(
    ConfirmEmail({
      confirmEmailLink: `${URL}/auth/verify-email/${id}?token=${emailVerificationToken}&email=${email}&newPassword=${hashedPassword}&name=${userName}&expires=${emailVerificationTokenExpiredAt}`,
      userFirstname: userName,
    }) as React.ReactElement
  );

  try {
    await resend.emails.send({
      from: 'contact@lareponsedev.com',
      to: user.email,
      subject: "Vérification de l'adresse e-mail",
      html,
    });
  } catch (error) {
    return {
      errors: {
        email: ["Erreur d'envoi de l'email : veuillez réessayer plus tard."],
      },
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }

  return {
    errors: {},
    message: null,
  };
}
