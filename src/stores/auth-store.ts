import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const AUTH_USER = 'auth_user'

interface AuthUser {
  id: string
  email: string
  role: string[]
  exp: number
  names?: string
  lastName?: string
  logo?: string
  logoUrl?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

// Initialize state from storage
const getInitialToken = () => {
  const cookieState = getCookie(ACCESS_TOKEN)
  return cookieState ? JSON.parse(cookieState) : ''
}

const getInitialUser = (): AuthUser | null => {
  try {
    const userState = localStorage.getItem(AUTH_USER)
    if (!userState) return null

    const user = JSON.parse(userState) as AuthUser

    // Check if token is expired
    if (user.exp && user.exp < Date.now()) {
      localStorage.removeItem(AUTH_USER)
      localStorage.removeItem('auth_token')
      removeCookie(ACCESS_TOKEN)
      return null
    }

    return user
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  return {
    auth: {
      user: getInitialUser(),
      setUser: (user) => {
        if (user) {
          localStorage.setItem(AUTH_USER, JSON.stringify(user))
        } else {
          localStorage.removeItem(AUTH_USER)
        }
        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      accessToken: getInitialToken(),
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          localStorage.removeItem(AUTH_USER)
          localStorage.removeItem('auth_token')
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
