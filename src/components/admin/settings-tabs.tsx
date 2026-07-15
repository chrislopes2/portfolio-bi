'use client'

import { useState } from 'react'
import { Users, LayoutDashboard, Plus, Trash2, Edit, Bot, Clock, Phone } from 'lucide-react'
import { AdminUser, Dashboard, Automation, createUser, updateUser, deleteUser, manageDashboard, manageAutomation } from '@/app/dashboard/settings/actions'

export function SettingsTabs({ 
    initialTab, 
    users, 
    dashboards,
    automations
}: { 
    initialTab: string, 
    users: AdminUser[], 
    dashboards: Dashboard[],
    automations: any[]
}) {
    const [tab, setTab] = useState(initialTab)
    const [loading, setLoading] = useState(false)

    // Form States
    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const [showDashForm, setShowDashForm] = useState(false)
    const [editingDash, setEditingDash] = useState<Dashboard | null>(null)
    const [showAutoForm, setShowAutoForm] = useState(false)
    const [editingAuto, setEditingAuto] = useState<any | null>(null)

    async function handleUserSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = editingUser ? await updateUser(formData) : await createUser(formData)
        if (res.success) {
            setShowUserForm(false)
            setEditingUser(null)
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    async function handleDashSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await manageDashboard(formData)
        if (res.success) {
            setShowDashForm(false)
            setEditingDash(null)
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    async function handleAutoSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await manageAutomation(formData)
        if (res.success) {
            setShowAutoForm(false)
            setEditingAuto(null)
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    async function handleDeleteUser(id: string) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return
        setLoading(true)
        const res = await deleteUser(id)
        if (!res.success) alert(res.error)
        setLoading(false)
    }

    async function handleDeleteDash(id: string) {
        if (!confirm('Tem certeza que deseja excluir este dashboard?')) return
        setLoading(true)
        const formData = new FormData()
        formData.append('actionType', 'delete')
        formData.append('id', id)
        const res = await manageDashboard(formData)
        if (!res.success) alert(res.error)
        setLoading(false)
    }

    async function handleDeleteAuto(id: string) {
        if (!confirm('Excluir esta automação?')) return
        setLoading(true)
        const formData = new FormData()
        formData.append('actionType', 'delete')
        formData.append('id', id)
        const res = await manageAutomation(formData)
        if (!res.success) alert(res.error)
        setLoading(false)
    }

    async function handleToggleAuto(id: string, currentState: boolean) {
        setLoading(true)
        const formData = new FormData()
        formData.append('actionType', 'toggle')
        formData.append('id', id)
        formData.append('isActive', currentState.toString())
        const res = await manageAutomation(formData)
        if (!res.success) alert(res.error)
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Nav Tabs */}
            <div className="flex space-x-2 border-b border-slate-800">
                <button 
                    onClick={() => setTab('users')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${tab === 'users' ? 'border-[#EAB308] text-[#EAB308]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    <Users className="w-4 h-4" /> Usuários
                </button>
                <button 
                    onClick={() => setTab('dashboards')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${tab === 'dashboards' ? 'border-[#EAB308] text-[#EAB308]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    <LayoutDashboard className="w-4 h-4" /> Dashboards
                </button>
                <button 
                    onClick={() => setTab('automations')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${tab === 'automations' ? 'border-[#EAB308] text-[#EAB308]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    <Bot className="w-4 h-4" /> Automações
                </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
                {loading && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm">
                        <div className="w-8 h-8 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {tab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-slate-100">Gerenciar Usuários</h2>
                            <button 
                                onClick={() => { setEditingUser(null); setShowUserForm(!showUserForm); }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#ca9a04] text-slate-950 font-medium rounded-lg transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" /> Novo Usuário
                            </button>
                        </div>

                        {showUserForm && (
                            <form onSubmit={handleUserSubmit} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {editingUser && <input type="hidden" name="id" value={editingUser.id} />}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Nome Completo</label>
                                    <input name="fullName" defaultValue={editingUser?.full_name || ''} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">E-mail Corporativo</label>
                                    <input type="email" name="email" defaultValue={editingUser?.email || ''} required={!editingUser} disabled={!!editingUser} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none disabled:opacity-50" />
                                </div>
                                {!editingUser && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Senha Provisória</label>
                                        <input type="password" name="password" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none" />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-2">Permissões de Setores (Selecione o que o usuário pode ver)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 border border-slate-800 rounded-lg p-3">
                                        {['Financeiro', 'Marketing', 'Logistica', 'RH'].map(setor => (
                                            <label key={setor} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                                <input type="checkbox" name="allowedDashboards" value={setor} defaultChecked={editingUser?.allowed_dashboards?.includes(setor)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#EAB308] focus:ring-[#EAB308]" />
                                                {setor}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Deixe em branco se for marcar como Admin (admins veem tudo).</p>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-3">
                                        <input type="checkbox" name="isAdmin" defaultChecked={editingUser?.is_admin || false} className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-[#EAB308] focus:ring-[#EAB308]" />
                                        Usuário Administrador
                                    </label>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                    <button type="button" onClick={() => { setShowUserForm(false); setEditingUser(null); }} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-[#EAB308] hover:bg-[#ca9a04] text-slate-950 font-medium rounded-lg transition-colors text-sm">Salvar</button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800/50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Nome</th>
                                        <th className="px-6 py-4 font-medium">E-mail</th>
                                        <th className="px-6 py-4 font-medium">Perfil</th>
                                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-200">{u.full_name}</td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4">
                                                {u.is_admin ? (
                                                    <span className="inline-flex items-center rounded-full bg-[#EAB308]/10 px-2 py-1 text-xs font-medium text-[#EAB308] ring-1 ring-inset ring-[#EAB308]/20">Admin</span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-slate-400/10 px-2 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-400/20">Usuário</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => { setEditingUser(u); setShowUserForm(true); }} className="text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 'dashboards' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-slate-100">Gerenciar Relatórios</h2>
                            <button 
                                onClick={() => { setEditingDash(null); setShowDashForm(!showDashForm); }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#ca9a04] text-slate-950 font-medium rounded-lg transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" /> Novo Relatório
                            </button>
                        </div>

                        {showDashForm && (
                            <form onSubmit={handleDashSubmit} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {editingDash && <input type="hidden" name="id" value={editingDash.id} />}
                                
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Relatório</label>
                                    <input name="name" defaultValue={editingDash?.name} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Setor / Categoria</label>
                                    <select name="department" defaultValue={editingDash?.department || "Financeiro"} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none">
                                        <option value="Financeiro">Financeiro</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Logistica">Logística</option>
                                        <option value="RH">RH</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Link de Incorporação (Embed URL do Power BI)</label>
                                    <input name="embedUrl" defaultValue={editingDash?.embed_url} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none" />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                    <button type="button" onClick={() => { setShowDashForm(false); setEditingDash(null); }} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-[#EAB308] hover:bg-[#ca9a04] text-slate-950 font-medium rounded-lg transition-colors text-sm">Salvar</button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {dashboards.map(d => (
                                <div key={d.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-[#EAB308] bg-[#EAB308]/10 px-2 py-0.5 rounded-full">{d.department}</span>
                                            <h3 className="text-base font-semibold text-slate-200 mt-2">{d.name}</h3>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingDash(d); setShowDashForm(true); }} className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteDash(d.id)} className="text-slate-400 hover:text-red-400 p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 flex">
                                        <p className="text-xs text-slate-500 truncate" title={d.embed_url}>{d.embed_url}</p>
                                    </div>
                                </div>
                            ))}
                            {dashboards.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                                    Nenhum relatório cadastrado.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'automations' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-slate-100">Disparos de WhatsApp</h2>
                            <button 
                                onClick={() => { setEditingAuto(null); setShowAutoForm(!showAutoForm); }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#ca9a04] text-slate-950 font-medium rounded-lg transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" /> Nova Automação
                            </button>
                        </div>

                        {showAutoForm && (
                            <form onSubmit={handleAutoSubmit} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {editingAuto && <input type="hidden" name="id" value={editingAuto.id} />}
                                
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Qual relatório deseja enviar?</label>
                                    <select name="dashboardId" defaultValue={editingAuto?.dashboard_id} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none">
                                        <option value="">Selecione um relatório...</option>
                                        {dashboards.map(d => (
                                            <option key={d.id} value={d.id}>{d.department} - {d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Horário de Disparo (HH:MM)</label>
                                    <div className="relative">
                                        <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                        <input type="time" name="scheduleTime" defaultValue={editingAuto?.schedule_time} required className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Números (DDI+DDD+Número, separados por vírgula)</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                        <input type="text" name="phoneNumbers" placeholder="5551999999999, 5511999999999" defaultValue={editingAuto?.phone_numbers} required className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] outline-none" />
                                    </div>
                                </div>
                                {!editingAuto && (
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                            <input type="checkbox" name="isNewActive" defaultChecked={true} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#EAB308] focus:ring-[#EAB308]" />
                                            Já iniciar ativada
                                        </label>
                                    </div>
                                )}
                                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                    <button type="button" onClick={() => { setShowAutoForm(false); setEditingAuto(null); }} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-[#EAB308] hover:bg-[#ca9a04] text-slate-950 font-medium rounded-lg transition-colors text-sm">Salvar</button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800/50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Relatório</th>
                                        <th className="px-6 py-4 font-medium">Horário</th>
                                        <th className="px-6 py-4 font-medium">Destinatários</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                                    {automations?.map(a => (
                                        <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-200">
                                                {a.dashboards?.department} - {a.dashboards?.name}
                                            </td>
                                            <td className="px-6 py-4 text-[#EAB308] font-bold">{a.schedule_time}</td>
                                            <td className="px-6 py-4 truncate max-w-[200px]" title={a.phone_numbers}>{a.phone_numbers}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => handleToggleAuto(a.id, a.is_active)}
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${a.is_active ? 'bg-green-500/10 text-green-400 ring-green-500/20 hover:bg-green-500/20' : 'bg-slate-500/10 text-slate-400 ring-slate-500/20 hover:bg-slate-500/20'}`}
                                                >
                                                    {a.is_active ? 'Ativa' : 'Pausada'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => { setEditingAuto(a); setShowAutoForm(true); }} className="text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteAuto(a.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!automations || automations.length === 0) && (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Nenhuma automação configurada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
