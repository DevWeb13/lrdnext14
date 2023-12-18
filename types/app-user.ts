export type AppUser = {
  id: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'pendingVerification' | 'suspended';
  name: string;
  email: string;
  image: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiredAt: Date | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiredAt: Date | null;
};

export type NewAppUser = Omit<AppUser, 'id'>;

export type BasicAppUserInfo = Pick<
  AppUser,
  'id' | 'name' | 'email' | 'password'
>;

export type ResetPasswordAppUserInfo = Pick<
  AppUser,
  'id' | 'resetPasswordToken' | 'resetPasswordTokenExpiredAt'
>;

export type EmailVerificationAppUserInfo = Pick<AppUser, 'id' | 'name'>;
