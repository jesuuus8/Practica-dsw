import React from 'react';

// Subcomponentes para cada sección
function TopAppBar() {
  return (
    <header className="bg-surface shadow-sm docked full-width top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-[20px] py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <img alt="Avatar de usuario" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA98l3sQ2VdiHUk2fFE50ag4rSRbWnMaTawL5VmpCd57n97liDvLVuFx8Wxehn59ZDC_ifONW3ssIMjocw8lecom6dSof9Tw0iY-tG-Q1wp6mzdO3wAt3lJy9wmLlx5I1iPooZ3IAoMxd6lr5M6092T5okg6C1miLxV8d_qSLflO4gxTvh_hCs_RuSRaa66CuBtDp3KqOpAucVDT6z0KcbGEhPnXAOt7Z55vzzi1oit5BSfrxJtCi1pCqzgSPVxZlIsCxHl6VvwEuk" />
          </div>
          <h1 className="font-bold text-primary text-2xl">TaskQuest</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high transition-colors rounded-full text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}

function HeroWelcome() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-on-surface">El Centro</h2>
      <p className="text-base text-on-surface-variant">¿Listo para las aventuras de hoy, Alex?</p>
    </section>
  );
}

function Achievements() {
  // Aquí se puede mapear logros dinámicos
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <h3 className="uppercase tracking-wider text-on-surface-variant font-semibold">Logros</h3>
        <span className="text-primary font-medium cursor-pointer">Ver todos</span>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-[20px] px-[20px]">
        {/* Logros hardcodeados por ahora */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 group">
          <div className="w-20 h-20 rounded-full border-4 border-primary-container bg-surface-container-lowest shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>wb_sunny</span>
          </div>
          <span className="text-xs">Madrugador</span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center gap-2 group">
          <div className="w-20 h-20 rounded-full border-4 border-tertiary-container bg-surface-container-lowest shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>groups</span>
          </div>
          <span className="text-xs">Sinergia</span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center gap-2 group">
          <div className="w-20 h-20 rounded-full border-4 border-secondary-container bg-surface-container-lowest shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>timer</span>
          </div>
          <span className="text-xs">Cazador</span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center gap-2 group opacity-50 grayscale">
          <div className="w-20 h-20 rounded-full border-4 border-outline-variant bg-surface-container-lowest shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">military_tech</span>
          </div>
          <span className="text-xs">Bloqueado</span>
        </div>
      </div>
    </section>
  );
}

function Leaderboard() {
  // Aquí se puede mapear el leaderboard dinámicamente
  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-on-surface">Clasificación</h3>
        <span className="material-symbols-outlined text-secondary">emoji_events</span>
      </div>
      <div className="space-y-4">
        {/* Ejemplo de usuario top */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-secondary text-lg w-4">1</span>
          <div className="w-12 h-12 rounded-full border-2 border-secondary overflow-hidden flex-shrink-0">
            <img alt="Sara" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa1Ey8dl5fTJkSD_XWQWxd8ZEqBHYRBPiQoEajoS3yG6JGsKo_8DnY2AqoBbHrLJ4bYDOy6avIPoBDpF_KeaCPrZpgsgce7f8EyAkIkWXm_nSpTe2kJ7nmNXEvHfcqnbVsOZfnu07eD6BOese3E0ZLonu9V4cl60lg9e9XFpast5rNEKfmBOcCVHDofhIWiMKS6E5rZjz4D-Cj_wqFRawcBDg45mxwuFVIPjsicVxbmIlNZ1VX-5CgiltLiCFwJDsYUju1X42ijio" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">Sara</span>
              <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full text-xs">Nivel 14</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[85%] rounded-full shadow" />
            </div>
          </div>
        </div>
        {/* ...otros usuarios... */}
      </div>
    </section>
  );
}

function WeeklyQuests() {
  // Aquí se puede mapear quests dinámicamente
  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card border-l-4 border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-on-surface">Misiones semanales</h3>
        <span className="font-medium text-primary">3/12 Completadas</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-3 bg-surface-container-low rounded-xl">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
            <span className="material-symbols-outlined">local_fire_department</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Presentación de Biología</p>
            <p className="text-xs text-on-surface-variant">Vence en 2 días</p>
          </div>
          <button className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">done</span>
          </button>
        </div>
        {/* ...otros quests... */}
      </div>
    </section>
  );
}

