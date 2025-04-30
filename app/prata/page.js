"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { videoService } from "../services/videoService"

export default function PrataPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await videoService.getVideosByBank("prata")
        console.log(data)
        setVideos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="sm:p-6 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Prata Digital</h1>

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {videos.map(video => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
              <div className="p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-semibold mb-2 text-black line-clamp-2">
                  {video.title}
                </h2>
                <a
                  href={video.video_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
                >
                  Assistir
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <p className="text-gray-500 text-base sm:text-lg">Nenhum vídeo encontrado</p>
        </div>
      )}
    </div>
  )
}
