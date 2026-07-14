import { fromGraphQLRole, type GraphQLUserRole } from '@/constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: ReturnType<typeof fromGraphQLRole>;
  createdAt: string;
}

export interface AuthPayload {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface MessagePayload {
  message: string;
  success: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface LoginWithGoogleInput {
  code: string;
}

interface GraphQLUser {
  id: string;
  name: string;
  email: string;
  role: GraphQLUserRole;
  createdAt: string;
}

export function mapUser(user: GraphQLUser): User {
  return {
    ...user,
    role: fromGraphQLRole(user.role),
  };
}
