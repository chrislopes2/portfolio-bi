import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'A URL do relatório é obrigatória.' }, { status: 400 })
  }

  try {
    // Inicia o navegador invisível
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    
    const page = await browser.newPage()
    // Define a resolução da tela
    await page.setViewport({ width: 1920, height: 1080 })
    
    // Acessa a URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Aguarda mais 8 segundos para garantir que os gráficos do Power BI renderizaram
    await new Promise(resolve => setTimeout(resolve, 8000))

    // Tira o print
    const screenshot = await page.screenshot({ type: 'png', fullPage: false })
    
    await browser.close()
    
    // Retorna a imagem
    return new NextResponse(Buffer.from(screenshot), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="dashboard-print.png"',
      },
    })
  } catch (error: any) {
    console.error('Erro ao tirar print:', error)
    return NextResponse.json({ error: 'Falha ao processar imagem: ' + error.message }, { status: 500 })
  }
}
