'use client';

/**
 * Card with soft shadow and optional padding.
 */
export default function Card({
    padding = true,
    className = '',
    children,
    ...props
}) {
    return (
        <div
            className={[
                'min-w-0 rounded-2xl border border-slate-200 bg-white text-neutral-950 shadow-soft transition duration-200 hover:border-slate-300 hover:shadow-soft-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none',
                padding && 'p-4 sm:p-5 lg:p-6',
                className,
            ].filter(Boolean).join(' ')}
            {...props}
        >
            {children}
        </div>
    );
}

Card.Header = function CardHeader({ title, action, className = '' }) {
    return (
        <div className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
            <h3 className="text-base font-bold leading-6 tracking-tight text-neutral-950 dark:text-neutral-100">{title}</h3>
            {action}
        </div>
    );
};

Card.Body = function CardBody({ className = '', ...props }) {
    return <div className={className} {...props} />;
};
