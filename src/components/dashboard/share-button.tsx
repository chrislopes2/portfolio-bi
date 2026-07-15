'use client'

import { useState } from 'react'
import { Camera, Loader2, Share2, Download } from 'lucide-react'

export function ShareButton({ url }: { url: string }) {
  const [loading, setLoading] = useState(false)

  async function handleShare() {
    setLoading(true)
    try {
      const response = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error('Falha ao gerar o print')
      }
      
      const blob = await response.blob()
      
      // Tentar usar a API nativa de compartilhamento se estiver disponível (ex: Mobile ou navegadores modernos)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'dashboard-print.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'Relatório Power BI',
                text: 'Confira os resultados mais recentes no painel.',
                files: [file]
            })
            setLoading(false)
            return
        }
      }
      
      // Fallback: Baixar a imagem
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'dashboard-print.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)

    } catch (error: any) {
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleShare}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors text-sm border border-slate-700 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Gerando Imagem...
        </>
      ) : (
        <>
          <Camera className="w-4 h-4" />
          Compartilhar Print
        </>
      )}
    </button>
  )
}
