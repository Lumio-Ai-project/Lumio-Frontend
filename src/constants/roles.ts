export const USER_ROLES = ['admin', 'moderator', 'guest'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type GraphQLUserRole = 'ADMIN' | 'MODERATOR' | 'GUEST';

export function fromGraphQLRole(role: GraphQLUserRole): UserRole {
  switch (role) {
    case 'ADMIN':
      return 'admin';
    case 'MODERATOR':
      return 'moderator';
    default:
      return 'guest';
  }
}

export function toGraphQLRole(role: UserRole): GraphQLUserRole {
  switch (role) {
    case 'admin':
      return 'ADMIN';
    case 'moderator':
      return 'MODERATOR';
    default:
      return 'GUEST';
  }
}
