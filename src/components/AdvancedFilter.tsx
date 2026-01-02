"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
    id: string;
    label: string;
}

interface FilterGroupProps {
    title: string;
    options: FilterOption[];
    selectedValue: string;
    onChange: (value: string) => void;
}

function FilterGroup({ title, options, selectedValue, onChange }: FilterGroupProps) {
    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                {title}
            </h3>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                            selectedValue === option.id
                                ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                                : "bg-black/20 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export const COUNTRIES = [
    { id: "all", label: "All Countries" },
    { id: "South Korea", label: "🇰🇷 South Korea" },
    { id: "China", label: "🇨🇳 China" },
    { id: "Japan", label: "🇯🇵 Japan" },
    { id: "Thailand", label: "🇹🇭 Thailand" },
];

export const STATUSES = [
    { id: "all", label: "All Status" },
    { id: "ongoing", label: "📺 Ongoing" },
    { id: "completed", label: "✅ Completed" },
];

export const YEARS = [
    { id: "all", label: "All Years" },
    { id: "2023", label: "2023" },
    { id: "2022", label: "2022" },
    { id: "2021", label: "2021" },
    { id: "2020", label: "2020" },
    { id: "older", label: "Older" },
];

interface AdvancedFilterProps {
    selectedCountry: string;
    onCountryChange: (val: string) => void;
    selectedStatus: string;
    onStatusChange: (val: string) => void;
    selectedYear: string;
    onYearChange: (val: string) => void;
}

export default function AdvancedFilter({
    selectedCountry,
    onCountryChange,
    selectedStatus,
    onStatusChange,
    selectedYear,
    onYearChange,
}: AdvancedFilterProps) {
    return (
        <div className="animate-fade-in">
            <FilterGroup
                title="Country"
                options={COUNTRIES}
                selectedValue={selectedCountry}
                onChange={onCountryChange}
            />
            <FilterGroup
                title="Status"
                options={STATUSES}
                selectedValue={selectedStatus}
                onChange={onStatusChange}
            />
            <FilterGroup
                title="Release Year"
                options={YEARS}
                selectedValue={selectedYear}
                onChange={onYearChange}
            />
        </div>
    );
}
