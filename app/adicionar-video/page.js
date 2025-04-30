"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { videoService } from "../services/videoService"

const VALID_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/x-matroska"
]

export default function AdicionarBancoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    bank: "",
    video_file: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fileError, setFileError] = useState(null)

  const validateFile = file => {
    if (!file) return false

    // Remove pontos extras e mantém apenas o último ponto antes da extensão
    const fileName = file.name
    const lastDotIndex = fileName.lastIndexOf(".")
    if (lastDotIndex === -1) {
      setFileError("O arquivo deve ter uma extensão")
      return false
    }

    const nameWithoutExt = fileName.substring(0, lastDotIndex)
    const extension = fileName.substring(lastDotIndex)
    const cleanName = nameWithoutExt.replace(/\./g, "") + extension

    // Atualiza o nome do arquivo
    const newFile = new File([file], cleanName, { type: file.type })
    setFormData(prev => ({
      ...prev,
      video_file: newFile
    }))

    // Verifica o tipo do arquivo
    if (!VALID_VIDEO_TYPES.includes(file.type)) {
      setFileError("Formato de vídeo não suportado. Use MP4, WebM, OGG, MOV, AVI, WMV ou MKV.")
      return false
    }

    // Verifica o tamanho do arquivo (máximo 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB em bytes
    if (file.size > maxSize) {
      setFileError("O arquivo é muito grande. Tamanho máximo permitido: 500MB")
      return false
    }

    setFileError(null)
    return true
  }

  const handleChange = e => {
    const { name, value, files } = e.target

    if (name === "video_file" && files && files[0]) {
      if (validateFile(files[0])) {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }))
      } else {
        // Limpa o input de arquivo se a validação falhar
        e.target.value = ""
        setFormData(prev => ({
          ...prev,
          [name]: null
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!validateFile(formData.video_file)) {
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("bank", formData.bank)
      formDataToSend.append("video_file", formData.video_file)

      await videoService.uploadVideo(formDataToSend)
      setSuccess(true)
      setFormData({
        title: "",
        bank: "",
        video_file: null
      })

      // Redireciona após 2 segundos para dar tempo do usuário ver a mensagem de sucesso
      setTimeout(() => {
        router.push("/gerenciar-videos")
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Adicionar Vídeo</h1>

      {error && (
        <div
          className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div
          className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Vídeo enviado com sucesso!</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
            Título do Vídeo
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-black"
            placeholder="Digite o título do vídeo"
          />
        </div>

        <div>
          <label htmlFor="bank" className="block text-sm font-medium text-black mb-1">
            Banco
          </label>
          <select
            id="bank"
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            required
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-black"
          >
            <option value="">Selecione o banco</option>
            <option value="prata">Prata Digital</option>
            <option value="di">DI+</option>
            <option value="crefisa">Crefisa</option>
            <option value="vctex">VCTEX</option>
            <option value="hub_credito">Hub Crédito</option>
            <option value="corbee">Sistema de Comssionamento Corbee</option>
            <option value="ph_tech">PH Tech</option>
            <option value="grandino">Grandino</option>
            <option value="lotus">Lotus</option>
            <option value="v8">V8</option>
            <option value="granapix">Granapix</option>
            <option value="icred">ICred</option>
            <option value="novo_saque">Novo Saque</option>
          </select>
        </div>

        <div>
          <label htmlFor="video_file" className="block text-sm font-medium text-black mb-1">
            Arquivo do Vídeo
          </label>
          <input
            type="file"
            id="video_file"
            name="video_file"
            onChange={handleChange}
            required
            placeholder="Selecione o vídeo"
            accept=".mp4,.webm,.ogg,.mov,.avi,.wmv,.mkv,video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/x-matroska"
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-black"
          />
          {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Formatos aceitos: MP4, WebM, OGG, MOV, AVI, WMV, MKV. Tamanho máximo: 500MB
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || fileError}
            className={`w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || fileError
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? "Enviando..." : "Enviar Vídeo"}
          </button>
        </div>
      </form>
    </div>
  )
}
