import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | SkyBooker',
  description: 'SkyBooker Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-text font-heading tracking-tight mb-8">
        Terms of Service
      </h1>
      <div className="prose prose-slate dark:prose-invert">
        <p>
          Welcome to SkyBooker. These Terms of Service outline the rules and regulations for the use of our website.
        </p>
        <p className="text-muted mt-4">
          This is a placeholder page for the Terms of Service.
        </p>
      </div>
    </div>
  );
}
