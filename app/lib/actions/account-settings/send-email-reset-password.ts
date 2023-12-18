// app/lib/actions/account-settings/send-email-reset-password.ts

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

/**
 * The function `sendEmailResetPassword` sends an email to the user with a reset password link, after
 * validating the form data and checking if the user exists and is in the correct status.
 * @param {FormErrorState} prevState - The `prevState` parameter is the previous state of the form
 * errors. It is an object that contains the errors and the message from the previous form submission.
 * @param {FormData} formData - The `formData` parameter is an object that contains the data submitted
 * in the form. It is of type `FormData`, which is a built-in JavaScript class used to handle form
 * data. In this case, it is used to retrieve the value of the email field from the form.
 * @returns a Promise that resolves to a FormErrorState object.
 */
export async function sendEmailResetPassword(
  prevState: FormErrorState,
  formData: FormData,
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
        errors: {},
        message: "Cet e-mail n'est pas associé à un compte.",
      };
    }

    if (user.status === 'pendingVerification') {
      return {
        errors: {
          email: [email],
        },
        message:
          "Votre compte n'est pas encore activé. Veuillez vérifier votre boîte de réception pour le lien d'activation.",
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
          "Quelqu'un a récemment demandé un changement de mot de passe pour votre compte LaReponseDev. Si c'est votre cas, vous pouvez définir un nouveau mot de passe ici.",
        buttonText: 'Réinitialiser votre mot de passe',
        footerIntroText:
          "Si vous ne souhaitez pas modifier votre mot de passe ou si vous ne l'avez pas demandé, ignorez et supprimez simplement ce message.",
      }) as React.ReactElement,
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
      error,
    );
    return {
      errors: {},
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }
  // Pas d'erreur, redirection vers login
  redirect('/auth/checked-email-for-reset-password');
}
