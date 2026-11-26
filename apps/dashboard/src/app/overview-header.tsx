"use client";

import React from 'react';

export function OverviewHeader() {
  return (
    <header className="border-b border-[var(--border)] pb-4 mb-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Vue d’ensemble
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mt-1">
        Aperçu des indicateurs clés et actions prioritaires.
      </p>
    </header>
  );
}

