import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer'

// Função provisória para enviar mensagem via Evolution API
async function sendWhatsAppMessage(phoneNumbers: string, imageBuffer: Buffer) {
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
    const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !INSTANCE_NAME) {
        console.warn('Evolution API não configurada. Simulando envio para:', phoneNumbers)
        return true
    }

    const numbers = phoneNumbers.split(',').map(n => n.trim())
    
    // Converte o buffer da imagem para Base64
    const base64Image = imageBuffer.toString('base64')
    const base64Data = `data:image/png;base64,${base64Image}`

    for (const number of numbers) {
        try {
            await fetch(`${EVOLUTION_API_URL}/message/sendMedia/${INSTANCE_NAME}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY
                },
                body: JSON.stringify({
                    number: number,
                    mediatype: 'image',
                    media: base64Data,
                    caption: '📊 Aqui está o seu relatório diário atualizado!',
                })
            })
        } catch (error) {
            console.error(`Erro ao enviar para ${number}:`, error)
        }
    }
}

export async function GET(req: Request) {
    // Vercel Cron Authentication (opcional, mas recomendado)
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Pega a hora atual no formato HH:MM (ajustar fuso horário do servidor)
        const now = new Date()
        const currentHour = now.getHours().toString().padStart(2, '0')
        const currentMinute = now.getMinutes().toString().padStart(2, '0')
        const currentTime = `${currentHour}:${currentMinute}`

        // Busca automações que devem rodar agora
        const { data: automations, error } = await supabase
            .from('automations')
            .select('*, dashboards(embed_url)')
            .eq('is_active', true)
            .eq('schedule_time', currentTime)

        if (error || !automations || automations.length === 0) {
            return NextResponse.json({ message: 'Nenhuma automação para este horário: ' + currentTime })
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })

        for (const auto of automations) {
            const url = auto.dashboards?.embed_url
            if (!url) continue

            try {
                const page = await browser.newPage()
                await page.setViewport({ width: 1920, height: 1080 })
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
                await new Promise(resolve => setTimeout(resolve, 8000))
                
                const screenshot = await page.screenshot({ type: 'png', fullPage: false })
                await page.close()

                // Envia para o WhatsApp
                await sendWhatsAppMessage(auto.phone_numbers, screenshot as Buffer)
                
            } catch (err) {
                console.error(`Erro processando automação ${auto.id}:`, err)
            }
        }

        await browser.close()
        
        return NextResponse.json({ success: true, processed: automations.length })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
