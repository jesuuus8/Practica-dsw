import React from 'react'

export default function BarraProgreso({ xp=0, siguiente=100 }){
  const ratio = Math.min(1, xp / siguiente)
  const pct = Math.round(ratio * 100)
  return (
    <div style={{width:'100%'}}>
      <div style={{height:12,background:'#e6e7ee',borderRadius:6,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',background:'#4f46e5'}} />
      </div>
      <div style={{fontSize:12,marginTop:6}}>{xp} XP • {pct}% hacia {siguiente} XP</div>
    </div>
  )
}
