'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquareQuote } from 'lucide-react';
import { FAQ_GROUPS } from './faqData';

export default function FaqAccordion({ defaultLimit = null, showCategories = true }) {
    const [selectedCategory, setSelectedCategory] = useState(FAQ_GROUPS[0].group);
    const [openIndex, setOpenIndex] = useState(0);

    const activeGroup = FAQ_GROUPS.find(g => g.group === selectedCategory) || FAQ_GROUPS[0];
    const itemsToShow = defaultLimit ? activeGroup.items.slice(0, defaultLimit) : activeGroup.items;

    return (
        <div className="w-full space-y-6">
            {/* Category Filter Buttons */}
            {showCategories && (
                <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                    {FAQ_GROUPS.map((g, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setSelectedCategory(g.group);
                                setOpenIndex(0);
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                selectedCategory === g.group
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
                            }`}
                        >
                            {g.group}
                        </button>
                    ))}
                </div>
            )}

            {/* Accordion List */}
            <div className="space-y-3">
                {itemsToShow.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div
                            key={idx}
                            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                                isOpen
                                    ? 'border-sky-500/40 dark:border-sky-500/30 bg-sky-50/30 dark:bg-sky-950/20'
                                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
                            }`}
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs md:text-sm text-slate-900 dark:text-white"
                            >
                                <span className="flex items-center gap-2.5">
                                    <HelpCircle className={`w-4 h-4 shrink-0 ${isOpen ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                                    <span>{item.q}</span>
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="px-4 pb-5 pt-0 md:px-5 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
