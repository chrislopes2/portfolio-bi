"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/login?message=Não foi possível autenticar o usuário");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("name") as string,
      }
    }
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup error:", error);
    return redirect(`/login?message=Erro ao criar conta: ${error.message}`);
  }

  // Se o Supabase exigir confirmação de e-mail, a sessão não é iniciada automaticamente
  if (authData.user && !authData.session) {
    return redirect("/login?message=Conta criada! Verifique seu e-mail para confirmar o cadastro, ou desative a 'Confirmação de Email' nas configurações do Supabase (Auth > Providers > Email).");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
