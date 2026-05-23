import React from 'react'

export default function ItemTarea({ tarea, onCompletar, onEliminar }){
  return (
    <div className={`p-4 rounded-lg border ${tarea.completada ? 'bg-slate-800 border-slate-700' : 'bg-slate-800 border-slate-700'}`}>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <img src={tarea.grupo && tarea.grupo.imagenUrl ? tarea.grupo.imagenUrl : '/assets/task.png'} alt="task" className="w-12 h-12 rounded" />
          <div>
            <div className="font-semibold text-slate-100">{tarea.titulo}</div>
            <div className="text-sm text-slate-400">{tarea.descripcion}</div>
            <div className="text-xs text-slate-500 mt-1">XP: {tarea.puntosExperiencia || 0} {tarea.grupo ? `• ${tarea.grupo.nombre}` : ''}</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {!tarea.completada ? (
            <button className="bg-emerald-500 text-white px-3 py-1 rounded" onClick={()=>onCompletar(tarea.id)}>COMPLETE</button>
          ) : (
            <span className="text-emerald-400 font-semibold">DONE</span>
          )}
          <button className="text-xs text-rose-400" onClick={()=>onEliminar(tarea.id)}>DELETE</button>
        </div>
      </div>
    </div>
  )
}
