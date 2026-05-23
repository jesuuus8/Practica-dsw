import React from "react";

function ProgressBar({ percent }) {
  return (
    <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div
        className="h-full bg-primary progress-glow rounded-full transition-all duration-700 ease-out"
        style={{ width: percent + "%" }}
      ></div>
    </div>
  );
}

function QuestCard({ icon, colorClass, badge, title, desc, xp, extra, buttonIcon, buttonColor, onClick }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group border-2 border-transparent hover:border-primary/10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center`}>
          <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <span className={badge.className}>{badge.text}</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-4">{desc} • <span className="text-secondary font-bold">+{xp} XP</span></p>
      <div className="flex items-center justify-between mt-6">
        {extra}
        <button className={`${buttonColor} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform`} onClick={onClick}>
          <span className="material-symbols-outlined">{buttonIcon}</span>
        </button>
      </div>
    </div>
  );
}

export default function MisionesSemanales() {
  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-body-md">
      {/* TopAppBar */}
      <header className="bg-surface shadow-sm flex justify-between items-center w-full px-[20px] py-2 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed shadow-sm">
            <img alt="Perfil de usuario" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8" />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-extrabold text-primary">TaskQuest</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>
      <main className="px-[20px] max-w-[1200px] mx-auto mt-6">
        {/* Header Section */}
        <section className="mb-6">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Misiones Semanales</h2>
          <p className="font-body-md text-body-md text-on-surface-variant italic opacity-80">"¡Cada tarea es un paso más hacia tu mejor versión!"</p>
        </section>
        {/* Weekly Progress Card */}
        <section className="bg-surface-container-lowest rounded-lg p-6 mb-6 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-label-lg text-label-lg text-primary block mb-1">Progreso Actual</span>
              <span className="font-headline-md text-headline-md text-on-surface">3/12 Completadas</span>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-label-sm text-on-surface-variant">25%</span>
            </div>
          </div>
          <ProgressBar percent={25} />
        </section>
        {/* Filters */}
        <nav className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap shadow-sm">Activas</button>
          <button className="bg-surface-container text-on-surface-variant px-6 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap hover:bg-surface-container-high transition-colors">Completadas</button>
          <button className="bg-surface-container text-on-surface-variant px-6 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap hover:bg-surface-container-high transition-colors">Expiradas</button>
        </nav>
        {/* Quests Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuestCard
            icon="menu_book"
            colorClass="bg-tertiary-container/20 text-tertiary"
            badge={{ className: "bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-sm text-label-sm", text: "Alta Prioridad" }}
            title="Presentación de Biología"
            desc="Vence en 2 días"
            xp={150}
            extra={
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-[10px] text-white flex items-center justify-center font-bold">+3</div>
              </div>
            }
            buttonIcon="check_circle"
            buttonColor="bg-primary text-on-primary"
          />
          <QuestCard
            icon="fitness_center"
            colorClass="bg-secondary-container/20 text-secondary"
            badge={{ className: "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm", text: "Salud" }}
            title="Entrenamiento Cardio"
            desc="Vence en 4 días"
            xp={100}
            extra={<div className="bg-secondary-fixed/30 text-on-secondary-fixed-variant px-3 py-1 rounded-lg font-label-sm">Progreso: 1/3</div>}
            buttonIcon="add"
            buttonColor="bg-primary text-on-primary"
          />
          <QuestCard
            icon="groups"
            colorClass="bg-primary-container/10 text-primary"
            badge={{ className: "bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm", text: "Social" }}
            title="Revisión de Proyecto"
            desc="Vence en 5 días"
            xp={200}
            extra={<div className="flex items-center gap-2"><span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span><span className="font-label-sm text-on-surface-variant">15:00 PM</span></div>}
            buttonIcon="chevron_right"
            buttonColor="bg-primary text-on-primary"
          />
          <QuestCard
            icon="palette"
            colorClass="bg-secondary-fixed/40 text-on-secondary-container"
            badge={{ className: "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm", text: "Opcional" }}
            title="Sketch de Arquitectura"
            desc="Vence en 1 día"
            xp={50}
            extra={<span className="text-error font-label-lg italic">¡Última oportunidad!</span>}
            buttonIcon="check_circle"
            buttonColor="bg-primary text-on-primary"
          />
        </section>
      </main>
      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-lowest shadow rounded-t-lg">
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1.5 hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
          <span className="font-label-sm text-label-sm">Hub</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-3 py-1.5 transition-transform active:scale-90 duration-200" href="#">
          <span className="material-symbols-outlined" data-icon="assignment" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
          <span className="font-label-sm text-label-sm">Quests</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1.5 hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
          <span className="font-label-sm text-label-sm">Progreso</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1.5 hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined" data-icon="groups">groups</span>
          <span className="font-label-sm text-label-sm">Equipos</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1.5 hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
          <span className="font-label-sm text-label-sm">Ajustes</span>
        </a>
      </nav>
      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined !text-3xl">add</span>
      </button>
    </div>
  );
}
