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
    ...props
}) {
    const [frequency, setFrequency] = React.useState('monthly');

    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center space-y-8 p-4',
                props.className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-2xl space-y-3 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {heading}
                </h2>
                {description && (
                    <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
                        {description}
                    </p>
                )}
            </div>
            <PricingFrequencyToggle
                frequency={frequency}
                setFrequency={setFrequency}
            />
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
                {plans.map((plan) => (
                    <PricingCard plan={plan} key={plan.name} frequency={frequency} />
                ))}
            </div>
        </div>
    );
}

export function PricingFrequencyToggle({
    frequency,
    setFrequency,
    ...props
}) {
    return (
        <div
            className={cn(
                'bg-white/[0.04] border border-white/10 mx-auto flex w-fit rounded-full p-1 backdrop-blur-md',
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
                            isSelected ? 'text-black font-bold' : 'text-white/60 hover:text-white'
                        }`}
                    >
                        <span className="relative z-20 flex items-center gap-1.5">
                            {label}
                            {freq === 'yearly' && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black text-white' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                    -20%
                                </span>
                            )}
                        </span>
                        {isSelected && (
                            <motion.span
                                layoutId="frequency"
                                transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                                className="bg-white absolute inset-0 z-10 rounded-full shadow-md"
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
    ...props
}) {
    const discountPercent = Math.round(
        ((plan.price.monthly * 12 - plan.price.yearly) /
            plan.price.monthly /
            12) *
            100,
    );

    return (
        <div
            key={plan.name}
            className={cn(
                'relative flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#0E1015]/90 backdrop-blur-xl transition-all duration-200 overflow-hidden',
                plan.highlighted && 'border-white/25 bg-[#121520] shadow-2xl scale-[1.02]',
                className,
            )}
            {...props}
        >
            {plan.highlighted && (
                <BorderTrail
                    style={{
                        boxShadow:
                            '0px 0px 60px 30px rgba(255, 255, 255, 0.4), 0 0 100px 60px rgba(16, 185, 129, 0.3), 0 0 140px 90px rgba(59, 130, 246, 0.2)',
                    }}
                    size={100}
                />
            )}
            <div>
                <div
                    className={cn(
                        'bg-white/[0.02] border-b border-white/10 p-6 relative',
                        plan.highlighted && 'bg-white/[0.05]',
                    )}
                >
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        {plan.highlighted && (
                            <p className="bg-white text-black flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs">
                                <StarIcon className="h-3 w-3 fill-current" />
                                {plan.badge || 'Populaire'}
                            </p>
                        )}
                        {frequency === 'yearly' && discountPercent > 0 && (
                            <p className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                                -{discountPercent}%
                            </p>
                        )}
                    </div>

                    <div className="text-xl font-bold text-white">{plan.name}</div>
                    <p className="text-white/60 text-xs font-normal mt-1 min-h-[32px] leading-relaxed">{plan.info}</p>
                    <h3 className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white tracking-tight tabular-nums">
                            {plan.price[frequency]}€
                        </span>
                        <span className="text-white/50 text-xs font-mono">
                            {plan.name !== 'Free'
                                ? '/' + (frequency === 'monthly' ? 'mois' : 'mois (annuel)')
                                : ''}
                        </span>
                    </h3>
                </div>
                <div
                    className={cn(
                        'text-white/75 space-y-3.5 px-6 py-6 text-xs sm:text-sm',
                        plan.highlighted && 'bg-white/[0.01]',
                    )}
                >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2">
                        Inclus dans l&apos;offre :
                    </div>
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                            <CheckCircleIcon className="text-emerald-400 h-4 w-4 shrink-0 mt-0.5" />
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <p
                                            className={cn(
                                                'leading-relaxed text-white/85',
                                                feature.tooltip &&
                                                    'cursor-pointer border-b border-dashed border-white/30',
                                            )}
                                        >
                                            {feature.text}
                                        </p>
                                    </TooltipTrigger>
                                    {feature.tooltip && (
                                        <TooltipContent className="bg-black/90 border border-white/20 text-white text-xs p-2 rounded-lg max-w-xs shadow-xl">
                                            <p>{feature.tooltip}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={cn(
                    'mt-auto w-full border-t border-white/10 p-5',
                    plan.highlighted && 'bg-white/[0.03]',
                )}
            >
                <Button
                    className={cn(
                        'w-full h-11 text-xs font-semibold rounded-xl transition-all cursor-pointer',
                        plan.highlighted
                            ? 'bg-white text-black hover:bg-neutral-200 shadow-md shadow-white/10'
                            : 'border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black',
                    )}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                >
                    <Link href={plan.btn.href}>{plan.btn.text}</Link>
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
