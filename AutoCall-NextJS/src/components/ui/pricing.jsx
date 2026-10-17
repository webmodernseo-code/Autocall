'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { CheckCircleIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const frequencies = ['monthly', 'yearly'];

export function PricingSection({
    plans,
    heading,
    description,
    theme = 'light',
    ...props
}) {
    const [frequency, setFrequency] = React.useState('monthly');
    const isLight = theme === 'light';

    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center space-y-8 p-4',
                props.className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-2xl space-y-3 text-center">
                <h2 className={cn(
                    "text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl",
                    isLight ? "text-neutral-900" : "text-white"
                )}>
                    {heading}
                </h2>
                {description && (
                    <p className={cn(
                        "text-sm sm:text-base leading-relaxed max-w-xl mx-auto",
                        isLight ? "text-neutral-600" : "text-white/60"
                    )}>
                        {description}
                    </p>
                )}
            </div>
            <PricingFrequencyToggle
                frequency={frequency}
                setFrequency={setFrequency}
                isLight={isLight}
            />
            <div className={cn(
                "mx-auto grid w-full items-stretch gap-5",
                plans.length >= 4 
                    ? "max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
                    : "max-w-5xl grid-cols-1 md:grid-cols-3"
            )}>
                {plans.map((plan) => (
                    <PricingCard plan={plan} key={plan.name} frequency={frequency} isLight={isLight} isFourColumns={plans.length >= 4} />
                ))}
            </div>
        </div>
    );
}

