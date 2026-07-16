import { login } from "./actions";
import { Cpu, Fingerprint, Lock, ScanFace } from "lucide-react";

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden font-sans">
      
      {/* JARVIS Inspired Background Elements */}
      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b0a_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Radar / Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="w-full h-[2px] bg-amber-500/30 shadow-[0_0_20px_#f59e0b] animate-[scan_8s_ease-in-out_infinite]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 mx-4 group">
        {/* Glow behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/50 to-amber-400/50 rounded-3xl blur-md opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
        
        <div className="relative p-8 bg-slate-950/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-2xl transition-all duration-300 group-hover:border-amber-400/50">
          
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
              {/* Spinning outer rings */}
              <div className="absolute inset-0 border-2 border-amber-500/20 border-t-amber-500/80 rounded-full animate-[spin_3s_linear_infinite]"></div>
              <div className="absolute inset-2 border border-amber-500/10 border-b-amber-500/50 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
              
              {/* Inner glowing icon */}
              <div className="w-14 h-14 bg-slate-900 border border-amber-500/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] z-10">
                <Cpu className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl text-center font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              Cristhofer Analytics
            </h1>

          </div>

          <form className="flex-1 flex flex-col w-full gap-5">
            <div className="flex flex-col gap-2 group/input">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2" htmlFor="email">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30 group-focus-within/input:bg-amber-500 group-focus-within/input:shadow-[0_0_8px_#f59e0b] transition-all"></span>
                Identificação (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500/40 group-focus-within/input:text-amber-500 transition-colors">
                  <ScanFace className="w-4 h-4" />
                </div>
                <input
                  className="w-full bg-slate-900/40 border border-slate-700/80 rounded-xl px-4 py-3.5 pl-12 text-sm text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner"
                  name="email"
                  placeholder="USUARIO@SISTEMA.COM"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 group/input">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2" htmlFor="password">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30 group-focus-within/input:bg-amber-500 group-focus-within/input:shadow-[0_0_8px_#f59e0b] transition-all"></span>
                Código de Autorização
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500/40 group-focus-within/input:text-amber-500 transition-colors">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <input
                  className="w-full bg-slate-900/40 border border-slate-700/80 rounded-xl px-4 py-3.5 pl-12 text-sm text-amber-500 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner tracking-[0.3em]"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-6">
              <button
                formAction={login}
                className="relative overflow-hidden group/btn bg-slate-900/50 border border-amber-500/40 text-amber-400 font-mono tracking-widest uppercase rounded-xl px-4 py-4 text-xs font-bold transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-500"
              >
                <div className="absolute inset-0 w-0 bg-amber-500/10 transition-all duration-300 ease-out group-hover/btn:w-full"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <Lock className="w-3.5 h-3.5 group-hover/btn:hidden text-amber-500/70" />
                  <Fingerprint className="w-4 h-4 hidden group-hover/btn:block text-amber-400 animate-pulse" />
                  <span className="group-hover/btn:text-amber-300 transition-colors">Iniciar Sessão</span>
                </span>
              </button>
            </div>
            
            {searchParams?.message && (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] font-mono tracking-wider text-center rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.15)] flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                [FALHA_DE_AUTENTICAÇÃO]: {searchParams.message}
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 flex flex-col items-center justify-center text-amber-500/30 text-[9px] font-mono tracking-[0.4em] uppercase">
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent mb-3"></div>
        System Core v2.0.4 • Protocolo Ativo
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(-100vh); }
        }
      `}} />
    </div>
  );
}
