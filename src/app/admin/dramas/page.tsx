import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function AdminDramasPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const query = params.q || "";

    // Fetch dramas
    let dbQuery = supabase
        .from('dramas')
        .select('*')
        .order('created_at', { ascending: false });

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`);
    }

    const { data: dramas, error } = await dbQuery;

    // Server Action for Deleting
    async function deleteDrama(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        const supabase = await createClient();

        const { error } = await supabase.from('dramas').delete().eq('id', id);

        if (error) {
            console.error("Error deleting drama:", error);
            // In a real app we'd show a toast here, but server actions are tricky with client-side toasts without a library like 'sonner' + client component wrapper
        } else {
            revalidatePath('/admin/dramas');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Dramas</h1>
                    <p className="text-neutral-400">Add, edit, or remove dramas from the platform.</p>
                </div>
                <Link
                    href="/admin/dramas/new"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Drama
                </Link>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
                <form className="relative">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search dramas..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-neutral-400 font-medium text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Country</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {dramas?.map((drama) => (
                            <tr key={drama.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{drama.title}</div>
                                    <div className="text-xs text-neutral-500">{drama.year}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${drama.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-700 text-neutral-400'
                                        }`}>
                                        {drama.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-neutral-300">{drama.country}</td>
                                <td className="px-6 py-4 flex items-center gap-1 text-yellow-500">
                                    ★ <span className="text-neutral-300">{drama.rating || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/dramas/${drama.id}`}
                                            className="p-2 hover:bg-blue-500/20 hover:text-blue-400 text-neutral-400 rounded transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>

                                        <form action={deleteDrama}>
                                            <input type="hidden" name="id" value={drama.id} />
                                            <button
                                                type="submit"
                                                className="p-2 hover:bg-red-500/20 hover:text-red-400 text-neutral-400 rounded transition-colors"
                                            // Add client-side confirmation in a real app
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {(!dramas || dramas.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                    No dramas found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
