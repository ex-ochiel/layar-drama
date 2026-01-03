'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Drama } from '@/lib/types';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DramaFormProps {
    initialData?: Partial<Drama>;
    action: (formData: FormData) => Promise<void>;
    isEdit?: boolean;
}

export default function DramaForm({ initialData, action, isEdit }: DramaFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        try {
            await action(formData);
            // Let the server action handle redirect/revalidation
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dramas" className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Drama' : 'Add New Drama'}</h1>
                        <p className="text-neutral-400 text-sm">Fill in the details below.</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isEdit ? 'Update Changes' : 'Publish Drama'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Title</label>
                        <input
                            name="title"
                            defaultValue={initialData?.title}
                            required
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            placeholder="e.g. Vincenzo"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Synopsis</label>
                        <textarea
                            name="synopsis"
                            defaultValue={initialData?.description}
                            rows={6}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            placeholder="Drama description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Poster Image URL</label>
                            <input
                                name="poster"
                                defaultValue={initialData?.thumbnail}
                                required
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Release Year</label>
                            <input
                                name="year"
                                defaultValue={initialData?.year}
                                type="number"
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                placeholder="2024"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Meta */}
                <div className="space-y-6">
                    <div className="bg-neutral-800/50 p-6 rounded-xl space-y-4 border border-white/5">
                        <h3 className="font-semibold text-white">Metadata</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-400">Status</label>
                            <select
                                name="status"
                                defaultValue={initialData?.status}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Upcoming">Upcoming</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-400">Country</label>
                            <select
                                name="country"
                                defaultValue={initialData?.country}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                            >
                                <option value="Korea">Korea</option>
                                <option value="China">China</option>
                                <option value="Japan">Japan</option>
                                <option value="Thailand">Thailand</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-400">Initial Rating</label>
                            <input
                                name="rating"
                                defaultValue={initialData?.rating}
                                type="number"
                                step="0.1"
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="0.0"
                            />
                        </div>

                        <div className="pt-2 text-xs text-neutral-500">
                            Slug will be auto-generated from title.
                        </div>
                    </div>
                </div>
            </div>

            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
        </form>
    );
}
