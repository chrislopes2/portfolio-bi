'use server'

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export type AdminUser = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean | null
  allowed_dashboards: string[] | null
  created_at: string
}

export type Dashboard = {
    id: string
    name: string
    department: string
    embed_url: string
    created_at: string
}

async function requireAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        throw new Error('Acesso negado: permissão de administrador necessária')
    }
}

// -- USERS --

export async function getUsers() {
  try {
    const supabase = createAdminClient()
    
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) return { success: false, error: 'Falha ao buscar usuários: ' + error.message }
    if (!profiles) return { success: true, users: [] }

    const { data: authData } = await supabase.auth.admin.listUsers()
    const authUserMap = new Map((authData?.users ?? []).map(u => [u.id, u]))

    const combinedUsers: AdminUser[] = profiles.map((profile) => {
        const authUser = authUserMap.get(profile.id)
        return {
            id: profile.id,
            email: authUser?.email ?? '',
            full_name: profile.full_name || 'N/A',
            is_admin: profile.is_admin || false,
            allowed_dashboards: profile.allowed_dashboards || [],
            created_at: authUser?.created_at ?? new Date().toISOString(),
        }
    })

    return { success: true, users: combinedUsers }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createUser(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const isAdmin = formData.get('isAdmin') === 'on'
  const allowedDashboards = formData.getAll('allowedDashboards').map(s => s.toString().trim()).filter(Boolean) || []
  
  try {
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (createError || !user) return { success: false, error: createError?.message }

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            full_name: fullName,
            is_admin: isAdmin,
            allowed_dashboards: allowedDashboards,
        })

    if (profileError) return { success: false, error: profileError.message }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (e: any) {
      return { success: false, error: e.message }
  }
}

export async function updateUser(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  
  const id = formData.get('id') as string
  const fullName = formData.get('fullName') as string
  const isAdmin = formData.get('isAdmin') === 'on'
  const allowedDashboards = formData.getAll('allowedDashboards').map(s => s.toString().trim()).filter(Boolean) || []
  
  try {
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            is_admin: isAdmin,
            allowed_dashboards: allowedDashboards,
        })
        .eq('id', id)

    if (profileError) return { success: false, error: profileError.message }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (e: any) {
      return { success: false, error: e.message }
  }
}

export async function deleteUser(userId: string) {
    await requireAdmin()
    const supabase = createAdminClient()
    try {
        const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId)
        if (profileError) return { success: false, error: profileError.message }

        const { error } = await supabase.auth.admin.deleteUser(userId)
        if (error) return { success: false, error: error.message }
        
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// -- DASHBOARDS --

export async function getDashboards() {
    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase.from('dashboards').select('*').order('department').order('name')
        if (error) return { success: false, error: error.message }
        return { success: true, dashboards: data as Dashboard[] }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function manageDashboard(formData: FormData) {
    await requireAdmin()
    const supabase = createAdminClient()
    
    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const department = formData.get('department') as string
    const embedUrl = formData.get('embedUrl') as string
    const actionType = formData.get('actionType') as string

    if (actionType === 'delete' && id) {
         const { error } = await supabase.from('dashboards').delete().eq('id', id)
         if (error) return { success: false, error: error.message }
         revalidatePath('/dashboard/settings')
         return { success: true }
    }

    try {
        if (id) {
            const { error } = await supabase.from('dashboards').update({ name, department, embed_url: embedUrl }).eq('id', id)
            if (error) return { success: false, error: error.message }
        } else {
            const { error } = await supabase.from('dashboards').insert({ name, department, embed_url: embedUrl })
            if (error) return { success: false, error: error.message }
        }
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// -- AUTOMATIONS --

export type Automation = {
    id: string
    dashboard_id: string
    phone_numbers: string
    schedule_time: string
    is_active: boolean
    created_at: string
}

export async function getAutomations() {
    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase.from('automations').select('*, dashboards(name, department)').order('created_at', { ascending: false })
        if (error) return { success: false, error: error.message }
        return { success: true, automations: data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function manageAutomation(formData: FormData) {
    await requireAdmin()
    const supabase = createAdminClient()
    
    const id = formData.get('id') as string | null
    const dashboardId = formData.get('dashboardId') as string
    const phoneNumbers = formData.get('phoneNumbers') as string
    const scheduleTime = formData.get('scheduleTime') as string
    const isActive = formData.get('isActive') === 'true'
    const isNewActive = formData.get('isNewActive') === 'on'
    const actionType = formData.get('actionType') as string

    if (actionType === 'delete' && id) {
         const { error } = await supabase.from('automations').delete().eq('id', id)
         if (error) return { success: false, error: error.message }
         revalidatePath('/dashboard/settings')
         return { success: true }
    }

    if (actionType === 'toggle' && id) {
        const { error } = await supabase.from('automations').update({ is_active: !isActive }).eq('id', id)
        if (error) return { success: false, error: error.message }
        revalidatePath('/dashboard/settings')
        return { success: true }
    }

    try {
        if (id) {
            const { error } = await supabase.from('automations').update({ 
                dashboard_id: dashboardId, 
                phone_numbers: phoneNumbers, 
                schedule_time: scheduleTime 
            }).eq('id', id)
            if (error) return { success: false, error: error.message }
        } else {
            const { error } = await supabase.from('automations').insert({ 
                dashboard_id: dashboardId, 
                phone_numbers: phoneNumbers, 
                schedule_time: scheduleTime,
                is_active: isNewActive
            })
            if (error) return { success: false, error: error.message }
        }
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}
