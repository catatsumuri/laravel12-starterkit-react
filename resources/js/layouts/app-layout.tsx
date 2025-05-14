import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { flashMessage } = usePage().props;
  useEffect(() => {
    if (flashMessage) {
      Object.entries(flashMessage).forEach(([type, message]) => {
        toast[type as keyof typeof toast](message);
      });
    }
  }, [flashMessage]);

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster />
    </AppLayoutTemplate>
  );
}
