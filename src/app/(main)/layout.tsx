import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { FooterWrapper } from '@/components/layout/footer-wrapper';
import { createClient } from '@/lib/supabase/server';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-12 lg:px-8">
        {children}
      </main>

      <FooterWrapper />
      <MobileNav isLoggedIn={!!user} />
    </div>
  );
}
