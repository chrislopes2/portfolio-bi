import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BarChart3, LogOut } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  
  // Buscar o profile para pegar o nome
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl relative">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-10 h-10 bg-slate-800 border border-[#EAB308]/30 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-[#EAB308]" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-tight">Cristhofer</h1>
            <p className="text-[#EAB308] text-xs font-medium uppercase tracking-widest">Analytics</p>
          </div>
        </div>
        
        <SidebarNav />
        
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
               <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || user.email}&background=0D1424&color=EAB308`} alt="User Avatar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{profile?.full_name || 'Usuário'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-950/30 text-slate-400 hover:text-red-400 hover:border-red-900/50 border border-slate-800 rounded-lg transition-all text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-[#0a0a0a]">
         <div className="flex-1 overflow-y-auto p-8">
            {children}
         </div>
      </main>
    </div>
  );
}