function TeamStore() {
  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-on-surface">Tienda del equipo</h3>
        <div className="flex items-center gap-1 text-secondary font-bold">
          <span className="material-symbols-outlined text-sm">monetization_on</span>
          <span>450</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-container rounded-xl flex flex-col items-center gap-2 border border-transparent hover:border-secondary transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-secondary">coffee</span>
          </div>
          <p className="text-xs text-center">Pase de café gratis</p>
          <span className="text-xs font-bold text-secondary">200 pts</span>
        </div>
        <div className="p-3 bg-surface-container rounded-xl flex flex-col items-center gap-2 border border-transparent hover:border-secondary transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-secondary">movie</span>
          </div>
          <p className="text-xs text-center">Noche de película</p>
          <span className="text-xs font-bold text-secondary">500 pts</span>
        </div>
      </div>
    </section>
  );
}

function TeamChat() {
  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-on-surface leading-tight">Grupo de estudio</h3>
          <p className="text-xs text-on-surface-variant">4 miembros activos</p>
        </div>
        <button className="text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 hide-scrollbar">
        {/* Mensajes de ejemplo */}
        <div className="flex items-start gap-3">
          <img alt="Sara" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD0EFEpmSsu62hpej9QRsF8e5XUheWe4uxeKU1gnnXyd9OXrHfzCpRMv3yn6XhvKv-KFyry2DNI2DW-SQ4HSTbGVOQpVZLZRWAn45nwG3aDKcbPCyPta2wds3LbIkB8O6Ddc_kSsc2KbS-GLN9L6VE3jSCjz_j1m28d_Vl9UpXBfasWIvbzPo4NIZ1wQrDvaVC83lWFjIY1evWjYMx5Dy_ByvF4YbvCiekXSca00NQ3jwafbNoUuLG1vHLMyDjr9DqIdAZFi6b6s4" />
          <div className="bg-surface-container-high rounded-r-xl rounded-bl-xl p-3 max-w-[80%]">
            <p className="text-xs font-bold text-on-surface mb-1">Sara</p>
            <p className="text-sm">¿Todos terminaron la lectura de Biología?</p>
          </div>
        </div>
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="bg-primary-container text-on-primary-container rounded-l-xl rounded-br-xl p-3 max-w-[80%]">
            <p className="text-sm">¡Casi! Solo me faltan 2 páginas. 📚</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <img alt="Juan" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ClzKjSwZHGhWbm9wQWhfvNzQXqyUyKESilqAfNaaZcN0vLQXvBev946XJN-VCT_g4BGquDOux1-nnyvSJgExaCfwTm1FhAa44fEnrhTu77aLf6iu77rvqeGoMK85RrtxNG72RCEJS0w4CTA0whUtr2LxjXlnK4qJnlYHIekAPbLdEQ1cHJGd0rB5JiSLPceZeHT7WGSTA4lZRN8h6-OYbh-QDayOHlqXo4_GEeqBqv67Nee_2-oN4zcxMwr8fRDKKQHmq4HZfYg" />
          <div className="bg-surface-container-high rounded-r-xl rounded-bl-xl p-3 max-w-[80%]">
            <p className="text-xs font-bold text-on-surface mb-1">Juan</p>
            <p className="text-sm">Yo también. ¿Quedamos a las 5?</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <input className="flex-1 bg-surface-container-low border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary" placeholder="Escribe un mensaje..." type="text" />
        <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </section>
  );
}

function FloatingActionButton() {
  return (
    <button className="fixed bottom-24 right-6 w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40">
      <span className="material-symbols-outlined text-2xl">add</span>
    </button>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24">
      <TopAppBar />
      <main className="px-[20px] py-6 flex flex-col gap-6">
        <HeroWelcome />
        <Achievements />
        <Leaderboard />
        <WeeklyQuests />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TeamStore />
          <TeamChat />
        </div>
      </main>
      <FloatingActionButton />
    </div>
  );
}
