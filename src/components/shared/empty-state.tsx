'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/60 bg-surface/30 backdrop-blur-md px-6 py-16 text-center"
    >
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-text font-heading">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </motion.div>
  );
}
