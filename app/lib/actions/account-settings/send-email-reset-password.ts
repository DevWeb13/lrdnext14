'use server';

import { EmailResetPassword } from '@/schema/zod/user-form-schema';
import { FormErrorState } from '@/types/form-error-state';
import { renderAsync } from '@react-email/components';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { addResetPasswordToken } from './add-reset-password-token';
import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import EmailTemplate from '@/components/email-template';

const MODE = process.env.NODE_ENV;

export async function sendEmailResetPassword(
  prevState: FormErrorState,
  formData: FormData
): Promise<FormErrorState> {
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

    if (!user.password) {
      return {
        errors: {
          email: [
            "Ce compte n'est pas validé, veuillez valider votre email pour pouvoir réinitialiser votre mot de passe.",
          ],
        },
        message:
          'Veuillez valider votre compte pour pouvoir réinitialiser votre mot de passe.',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetPasswordToken = await addResetPasswordToken(user.email, User);

    const URL =
      MODE === 'production'
        ? 'https://lrdnext14.vercel.app'
        : 'http://localhost:3000';

    const html = await renderAsync(
      EmailTemplate({
        userName: user.name,
        link: `${URL}/auth/reset-password/${user._id}?token=${resetPasswordToken}&email=${user.email}`,
        previewText: 'Réinitialiser votre mot de passe',
        sectionText:
          "Quelqu&apos;un a récemment demandé un changement de mot de passe pour votre compte LaReponseDev. Si c'est votre cas, vous pouvez définir un nouveau mot de passe ici.",
        buttonText: 'Réinitialiser votre mot de passe',
        footerIntroText:
          "Si vous ne souhaitez pas modifier votre mot de passe ou si vous ne l'avez pas demandé, ignorez et supprimez simplement ce message.",
      }) as React.ReactElement
    );

    await resend.emails.send({
      from: 'contact@lareponsedev.com',
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html,
    });
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
  // Pas d'erreur, redirection vers login
  redirect('/auth/login');
}
