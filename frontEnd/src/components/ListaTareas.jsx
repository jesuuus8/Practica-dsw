import React, { useEffect, useState } from 'react'
import ItemTarea from './ItemTarea'

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8081'

export default function ListaTareas(){
  const [tareas, setTareas] = useState([])
  const [user, setUser] = useState(null)

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/usuario`);
      if (res.ok) setUser(await res.json());
    } catch(e) {
      console.error('fetch user error', e)
    }
  };

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

  useEffect(()=>{
    fetchTareas()
    fetchUser()
    const refresh = () => {
      fetchTareas();
      fetchUser();
    };
    window.addEventListener('task-updated', refresh);
    return () => window.removeEventListener('task-updated', refresh);
  }, [])

  const realizar = async (id)=>{
    try{
      const res = await fetch(`${API}/api/tareas/${id}/realizar`, {method:'PUT'})
      if(res.ok) fetchTareas()
      else console.error('realizar failed', res.status)
    }catch(e){ console.error('realizar error', e) }
  }

  const confirmar = async (id)=>{
    try{
      const res = await fetch(`${API}/api/tareas/${id}/confirmar`, {method:'PUT'})
      if(res.ok) {
        fetchTareas()
        fetchUser()
      }
      else console.error('confirmar failed', res.status)
    }catch(e){ console.error('confirmar error', e) }
  }

  const eliminar = async (id)=>{
    try{
      const res = await fetch(`${API}/api/tareas/${id}`, {method:'DELETE'})
      if(res.ok) fetchTareas()
      else console.error('delete failed', res.status)
    }catch(e){ console.error('delete error', e) }
  }

  const isAdmin = user?.role === 'PROFESOR' || user?.role === 'PADRES';

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tareas.map(t => (
          <ItemTarea 
            key={t.id} 
            tarea={t} 
            onRealizar={realizar} 
            onConfirmar={confirmar} 
            onEliminar={eliminar} 
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}
