import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Loading } from '@/components/shared/Loading';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { GuestRoute } from '@/routes/GuestRoute';
import {
  ChatPage,
  ApiKeysPage,
  DashboardIndexRedirect,
  DashboardLayout,
  ForgotPasswordPage,
  GoogleCallbackPage,
  LandingPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  TemplateDetailPage,
  TemplatesPage,
  UnauthorizedPage,
  UsersPage,
} from '@/routes/lazy-pages';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleProtectedRoute } from '@/routes/RoleProtectedRoute';
import { ROUTES } from '@/routes/paths';

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <LazyPage>
            <LandingPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    element: (
      <LazyPage>
        <AuthLayout />
      </LazyPage>
    ),
    children: [
      {
        path: ROUTES.GOOGLE_CALLBACK,
        element: (
          <LazyPage>
            <GoogleCallbackPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: (
              <LazyPage>
                <LoginPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.REGISTER,
            element: (
              <LazyPage>
                <RegisterPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: (
              <LazyPage>
                <ForgotPasswordPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.RESET_PASSWORD,
            element: (
              <LazyPage>
                <ResetPasswordPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.CHAT,
            element: (
              <LazyPage>
                <ChatPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.CHAT_CONVERSATION,
            element: (
              <LazyPage>
                <ChatPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.DASHBOARD,
            element: (
              <LazyPage>
                <DashboardLayout />
              </LazyPage>
            ),
            children: [
              {
                index: true,
                element: (
                  <LazyPage>
                    <DashboardIndexRedirect />
                  </LazyPage>
                ),
              },
              {
                path: 'api-keys',
                element: (
                  <LazyPage>
                    <ApiKeysPage />
                  </LazyPage>
                ),
              },
              {
                element: <RoleProtectedRoute allowedRoles={['admin']} />,
                children: [
                  {
                    path: 'users',
                    element: (
                      <LazyPage>
                        <UsersPage />
                      </LazyPage>
                    ),
                  },
                ],
              },
              {
                element: <RoleProtectedRoute allowedRoles={['admin', 'moderator']} />,
                children: [
                  {
                    path: 'templates',
                    element: (
                      <LazyPage>
                        <TemplatesPage />
                      </LazyPage>
                    ),
                  },
                  {
                    path: 'templates/:id',
                    element: (
                      <LazyPage>
                        <TemplateDetailPage />
                      </LazyPage>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: (
      <LazyPage>
        <UnauthorizedPage />
      </LazyPage>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    ),
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);
