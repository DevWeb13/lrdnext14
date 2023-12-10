'use server';

import ResetPasswordEmail from '@/components/reset-password-email';
import { EmailResetPassword } from '@/schema/user-form-schema';
import { FormErrorState } from '@/types/form-error-state';
import { renderAsync } from '@react-email/components';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { addResetPasswordToken } from './add-reset-password-token';
import { connectToCollection } from '@/app/utils/connect-db';

const MODE = process.env.NODE_ENV;

/**
 * The above function sends a reset password email to a user with a valid email address and redirects
 * them to the login page.
 * @param {FormErrorState} prevState - The `prevState` parameter is an object that represents the
 * previous state of the form. It contains the following properties:
 * @param {FormData} formData - The `formData` parameter is an object that contains the data submitted
 * in the form. It is of type `FormData`, which is a built-in JavaScript class used to handle form
 * data. In this case, it is being used to retrieve the value of the email field from the form.
 * @returns a Promise that resolves to a FormErrorState object.
 */
export async function sendEmailResetPassword(
  prevState: FormErrorState,
  formData: FormData
): Promise<FormErrorState> {
  // Valider les données du formulaire avec le schéma Zod étendu
  const validatedUser = EmailResetPassword.safeParse({
    email: formData.get('email'),
  });

  // Si la validation échoue, retourner les erreurs
  if (!validatedUser.success) {
    return {
      errors: validatedUser.error.flatten().fieldErrors,
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const { email } = validatedUser.data;

  // Connexion à la base de données
  const { client, collection } = await connectToCollection('users');
  const user = await collection.findOne({ email });
  if (!user) {
    return {
      errors: { email: ["Cet e-mail n'est pas associé à un compte."] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetPasswordToken = await addResetPasswordToken(
    user.email,
    collection
  );

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

  try {
    await resend.emails.send({
      from: 'contact@lareponsedev.com',
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html,
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }

  // Fermer la connexion à la base de données et rediriger
  client.close();
  console.log('You deconnected to MongoDb');
  prevState.message = null;
  // Pas d'erreur, redirection vers login
  redirect('/auth/login');
}
