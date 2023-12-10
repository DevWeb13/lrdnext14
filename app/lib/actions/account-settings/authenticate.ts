'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

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
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Identifiants incorrects.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
