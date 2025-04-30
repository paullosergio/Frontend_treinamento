"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { videoService } from "../services/videoService"
import { useParams } from "next/navigation"

const BANK_NAMES = {
    prata: "Prata Digital",
    di: "DI+",
    crefisa: "Crefisa",
    unno: "Unno",
    vctex: "VCTEX",
    hub_credito: "Hub Crédito",
    corbee: "Sistema de Comssionamento",
    ph_tech: "PH Tech",
    grandino: "Grandino",
    lotus: "Lotus",
    v8: "V8",
    granapix: "Granapix",
    icred: "ICred",
    novo_saque: "Novo Saque"
}

export default function BankPage() {
  const params = useParams()
  const bank = params.bank
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await videoService.getVideosByBank(bank)
        setVideos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [bank])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg" role="alert">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className=" bg-gray-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {BANK_NAMES[bank] || "Banco"}
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total: {videos.length} vídeos</span>
          </div>
        </div>

        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image
                    src="/thumbnail.png"
                    alt={video.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {video.title}
                  </h2>
                  <a
                    href={video.video_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Assistir
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
            <svg
              className="h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"
              />
            </svg>
            <p className="text-lg text-gray-500">Nenhum vídeo encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
