import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  defaultCompact?: boolean
  storageKey?: string
  compactStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  compact: boolean
  setCompact: (compact: boolean) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  compact: false,
  setCompact: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultCompact = false,
  storageKey = "vite-ui-theme",
  compactStorageKey = "vite-ui-compact",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      const stored = localStorage.getItem(storageKey)
      return (stored === "light" || stored === "dark") ? stored : defaultTheme
    }
  )

  const [compact, setCompact] = useState<boolean>(
    () => {
      const stored = localStorage.getItem(compactStorageKey)
      return stored !== null ? stored === "true" : defaultCompact
    }
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.style.colorScheme = theme
    updateMetaThemeColor(theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    if (compact) {
      root.classList.add("compact")
    } else {
      root.classList.remove("compact")
    }
  }, [compact])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    compact,
    setCompact: (compact: boolean) => {
      localStorage.setItem(compactStorageKey, String(compact))
      setCompact(compact)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

function updateMetaThemeColor(theme: "dark" | "light") {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff")
  }
}