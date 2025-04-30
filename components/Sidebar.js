"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MenuItem from "./MenuItem"
import { authController } from "../controllers/auth"
import { videoService } from "../app/services/videoService"

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const router = useRouter()

  const BANK_LABELS = {
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

  const loadVideos = async () => {
    const data = await videoService.getAllVideos()

    const uniqueBanks = [...new Set(data.map(item => item.bank))]

    const dynamicMenuItems = uniqueBanks
      .filter(bank => BANK_LABELS[bank]) // ignora bancos sem rótulo definido
      .map(bank => ({
        name: BANK_LABELS[bank],
        path: `/${bank.toLowerCase().replace(/\s+/g, "-")}`
      }))

    setMenuItems(dynamicMenuItems)
  }

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      loadVideos()
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  const handleLogout = () => {
    authController.clearAuthData()
    setCurrentUser(null)
    router.push("/login")
  }

  const extendedMenuItems = currentUser
    ? [
        ...menuItems,
        { name: "Adicionar Vídeo", path: "/adicionar-video" },
        { name: "Gerenciar Videos", path: "/gerenciar-videos" }
      ]
    : menuItems

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = authController.getAuthData()
        if (data.token) {
          const userData = await authController.getCurrentUser()
          setCurrentUser(userData)
        }
      } catch (err) {
        setError(err.message)
        console.error("Erro ao buscar dados do usuário:", err)
      }
    }

    fetchUserData()
  }, [])

  return (
    <>
      {/* Overlay para mobile - só aparece quando o menu está aberto em mobile */}
      {isMobile && isOpen && <div onClick={() => setIsOpen(false)} />}

      <div
        className={`fixed left-0 top-0 h-screen bg-gray-700 shadow-lg transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 flex bg-gray-800 justify-between items-center border-b border-gray-700">
          {isOpen && currentUser && (
            <div className="flex items-center space-x-3 ">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="text-white">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-300">{currentUser.email}</p>
              </div>
            </div>
          )}
          <button
            className="border-none cursor-pointer text-xl text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={handleToggle}
            aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isOpen ? "◀" : "☰"}
          </button>
        </div>

        {isOpen && (
          <nav className="p-4 flex flex-col h-[calc(100vh-4rem)]">
            <ul className="space-y-2 flex-grow">
              {extendedMenuItems.map(item => (
                <MenuItem key={item.name} name={item.name} path={item.path} />
              ))}
            </ul>

            <div className="mt-auto">
              <div className="border-t border-gray-700 my-4"></div>
              <ul className="space-y-2">
                {currentUser ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Sair
                    </button>
                  </li>
                ) : (
                  <MenuItem
                    name="Painel Admin"
                    path="/login"
                    className="text-gray-300 hover:text-white"
                  />
                )}
              </ul>
            </div>
          </nav>
        )}
        {error && isOpen && <div className="p-4 text-red-400 text-sm">{error}</div>}
      </div>
    </>
  )
}

export default Sidebar
