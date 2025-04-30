"use client"

import { useState, useEffect } from "react"
import { videoService } from "../services/videoService"
import Image from "next/image"

export default function GerenciarVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingVideo, setEditingVideo] = useState(null)
  const [editTitle, setEditTitle] = useState("")

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const data = await videoService.getAllVideos()
      setVideos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = video => {
    setEditingVideo(video)
    setEditTitle(video.title)
  }

  const handleSaveEdit = async () => {
    try {
      setLoading(true)
      await videoService.updateVideo(editingVideo.id, { title: editTitle })
      await loadVideos()
      setEditingVideo(null)
      setEditTitle("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async videoId => {
    if (window.confirm("Tem certeza que deseja excluir este vídeo?")) {
      try {
        setLoading(true)
        await videoService.deleteVideo(videoId)
        window.alert("Vídeo excluído com sucesso!")
        await loadVideos()
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciar Vídeos</h1>
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
                  {editingVideo?.id === video.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Digite o novo título"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingVideo(null)
                            setEditTitle("")
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200 font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {video.title}
                      </h2>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(video)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors duration-200 font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}
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
