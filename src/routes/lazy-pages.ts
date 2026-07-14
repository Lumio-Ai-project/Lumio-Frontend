import { lazy } from 'react';

const landingPageImport = () => import('@/screens/Landing/pages/LandingPage');
const chatPageImport = () => import('@/screens/Chat/pages/ChatPage');
const loginPageImport = () => import('@/screens/Auth/pages/LoginPage');
const registerPageImport = () => import('@/screens/Auth/pages/RegisterPage');
const forgotPasswordPageImport = () => import('@/screens/Auth/pages/ForgotPasswordPage');
const resetPasswordPageImport = () => import('@/screens/Auth/pages/ResetPasswordPage');
const googleCallbackPageImport = () => import('@/screens/Auth/pages/GoogleCallbackPage');
const dashboardLayoutImport = () => import('@/screens/Dashboard/layouts/DashboardLayout');
const dashboardIndexRedirectImport = () =>
  import('@/screens/Dashboard/pages/DashboardIndexRedirect');
const usersPageImport = () => import('@/screens/Dashboard/pages/UsersPage');
const apiKeysPageImport = () => import('@/screens/Dashboard/pages/ApiKeysPage');
const templatesPageImport = () => import('@/screens/Dashboard/pages/TemplatesPage');
const templateDetailPageImport = () => import('@/screens/Dashboard/pages/TemplateDetailPage');
const unauthorizedPageImport = () => import('@/screens/Errors/pages/UnauthorizedPage');
const notFoundPageImport = () => import('@/screens/Errors/pages/NotFoundPage');

export const preloadChatPage = () => void chatPageImport();
export const preloadDashboardPage = () => {
  void dashboardLayoutImport();
  void usersPageImport();
  void apiKeysPageImport();
  void templatesPageImport();
};

export const LandingPage = lazy(() =>
  landingPageImport().then((m) => ({ default: m.LandingPage })),
);
export const ChatPage = lazy(() =>
  chatPageImport().then((m) => ({ default: m.ChatPage })),
);
export const LoginPage = lazy(() =>
  loginPageImport().then((m) => ({ default: m.LoginPage })),
);
export const RegisterPage = lazy(() =>
  registerPageImport().then((m) => ({ default: m.RegisterPage })),
);
export const ForgotPasswordPage = lazy(() =>
  forgotPasswordPageImport().then((m) => ({ default: m.ForgotPasswordPage })),
);
export const ResetPasswordPage = lazy(() =>
  resetPasswordPageImport().then((m) => ({ default: m.ResetPasswordPage })),
);
export const GoogleCallbackPage = lazy(() =>
  googleCallbackPageImport().then((m) => ({ default: m.GoogleCallbackPage })),
);
export const DashboardLayout = lazy(() =>
  dashboardLayoutImport().then((m) => ({ default: m.DashboardLayout })),
);
export const DashboardIndexRedirect = lazy(() =>
  dashboardIndexRedirectImport().then((m) => ({ default: m.DashboardIndexRedirect })),
);
export const UsersPage = lazy(() =>
  usersPageImport().then((m) => ({ default: m.UsersPage })),
);
export const ApiKeysPage = lazy(() =>
  apiKeysPageImport().then((m) => ({ default: m.ApiKeysPage })),
);
export const TemplatesPage = lazy(() =>
  templatesPageImport().then((m) => ({ default: m.TemplatesPage })),
);
export const TemplateDetailPage = lazy(() =>
  templateDetailPageImport().then((m) => ({ default: m.TemplateDetailPage })),
);
export const UnauthorizedPage = lazy(() =>
  unauthorizedPageImport().then((m) => ({ default: m.UnauthorizedPage })),
);
export const NotFoundPage = lazy(() =>
  notFoundPageImport().then((m) => ({ default: m.NotFoundPage })),
);
