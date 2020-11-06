import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react'

import AsyncStorage from '@react-native-community/async-storage'

import api from '../services/api'

interface User {
  id: string
  name: string
  cpf: string
  avatar_url: string
}

interface AuthState {
  Token: string
  Nome: User
  Cpf: string
}

interface SignInCredentials {
  cpf: string
  nascimento: string
}

interface AuthContextData {
  Nome: User
  Cpf: String
  Token: String
  loading: boolean
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  updateUser(Nome: User): Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      console.log('ler dados asyncStorage')
      const [Token, Nome, Cpf] = await AsyncStorage.multiGet([
        '@GoBarber:Token',
        '@GoBarber:Nome',
        '@GoBarber:Cpf',
      ])

      if (Token[1] && Nome[1]) {
        api.defaults.headers.authorization = `Bearer ${Token[1]}`

        setData({ Token: Token[1], Nome: JSON.parse(Nome[1]), Cpf: JSON.parse(Cpf[1])})
      }

      setLoading(false)
    }

    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ cpf, nascimento }) => {
    const response = await api.post('/WSAgendamento/Login',null, { params:{
      cpf: cpf,
      nascimento: nascimento,
    }
    })

    const { Token, Filial, Nome, Cpf } = response.data
    console.log(Cpf);
    
    await AsyncStorage.multiSet([
      ['@GoBarber:Token', Token],
      ['@GoBarber:Filial', JSON.stringify(Filial)],
      ['@GoBarber:Nome', JSON.stringify(Nome)],
      ['@GoBarber:Cpf', JSON.stringify(Cpf)],
    ])
    api.defaults.headers.authorization = `Bearer ${Token}`
    setData({ Token, Nome, Cpf })
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:Token', '@GoBarber:Nome','@GoBarber:Filial','@GoBarber:Cpf'])

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    async (Nome: User) => {
      await AsyncStorage.setItem('@GoBarber:Nome', JSON.stringify(Nome))

      setData({
        Token: data.Token,
        Cpf: data.Cpf,
        Nome,
      })
    },
    [setData, data.Token],
  )

  return (
    <AuthContext.Provider
      value={{ Nome: data.Nome, Cpf: data.Cpf, Token: data.Token, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
