import { login } from "./actions";
import { BarChart3, Lock, Mail } from "lucide-react";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#EAB308]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#EAB308]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-800 border-2 border-[#EAB308]/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.15)] mb-4 transform rotate-3">
            <BarChart3 className="w-8 h-8 text-[#EAB308] -rotate-3" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cristhofer Analytics</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Acesse o portal de inteligência financeira e operacional.
          </p>
        </div>

        <form className="flex-1 flex flex-col w-full gap-4 text-slate-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1" htmlFor="email">
              Email Corporativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/30 transition-all shadow-inner"
                name="email"
                placeholder="seu.nome@empresa.com"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#EAB308]/50 focus:border-[#EAB308]/30 transition-all shadow-inner"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          


          <div className="flex flex-col gap-3 mt-4">
            <button
              formAction={login}
              className="bg-gradient-to-r from-[#EAB308] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-semibold rounded-xl px-4 py-3 text-sm transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Entrar no Portal
            </button>

          </div>
          
          {searchParams?.message && (
            <div className="mt-4 p-4 bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center rounded-xl backdrop-blur-sm">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-slate-500 text-xs font-medium tracking-widest uppercase">
        Cristhofer Analytics • {new Date().getFullYear()}
      </div>
    </div>
  );
}
