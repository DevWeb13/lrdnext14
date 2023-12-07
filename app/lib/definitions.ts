export type User = {
  id: string;
  role: 'admin' | 'user' | 'moderator' | null;
  status: 'active' | 'pendingVerification' | 'suspended' | null;
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

export type NewUser = Omit<User, 'id'>;

export type BasicUserInfo = Pick<User, 'id' | 'name' | 'email' | 'password'>;

export type ResetPasswordUserInfo = Pick<
  User,
  'id' | 'resetPasswordToken' | 'resetPasswordTokenExpiredAt'
>;
