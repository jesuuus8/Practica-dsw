import React, {useEffect, useState} from 'react'

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8081'

export default function GrupoView(){
  const [grupos, setGrupos] = useState([])

  useEffect(()=>{ fetchGrupos() }, [])

  const fetchGrupos = async ()=>{
    try{ const res = await fetch(`${API}/api/grupos`); if(res.ok) setGrupos(await res.json()) }catch(e){ }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Grupos</h3>
      {grupos.length === 0 ? (
        <div className="text-sm text-gray-500">No hay grupos aún</div>
      ) : (
        <ul className="space-y-3">
          {grupos.map(g => (
            <li key={g.id} className="flex items-center gap-3">
              <img src={g.imagenUrl || '/assets/group.png'} alt="g" className="w-10 h-10 rounded" />
              <div>
                <div className="font-medium">{g.nombre}</div>
                <div className="text-xs text-gray-400">{g.miembros ? g.miembros.length : 0} miembros</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
