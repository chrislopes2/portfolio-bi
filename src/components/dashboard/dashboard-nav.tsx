'use client'

import { useRouter } from 'next/navigation'

export function DashboardNav({
  departments,
  activeDept,
  dashboards,
  activeDashId
}: {
  departments: string[],
  activeDept: string,
  dashboards: { id: string, name: string }[],
  activeDashId: string
}) {
  const router = useRouter()

  if (departments.length === 0) return null

  return (
    <div className="flex flex-col gap-3 w-full md:w-auto items-start md:items-end">
      {/* Tabs para os setores */}
      <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => router.push(`/dashboard?dept=${encodeURIComponent(dept)}`)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors border ${activeDept === dept ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}
          >
            {dept}
          </button>
        ))}
      </div>
      
      {/* Dropdown para os relatórios dentro do setor */}
      {dashboards.length > 1 && (
        <select 
           value={activeDashId}
           onChange={(e) => router.push(`/dashboard?dept=${encodeURIComponent(activeDept)}&dash=${e.target.value}`)}
           className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none"
        >
          {dashboards.map(dash => (
            <option key={dash.id} value={dash.id}>{dash.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}
