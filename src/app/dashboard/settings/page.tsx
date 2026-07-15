import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getUsers, getDashboards, getAutomations } from './actions'
import { SettingsTabs } from '@/components/admin/settings-tabs'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.is_admin || false
  const resolvedSearchParams = await searchParams
  const tab = typeof resolvedSearchParams.tab === 'string' ? resolvedSearchParams.tab : 'users'

  let usersData = []
  let dashboardsData = []
  let automationsData = []

  if (isAdmin) {
      const [{ users }, { dashboards }, { automations }] = await Promise.all([
          getUsers(),
          getDashboards(),
          getAutomations()
      ])
      usersData = users || []
      dashboardsData = dashboards || []
      automationsData = automations || []
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-100">Configurações</h1>
           <p className="text-slate-400 mt-1">Gerencie os acessos e relatórios da plataforma.</p>
        </div>
      </div>

      {!isAdmin ? (
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            Você não tem permissão de administrador para visualizar esta página.
         </div>
      ) : (
         <SettingsTabs 
            initialTab={tab} 
            users={usersData} 
            dashboards={dashboardsData}
            automations={automationsData}
         />
      )}
    </div>
  )
}
