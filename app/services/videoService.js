import { API_URL } from "@/controllers/auth"
import { authController } from "@/controllers/auth"

export const videoService = {
  async getVideosByBank(bank) {
    try {
      const response = await fetch(`${API_URL}/videos/?bank=${bank}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar vídeos")
      }
      return await response.json()
    } catch (error) {
      throw new Error(`Erro na requisição: ${error.message}`)
    }
  },

  async getAllVideos() {
    try {
      const response = await fetch(`${API_URL}/videos/`)
      if (!response.ok) {
        throw new Error("Erro ao carregar vídeos")
      }
      return await response.json()
    } catch (error) {
      throw new Error(`Erro na requisição: ${error.message}`)
    }
  },

  async uploadVideo(formData) {
    try {
      const { token } = authController.getAuthData()
      const response = await fetch(`${API_URL}/videos/upload/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao enviar vídeo")
      }

      return await response.json()
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
