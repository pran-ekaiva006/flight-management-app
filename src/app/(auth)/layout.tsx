export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-800/20" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-200/20 blur-3xl dark:bg-accent-800/10" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-100/40 blur-2xl dark:bg-primary-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
