import { AxiosError } from 'axios';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuthStore } from '@/store/authStore';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate();
  const loading = useAuthStore((state) => state.authenticating);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const [values, setValues] = useState<Record<string, string>>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const content = useMemo(
    () =>
      mode === 'login'
        ? {
            title: 'Acesse sua conta',
            subtitle: 'Entre para continuar suas conversas.',
            footerLabel: 'Ainda não tem conta?',
            footerAction: 'Criar conta',
            footerLink: '/register',
          }
        : {
            title: 'Criar sua conta',
            subtitle: 'Comece a conversar em tempo real de forma rápida e segura.',
            footerLabel: 'Já possui conta? ',
            footerAction: 'Entrar',
            footerLink: '/login',
          },
    [mode],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        await login({
          email: values.email.trim(),
          password: values.password,
        });
      } else {
        await register({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        });
      }

      navigate('/chat', { replace: true });
    } catch (caughtError) {
      const message =
        caughtError instanceof AxiosError
          ? caughtError.response?.data?.message ?? 'Não foi possível completar a autenticação.'
          : 'Não foi possível completar a autenticação.';
      setError(message);
    }
  }

  return (
    <AuthLayout title={content.title} subtitle={content.subtitle}>
      <AuthForm
        mode={mode}
        values={values}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
      />

      <p className="mt-6 text-sm text-onSurfaceMuted">
        {content.footerLabel}{' '}
        <Link to={content.footerLink} className="font-semibold text-primary">
          {content.footerAction}
        </Link>
      </p>
    </AuthLayout>
  );
}
