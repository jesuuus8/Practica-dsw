import React, {useEffect, useState} from 'react'

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8081'

export default function PerfilUsuario(){
  const [user, setUser] = useState(null)

  useEffect(()=>{ fetchUser() }, [])

  const fetchUser = async ()=>{
    try{
      const res = await fetch(`${API}/api/usuario`)
      if(!res.ok) return
      const data = await res.json()
      setUser(data)
    }catch(e){ console.error(e) }
  }

  if(!user) return (
    <div className="bg-slate-800 p-4 rounded shadow">Cargando usuario...</div>
  )

  const xp = user.xpActual || 0
  const nivel = user.nivel || 1
  const porcentaje = Math.round((xp/100) * 100)

  return (
    <div className="bg-slate-800 p-4 rounded shadow mb-4">
      <div className="flex items-center gap-3">
        <img src="/assets/avatar.png" alt="avatar" className="w-16 h-16 rounded-full border-2 border-indigo-500" />
        <div>
          <div className="text-xl font-semibold text-slate-100">{user.nombre || 'Player'}</div>
          <div className="text-sm text-slate-300">Nivel {nivel} • {xp} XP</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div className="h-3 bg-emerald-400" style={{width: `${porcentaje}%`}} />
        </div>
        <div className="text-sm text-slate-300 mt-2">{porcentaje}% hacia el siguiente nivel</div>
      </div>
    </div>
  )
}
