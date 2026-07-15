import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { ShareButton } from '@/components/dashboard/share-button'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.is_admin || false
  const allowedDashboards = profile?.allowed_dashboards || []

  // Busca os relatórios permitidos para este usuário
  let query = supabase.from('dashboards').select('*').order('department').order('name')
  
  if (!isAdmin && allowedDashboards.length > 0) {
      query = query.in('department', allowedDashboards)
  } else if (!isAdmin) {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000') 
  }

  const { data: dashboards } = await query

  const resolvedSearchParams = await searchParams
  
  // Extrai lista única de setores
  const departments = Array.from(new Set((dashboards || []).map(d => d.department)))
  
  // Define o setor ativo (da URL ou o primeiro disponível)
  const activeDept = typeof resolvedSearchParams.dept === 'string' 
     ? resolvedSearchParams.dept 
     : (departments[0] || '')

  // Filtra relatórios apenas do setor ativo
  const dashboardsInDept = (dashboards || []).filter(d => d.department === activeDept)

  // Pega o relatório selecionado na URL ou o primeiro da lista do setor
  const selectedDashId = typeof resolvedSearchParams.dash === 'string' 
     ? resolvedSearchParams.dash 
     : (dashboardsInDept[0]?.id || '')
     
  const selectedDash = dashboardsInDept.find(d => d.id === selectedDashId) || dashboardsInDept[0]

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-2 gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">Visão Geral</h1>
            <p className="text-slate-400 mt-1">Bem-vindo ao seu painel de controle corporativo.</p>
         </div>

         <div className="flex flex-col md:flex-row items-start md:items-end gap-4 w-full md:w-auto">
             <DashboardNav 
                departments={departments}
                activeDept={activeDept}
                dashboards={dashboardsInDept}
                activeDashId={selectedDash?.id || ''}
             />
             {selectedDash && (
                <div className="pb-1 w-full md:w-auto">
                    <ShareButton url={selectedDash.embed_url} />
                </div>
             )}
         </div>
      </div>
      
      {/* Container do Power BI */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[75vh] flex flex-col relative flex-1">
         {selectedDash ? (
            <iframe 
               title={selectedDash.name} 
               src={selectedDash.embed_url} 
               className="absolute inset-0 w-full h-full border-0"
               allowFullScreen
            />
         ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-500 gap-4">
               <p>Nenhum relatório disponível para o seu usuário.</p>
            </div>
         )}
      </div>
    </div>
  );
}
