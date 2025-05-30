import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useLaravelReactI18n } from 'laravel-react-i18n';

type ProfileForm = {
  name: string;
  email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { t } = useLaravelReactI18n();
  const { auth } = usePage<SharedData>().props;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('Profile settings'),
      href: '/settings/profile',
    },
  ];

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
    name: auth.user.name,
    email: auth.user.email,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Profile settings')} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title={t('Profile information')} description={t('Update your name and email address')} />

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('Name')}</Label>

              <Input
                id="name"
                className="mt-1 block w-full"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                autoComplete="name"
                placeholder={t('Full name')}
              />

              <InputError className="mt-2" message={errors.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t('Email address')}</Label>

              <Input
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="username"
                placeholder={t('Email address')}
              />

              <InputError className="mt-2" message={errors.email} />
            </div>

            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div>
                <p className="mt-2 text-sm text-neutral-800">
                  {t('Your email address is unverified.')}{' '}
                  <Link
                    href={route('verification.send')}
                    method="post"
                    as="button"
                    className="rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                  >
                    {t('Click here to re-send the verification email.')}
                  </Link>
                </p>

                {status === 'verification-link-sent' && (
                  <div className="mt-2 text-sm font-medium text-green-600">{t('A new verification link has been sent to your email address.')}</div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button disabled={processing}>{t('Save')}</Button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">{t('Saved')}</p>
              </Transition>
            </div>
          </form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
