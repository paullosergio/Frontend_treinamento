export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authController = {
  async login(cpf, password) {
    try {
      const response = await fetch(`${API_URL}/usuarios/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      return {
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { token } = this.getAuthData();
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await fetch(`${API_URL}/usuarios/current-user/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar dados do usuário");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  setAuthData(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAuthData() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user };
  },

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
