import { createContext, useContext } from 'react'

export type AnnounceFn = (message: string) => void

export const AnnounceContext = createContext<AnnounceFn>(() => {})

export function useAnnounce(): AnnounceFn {
  return useContext(AnnounceContext)
}
