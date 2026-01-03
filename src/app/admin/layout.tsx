import Link from "next/link";
import { Film, Users, LayoutDashboard, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-neutral-900 text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full bg-neutral-900 z-50">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                        LayarDrama <span className="text-xs text-white bg-red-600 px-2 py-0.5 rounded-full ml-1">ADMIN</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Content
                    </div>

                    <Link
                        href="/admin/dramas"
                        className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Film className="w-5 h-5" />
                        Manage Dramas
                    </Link>

                    <Link
                        href="/admin/actors"
                        className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Users className="w-5 h-5" />
                        Manage Actors
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
