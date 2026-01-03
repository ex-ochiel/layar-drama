import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch quick stats
    const { count: dramaCount } = await supabase.from('dramas').select('*', { count: 'exact', head: true });
    const { count: actorCount } = await supabase.from('actors').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); // Assuming profile table exists and mirrors users

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-neutral-400">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-neutral-400 mb-2 font-medium">Total Dramas</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        {dramaCount || 0}
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-neutral-400 mb-2 font-medium">Total Actors</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        {actorCount || 0}
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-neutral-400 mb-2 font-medium">Registered Users</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {userCount || 0}
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center py-16">
                <p className="text-neutral-500 text-sm">More charts and analytics coming soon...</p>
            </div>
        </div>
    );
}
