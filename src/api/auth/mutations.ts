import { graphqlRequest } from '@/api/graphql-client';
import type {
  AuthPayload,
  ForgotPasswordInput,
  LoginInput,
  LoginWithGoogleInput,
  MessagePayload,
  RegisterInput,
  ResetPasswordInput,
  User,
} from '@/types/auth';
import { mapUser } from '@/types/auth';

const USER_FIELDS = `
  fragment UserFields on User {
    id
    name
    email
    role
    createdAt
  }
`;

export const ME_QUERY = `
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`;

interface MeResponse {
  me: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MODERATOR' | 'GUEST';
    createdAt: string;
  } | null;
}

export async function fetchMe(): Promise<User | null> {
  const data = await graphqlRequest<MeResponse>(ME_QUERY);
  return data.me ? mapUser(data.me) : null;
}

export const REGISTER_MUTATION = `
  ${USER_FIELDS}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      expiresIn
      user {
        ...UserFields
      }
    }
  }
`;

export const LOGIN_MUTATION = `
  ${USER_FIELDS}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      expiresIn
      user {
        ...UserFields
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

interface AuthMutationResponse {
  register?: {
    accessToken: string;
    expiresIn: number;
    user: Parameters<typeof mapUser>[0];
  };
  login?: {
    accessToken: string;
    expiresIn: number;
    user: Parameters<typeof mapUser>[0];
  };
  loginWithGoogle?: {
    accessToken: string;
    expiresIn: number;
    user: Parameters<typeof mapUser>[0];
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthPayload> {
  const data = await graphqlRequest<AuthMutationResponse>(REGISTER_MUTATION, { input });
  const payload = data.register;
  if (!payload) {
    throw new Error('Registration failed');
  }
  return {
    accessToken: payload.accessToken,
    expiresIn: payload.expiresIn,
    user: mapUser(payload.user),
  };
}

export async function loginUser(input: LoginInput): Promise<AuthPayload> {
  const data = await graphqlRequest<AuthMutationResponse>(LOGIN_MUTATION, { input });
  const payload = data.login;
  if (!payload) {
    throw new Error('Login failed');
  }
  return {
    accessToken: payload.accessToken,
    expiresIn: payload.expiresIn,
    user: mapUser(payload.user),
  };
}

export async function forgotPasswordUser(input: ForgotPasswordInput): Promise<MessagePayload> {
  const data = await graphqlRequest<{ forgotPassword: MessagePayload }>(FORGOT_PASSWORD_MUTATION, {
    input,
  });
  return data.forgotPassword;
}

export async function resetPasswordUser(input: ResetPasswordInput): Promise<MessagePayload> {
  const data = await graphqlRequest<{ resetPassword: MessagePayload }>(RESET_PASSWORD_MUTATION, {
    input,
  });
  return data.resetPassword;
}

export const LOGIN_WITH_GOOGLE_MUTATION = `
  ${USER_FIELDS}
  mutation LoginWithGoogle($input: LoginWithGoogleInput!) {
    loginWithGoogle(input: $input) {
      accessToken
      expiresIn
      user {
        ...UserFields
      }
    }
  }
`;

export async function loginWithGoogleUser(input: LoginWithGoogleInput): Promise<AuthPayload> {
  const data = await graphqlRequest<AuthMutationResponse>(LOGIN_WITH_GOOGLE_MUTATION, { input });
  const payload = data.loginWithGoogle;
  if (!payload) {
    throw new Error('Google login failed');
  }
  return {
    accessToken: payload.accessToken,
    expiresIn: payload.expiresIn,
    user: mapUser(payload.user),
  };
}

export async function logoutUser(): Promise<MessagePayload> {
  const data = await graphqlRequest<{ logout: MessagePayload }>(LOGOUT_MUTATION);
  return data.logout;
}
