import React, { useEffect, useState } from 'react'
import FormularioTarea from './FormularioTarea'
import ItemTarea from './ItemTarea'

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8081'

export default function ListaTareas(){
  const [tareas, setTareas] = useState([])

  const fetchTareas = async ()=>{
    try{
      const res = await fetch(`${API}/api/tareas`)
      if(!res.ok){
        console.error('fetch tareas failed', res.status, await res.text())
        return
      }
      const data = await res.json()
      setTareas(data)
    }catch(e){
      console.error('fetch tareas error', e)
    }
  }

  useEffect(()=>{ fetchTareas() }, [])

  const crear = async (payload)=>{
    try{
      const res = await fetch(`${API}/api/tareas`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
      if(res.ok){ fetchTareas() }
      else console.error('crear tarea failed', res.status)
    }catch(e){ console.error('crear tarea error', e) }
  }

  const completar = async (id)=>{
    try{
      const res = await fetch(`${API}/api/tareas/${id}/completar`, {method:'PUT'})
      if(res.ok) fetchTareas()
      else console.error('completar failed', res.status)
    }catch(e){ console.error('completar error', e) }
  }

  const eliminar = async (id)=>{
    try{
      const res = await fetch(`${API}/api/tareas/${id}`, {method:'DELETE'})
      if(res.ok) fetchTareas()
      else console.error('delete failed', res.status)
    }catch(e){ console.error('delete error', e) }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tareas.map(t => (
          <ItemTarea key={t.id} tarea={t} onCompletar={completar} onEliminar={eliminar} />
        ))}
      </div>
    </div>
  )
}
