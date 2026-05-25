import React from 'react'

export default function ItemTarea({ tarea, onRealizar, onConfirmar, onEliminar, isAdmin }){
  return (
    <div className={`p-4 rounded-lg border bg-slate-800 border-slate-700`}>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <img src={tarea.grupo && tarea.grupo.imagenUrl ? tarea.grupo.imagenUrl : '/assets/task.png'} alt="task" className="w-12 h-12 rounded" />
          <div>
            <div className="font-semibold text-slate-100">{tarea.titulo}</div>
            <div className="text-sm text-slate-400">{tarea.descripcion}</div>
            <div className="text-xs text-slate-500 mt-1">
              XP: {tarea.puntosExperiencia || 0}
              {tarea.grupo ? ` • ${tarea.grupo.nombre}` : ''}
              {tarea.usuarioAsignado ? ` • Asignado a: ${tarea.usuarioAsignado.nombre}` : ''}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {tarea.completada ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs bg-emerald-400/10 px-2.5 py-0.5 rounded border border-emerald-400/20 uppercase tracking-wider font-bold">Confirmada</span>
          ) : tarea.realizada ? (
            isAdmin ? (
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold active:scale-95 transition-transform" onClick={()=>onConfirmar(tarea.id)}>CONFIRMAR</button>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1 text-xs bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider font-bold animate-pulse">Por confirmar</span>
            )
          ) : (
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold active:scale-95 transition-transform" onClick={()=>onRealizar(tarea.id)}>REALIZADA</button>
          )}
          <button className="text-xs text-rose-400 mt-1" onClick={()=>onEliminar(tarea.id)}>ELIMINAR</button>
        </div>
      </div>
    </div>
  )
}
