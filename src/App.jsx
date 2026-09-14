import { useState } from 'react'
import Dashboard from './modules/home/Dashboard.jsx'
import { MODULES } from './modules/index.js'

function App() {
  const [activeModuleId, setActiveModuleId] = useState(null)
  const activeModule = MODULES.find((module) => module.id === activeModuleId)

  if (activeModule) {
    const { Component } = activeModule
    return <Component onBack={() => setActiveModuleId(null)} />
  }

  return <Dashboard modules={MODULES} onOpenModule={setActiveModuleId} />
}

export default App
