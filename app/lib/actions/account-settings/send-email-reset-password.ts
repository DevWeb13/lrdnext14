'use server';

import ResetPasswordEmail from '@/components/reset-password-email';
import { EmailResetPassword } from '@/schema/zod/user-form-schema';
import { FormErrorState } from '@/types/form-error-state';
import { renderAsync } from '@react-email/components';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { addResetPasswordToken } from './add-reset-password-token';
import connect from '@/app/utils/connect-db';
import User from '@/models/User';

const MODE = process.env.NODE_ENV;

export async function sendEmailResetPassword(
  prevState: FormErrorState,
  formData: FormData
): Promise<FormErrorState | void> {
  try {
    // Valider les données du formulaire
    const validatedUser = EmailResetPassword.safeParse({
      email: formData.get('email'),
    });

    if (!validatedUser.success) {
      return {
        errors: validatedUser.error.flatten().fieldErrors,
        message: 'Veuillez vérifier vos saisies.',
      };
    }

    const { email } = validatedUser.data;

    await connect();
    const user = await User.findOne({ email });
    if (!user) {
      return {
        errors: { email: ["Cet e-mail n'est pas associé à un compte."] },
        message: 'Veuillez vérifier vos saisies.',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetPasswordToken = await addResetPasswordToken(user.email, User);

    const URL =
      MODE === 'production'
        ? 'https://lrdnext14.vercel.app'
        : 'http://localhost:3000';

    const html = await renderAsync(
      ResetPasswordEmail({
        resetPasswordLink: `${URL}/auth/reset-password/${user._id}?token=${resetPasswordToken}&email=${user.email}`,
        userFirstname: user.name,
      }) as React.ReactElement
    );

    await resend.emails.send({
      from: 'contact@lareponsedev.com',
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html,
    });

    // Pas d'erreur, redirection vers login
    redirect('/auth/login');
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de réinitialisation :",
      error
    );
    return {
      errors: {},
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }
}
