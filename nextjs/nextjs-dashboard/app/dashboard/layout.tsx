import SideNav from '@/app/ui/dashboard/sidenav';
import React from 'react';
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
