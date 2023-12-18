'use server';

import EmailTemplate from '@/components/email-template';
import { FormErrorState } from '@/types/form-error-state';
import { renderAsync } from '@react-email/components';
import { Resend } from 'resend';

const MODE = process.env.NODE_ENV;

export async function sendVerificationEmail(user: {
  name: string;
  id: string;
  email: string;
  emailVerificationToken: string;
  emailVerificationTokenExpiredAt: Date;
}): Promise<FormErrorState> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const URL =
    MODE === 'production'
      ? 'https://lrdnext14.vercel.app'
      : 'http://localhost:3000';

  const {
    name,
    id,
    email,
    emailVerificationToken,
    emailVerificationTokenExpiredAt,
  } = user;

  const html = await renderAsync(
    EmailTemplate({
      userName: name,
      link: `${URL}/auth/verify-email/${id}?token=${emailVerificationToken}&email=${email}&name=${name}&expires=${emailVerificationTokenExpiredAt}`,
      previewText: 'Confirmer votre adresse e-mail',
      sectionText:
        'Bienvenue sur LaReponseDev ! Nous sommes ravis de vous compter parmi nos membres. Veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous.',
      buttonText: 'Confirmer votre adresse e-mail',
      footerIntroText: 'Nous vous remercions de votre confiance.',
    }) as React.ReactElement,
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
