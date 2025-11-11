// app/components/Section.tsx
import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, children, className = "" }: SectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-semibold text-ink-700 dark:text-dark-text font-heading transition-colors duration-200">{title}</h2>
      {children}
    </section>
  );
}
