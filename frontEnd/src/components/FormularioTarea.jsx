import React, { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8081'

export default function FormularioTarea({ onCrear }){
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [puntos, setPuntos] = useState(10)
  const [grupos, setGrupos] = useState([])
  const [grupoId, setGrupoId] = useState('')

  useEffect(()=>{ fetchGrupos() }, [])

  const fetchGrupos = async ()=>{
    try{ const res = await fetch(`${API}/api/grupos`); if(res.ok) setGrupos(await res.json()) }catch(e){ }
  }

  const submit = async (e) =>{
    e.preventDefault()
    if(!titulo) return
    const payload = { titulo, descripcion, puntosExperiencia: Number(puntos) }
    if(grupoId) payload.grupo = { id: Number(grupoId) }
    await onCrear(payload)
    setTitulo('')
    setDescripcion('')
    setPuntos(10)
    setGrupoId('')
  }

  return (
    <form onSubmit={submit} className="grid gap-3 grid-cols-1 md:grid-cols-3">
      <input className="col-span-2 p-2 border rounded" placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} />
      <select className="p-2 border rounded" value={puntos} onChange={e=>setPuntos(e.target.value)}>
        <option value={10}>Fácil - 10 XP</option>
        <option value={20}>Media - 20 XP</option>
        <option value={40}>Difícil - 40 XP</option>
      </select>
      <input className="col-span-3 p-2 border rounded" placeholder="Descripción (opcional)" value={descripcion} onChange={e=>setDescripcion(e.target.value)} />
      <select className="p-2 border rounded" value={grupoId} onChange={e=>setGrupoId(e.target.value)}>
        <option value="">Sin grupo</option>
        {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
      </select>
      <div className="col-span-2 text-right">
        <button className="px-4 py-2 bg-green-600 text-white rounded">Añadir tarea</button>
      </div>
    </form>
  )
}
