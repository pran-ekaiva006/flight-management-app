import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SkyBooker',
  description: 'SkyBooker Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-text font-heading tracking-tight mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-slate dark:prose-invert">
        <p>
          At SkyBooker, we take your privacy seriously. This Privacy Policy document contains types of information that is collected and recorded by SkyBooker and how we use it.
        </p>
        <p className="text-muted mt-4">
          This is a placeholder page for the Privacy Policy.
        </p>
      </div>
    </div>
  );
}
