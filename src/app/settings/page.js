'use client'

import { useTheme } from '../Components/ThemeProvider'
import '../settings/page.css'
export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="theme-toggle">
        <p>Current theme: {darkMode ? 'Dark' : 'Light'}</p>
        <button onClick={toggleDarkMode}>
          Toggle Theme
        </button>
      </div>
    </div>
  )
}