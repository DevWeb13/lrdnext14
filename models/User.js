import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'user', 'moderator'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'pendingVerification', 'suspended'],
      default: 'pendingVerification',
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
      default: null, // Définit null comme valeur par défaut
    },
    password: {
      type: String,
      default: null,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpiredAt: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpiredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Vérifiez si le modèle existe déjà avant de le créer
export default mongoose.models.User || mongoose.model('User', UserSchema);