export function PricingFrequencyToggle({
    frequency,
    setFrequency,
    isLight = true,
    ...props
}) {
    return (
        <div
            className={cn(
                'mx-auto flex w-fit rounded-full p-1 backdrop-blur-md',
                isLight
                    ? 'bg-neutral-200/70 border border-neutral-300'
                    : 'bg-white/[0.04] border border-white/10',
                props.className,
            )}
            {...props}
        >
            {frequencies.map((freq) => {
                const label = freq === 'monthly' ? 'Mensuel' : 'Annuel';
                const isSelected = frequency === freq;

                return (
                    <button
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`relative px-5 py-2 text-xs font-semibold capitalize transition-colors duration-150 cursor-pointer ${
                            isSelected
                                ? isLight ? 'text-neutral-900 font-bold' : 'text-black font-bold'
                                : isLight ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/60 hover:text-white'
                        }`}
                    >
                        <span className="relative z-20 flex items-center gap-1.5">
                            {label}
                            {freq === 'yearly' && (
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                    isSelected
                                        ? isLight ? 'bg-neutral-900 text-white' : 'bg-black text-white'
                                        : 'bg-emerald-500/20 text-emerald-700'
                                )}>
                                    -20%
                                </span>
                            )}
                        </span>
                        {isSelected && (
                            <motion.span
                                layoutId="frequency"
                                transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                                className={cn(
                                    "absolute inset-0 z-10 rounded-full shadow-xs",
                                    isLight ? "bg-white" : "bg-white"
                                )}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export function PricingCard({
    plan,
    className,
    frequency = frequencies[0],
    isLight = true,
    isFourColumns = false,
    ...props
}) {
    const discountPercent =
        plan.price?.monthly > 0 && plan.price?.yearly !== undefined
            ? Math.round(
                  ((plan.price.monthly - plan.price.yearly) / plan.price.monthly) * 100,
              )
            : 0;

    return (
        <div
            key={plan.name}
            className={cn(
                'relative flex w-full flex-col justify-between rounded-2xl transition-all duration-200 overflow-hidden',
                isLight
                    ? plan.highlighted
                        ? 'border-2 border-blue-600 bg-white shadow-[0_12px_40px_rgba(37,99,235,0.12)] ring-4 ring-blue-500/10 scale-[1.02]'
                        : 'border border-neutral-200/90 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-neutral-300'
                    : plan.highlighted
                        ? 'border-white/25 bg-[#121520] shadow-2xl scale-[1.02]'
                        : 'border border-white/10 bg-[#0E1015]/90',
                className,
            )}
            {...props}
        >
            <div>
                <div
                    className={cn(
                        'relative border-b',
                        isFourColumns ? 'p-5' : 'p-6',
                        isLight
                            ? plan.highlighted ? 'bg-blue-50/30 border-neutral-200/80' : 'bg-neutral-50/50 border-neutral-200/80'
                            : plan.highlighted ? 'bg-white/[0.05] border-white/10' : 'bg-white/[0.02] border-white/10',
                    )}
                >
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        {plan.highlighted && (
                            <p className={cn(
                                "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs",
                                isLight ? "bg-blue-600 text-white" : "bg-white text-black"
                            )}>
                                <StarIcon className="h-3 w-3 fill-current" />
                                {plan.badge || 'Recommandé'}
                            </p>
                        )}
                        {frequency === 'yearly' && discountPercent > 0 && (
                            <p className="bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                                -{discountPercent}%
                            </p>
                        )}
                    </div>

                    <div className={cn("text-xl font-bold", isLight ? "text-neutral-900" : "text-white")}>
                        {plan.name}
                    </div>
                    <p className={cn("text-xs mt-1 min-h-[32px] leading-relaxed", isLight ? "text-neutral-600 font-medium" : "text-white/70")}>
                        {plan.info}
                    </p>
                    <h3 className="mt-3 flex items-baseline gap-1">
                        <span className={cn(
                            "text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums",
                            isLight ? "text-neutral-900" : "text-white"
                        )}>
                            {plan.price[frequency]}€
                        </span>
                        <span className={cn("text-xs font-mono", isLight ? "text-neutral-600 font-medium" : "text-white/60")}>
                            {plan.price[frequency] === 0
                                ? ' (gratuit à vie)'
                                : '/' + (frequency === 'monthly' ? 'mois' : 'mois (annuel)')}
                        </span>
                    </h3>
                </div>
                <div className={cn(
                    "space-y-3",
                    isFourColumns ? "px-5 py-5 text-xs" : "px-6 py-6 text-xs sm:text-sm"
                )}>
                    <div className={cn(
                        "text-[11px] font-bold uppercase tracking-wider mb-2",
                        isLight ? "text-neutral-700" : "text-white/70"
                    )}>
                        Inclus dans l&apos;offre :
                    </div>
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                            <CheckCircleIcon className="text-emerald-600 h-4 w-4 shrink-0 mt-0.5" />
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <p
                                            className={cn(
                                                'leading-relaxed font-medium',
                                                isLight ? 'text-neutral-800' : 'text-white/90',
                                                feature.tooltip && (isLight ? 'cursor-pointer border-b border-dashed border-neutral-400' : 'cursor-pointer border-b border-dashed border-white/40'),
                                            )}
                                        >
                                            {feature.text}
                                        </p>
                                    </TooltipTrigger>
                                    {feature.tooltip && (
                                        <TooltipContent className={cn(
                                            "text-xs p-2 rounded-lg max-w-xs shadow-xl border",
                                            isLight ? "bg-neutral-900 text-white border-neutral-800" : "bg-black/90 border-white/20 text-white"
                                        )}>
                                            <p>{feature.tooltip}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cn(
                'mt-auto w-full border-t',
                isFourColumns ? 'p-4' : 'p-5',
                isLight ? 'border-neutral-200/80 bg-neutral-50/30' : 'border-white/10 bg-white/[0.03]',
            )}>
                <Button
                    className={cn(
                        'w-full h-10 text-xs font-semibold rounded-xl transition-all cursor-pointer',
                        isLight
                            ? plan.highlighted
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                : 'border border-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                            : plan.highlighted
                                ? 'bg-white text-black hover:bg-neutral-200 shadow-md'
                                : 'border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black',
                    )}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                >
                    <Link href={`${plan.btn.href}${plan.btn.href.includes('?') ? '&' : '?'}billing=${frequency === 'yearly' ? 'year' : 'month'}`}>{plan.btn.text}</Link>
                </Button>
            </div>
        </div>
    );
}

export function BorderTrail({
    className,
    size = 60,
    transition,
    delay,
    onAnimationComplete,
    style,
}) {
    const BASE_TRANSITION = {
        repeat: Infinity,
        duration: 5,
        ease: 'linear',
    };

    return (
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
            <motion.div
                className={cn('absolute aspect-square bg-white/70', className)}
                style={{
                    width: size,
                    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
                    ...style,
                }}
                animate={{
                    offsetDistance: ['0%', '100%'],
                }}
                transition={{
                    ...(transition ?? BASE_TRANSITION),
                    delay: delay,
                }}
                onAnimationComplete={onAnimationComplete}
            />
        </div>
    );
}
