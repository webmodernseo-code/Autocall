'use client';

import { forwardRef } from 'react';

/**
 * Text input with soft border and subtle focus ring.
 */
const Input = forwardRef(function Input(
    { type = 'text', label, error, hint, className = '', id, ...props },
    ref,
) {
    const inputId = id || props.name;
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-semibold leading-5 text-slate-700 dark:text-neutral-200"
                >
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                type={type}
                className={[
                    'h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-neutral-950 shadow-sm transition duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 sm:text-sm',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    className,
                ].filter(Boolean).join(' ')}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>
            )}
        </div>
    );
});

export default Input;
