// app/lib/actions/account-settings/authenticate.ts

'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { getStatus } from '../get/get-status';
import { FormErrorState } from '@/types/form-error-state';

/**
 * The function `authenticate` is an asynchronous function that takes in the previous state and form
 * data as parameters, and attempts to sign in using the provided credentials. If an `AuthError` is
 * thrown, it returns a specific error message based on the error type, otherwise it throws the error.
 * @param {string | undefined} prevState - The `prevState` parameter is a string or undefined value
 * representing the previous state of the authentication process. It could be used to store and track
 * the previous state of the authentication process, such as the previous authentication status or any
 * other relevant information.
 * @param {FormData} formData - The `formData` parameter is of type `FormData`, which is a built-in
 * JavaScript object used to represent form data. It is typically used to send data in HTTP requests,
 * such as when submitting a form.
 * @returns a string.
 */
export async function authenticate(
  prevState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  const email = formData.get('email') as string;
  try {
    const status = await getStatus(email);
    console.log({ status });

    if (typeof status === 'string') {
      return {
        message: status,
      };
    }

    if (status === null) {
      return {
        message: "Ce compte n'existe pas. Veuillez créer un compte.",
      };
    }

    if (typeof status === 'object' && status.status === 'pendingVerification') {
      return {
        errors: {
          email: [email],
        },
        message:
          "Votre compte n'est pas encore activé. Veuillez vérifier votre boîte de réception pour le lien d'activation.",
      };
    }
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return {
          message: 'Identifiants incorrects.',
        };
      } else {
        return {
          message: 'Something went wrong.',
        };
      }
    }
    throw error;
  }
  return {};
}
