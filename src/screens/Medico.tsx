import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Screen } from '../components/Screen';
import { Avatar, Button, Chip, Fila, IconRound, ProCard, Slots } from '../components/ui';
import { Icon } from '../components/icons';
import { BreathLoader } from '../components/BreathLoader';
import { useApp } from '../nav/store';
import { LINEA_MINSA, MED, byId } from '../data/red';
import { fechaSlot, slotTexto } from '../logic/fechas';
import { PHQ4_ENCABEZADO, PHQ4_ITEMS, PHQ4_OPCIONES, puntuarPhq4 } from '../logic/phq4';
import { abrirExterno, haptic } from '../platform/native';
import type { SlotDef } from '../types';

export function Buscando() {
  const { replace } = useApp();
  return <BreathLoader estado="Buscando un médico de tu red" ciclos={1} onListo={() => replace('medico')} />;
}

function enCuanto(s: SlotDef) {
  if (s.offsetDias !== 0) return undefined;
  const min = Math.round((fechaSlot(s).getTime() - Date.now()) / 60000);
  if (min <= 0) return 'ya pasó, se reprograma';
  return min < 60 ? `en ${min} min` : `en ${Math.floor(min / 60)} h ${min % 60 ? (min % 60) + ' min' : ''}`.trim();
}

export function Medico() {
  const { state, set, go } = useApp();
  const m = byId(MED, state.medId);
  return (
    <Screen back cta={<Button onClick={() => { set({ citaConfirmada: true }); go('preIntro'); }} haptica="success">Confirmar cita</Button>}>
      <p className="eyebrow">Medicina</p>
      <h1 className="h1">Médico asignado</h1>
      <p className="sub">Teleconsulta por videollamada en menos de 24 horas</p>
      <div className="card mt-5">
        <ProCard p={m} selected tap={false} extra={
          <>
            <div className="cap mt-1">Colegiatura por verificar en el trámite</div>
            <button className="btn btn--text btn--left mt-2" onClick={() => set({ medOthers: !state.medOthers })}>{state.medOthers ? 'Ocultar otros médicos' : 'Ver otros médicos disponibles'}</button>
          </>
        } />
        {state.medOthers && MED.filter((x) => x.id !== m.id).map((x) => (
          <ProCard key={x.id} p={x} onClick={() => set({ medId: x.id, medSlot: 0, medOthers: false })} />
        ))}
      </div>
      <h2 className="h2 mt-6">Elige un horario</h2>
      <Slots slots={m.slots} sel={state.medSlot} onSel={(i) => set({ medSlot: i })} nota={enCuanto} />
      <p className="cap mt-3">Antes de la cita te haremos 4 preguntas breves para que {m.nombre.startsWith('Dra') ? 'la doctora' : 'el doctor'} llegue con contexto.</p>
    </Screen>
  );
}

export function PreIntro() {
  const { go, replace } = useApp();
  return (
    <Screen back cta={<Button onClick={() => go('pre')}>Empezar</Button>}>
      <p className="eyebrow">Pre-consulta</p>
      <h1 className="h1">Cuatro preguntas antes de tu cita</h1>
      <p className="sub">Toma menos de un minuto.</p>
      <div className="card mt-5">
        <Fila icon={<IconRound name="info" tone="info" />} title="Es un tamizaje, no un diagnóstico" sub="Tu médico lo revisará durante la teleconsulta." />
        <Fila icon={<IconRound name="shield" tone="info" />} title="Solo lo ve tu médico" sub="No forma parte de lo que recibe tu empleador." />
      </div>
      <p className="cap mt-4">Basado en el PHQ-4 (Kroenke et al., 2009), en su traducción al español para el Perú.</p>
      <div className="mt-4"><Button variant="text" onClick={() => replace('cita')}>Responder después</Button></div>
    </Screen>
  );
}

export function Pre() {
  const { set, replace } = useApp();
  const rm = useReducedMotion();
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<number[]>([]);
  const elegir = (v: number) => {
    void haptic('light');
    const r = [...resp.slice(0, paso), v];
    setResp(r);
    if (paso === 3) { set({ preConsulta: r }); replace('preResultado'); return; }
    window.setTimeout(() => setPaso(paso + 1), rm ? 0 : 160);
  };
  return (
    <Screen back>
      <p className="eyebrow">Pregunta {paso + 1} de 4</p>
      <div className="progress" aria-hidden="true"><motion.div className="progress__bar" animate={{ scaleX: (paso + 1) / 4 }} initial={false} transition={{ duration: rm ? 0 : 0.28 }} /></div>
      <p className="sub mt-5">{PHQ4_ENCABEZADO}</p>
      <motion.h1 key={paso} className="h1 mt-3" initial={{ opacity: 0, x: rm ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>{PHQ4_ITEMS[paso]}</motion.h1>
      <div className="mt-5" role="radiogroup" aria-label={PHQ4_ITEMS[paso]}>
        {PHQ4_OPCIONES.map((o, i) => (
          <button key={o} role="radio" aria-checked={resp[paso] === i} className={`btn ${resp[paso] === i ? 'btn--primary' : 'btn--tonal'}`} style={{ justifyContent: 'flex-start', marginTop: 8 }} onClick={() => elegir(i)}>{o}</button>
        ))}
      </div>
      {paso > 0 && <div className="mt-4"><Button variant="text" onClick={() => setPaso(paso - 1)}>Pregunta anterior</Button></div>}
    </Screen>
  );
}

export function PreResultado() {
  const { state, replace, go } = useApp();
  const r = puntuarPhq4(state.preConsulta ?? [0, 0, 0, 0]);
  const nivel = { normal: 'sin señales relevantes', leve: 'señales leves', moderado: 'señales moderadas', grave: 'señales importantes' }[r.nivel];
  return (
    <Screen back={false} cta={<Button onClick={() => replace('cita')}>Continuar</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 24 }}>
        <IconRound name="check" tone="ok" />
        <h1 className="h1">Listo, gracias</h1>
        <p className="sub mt-2">Tu tamizaje muestra {nivel}. Lo revisará tu médico en la teleconsulta. No es un diagnóstico.</p>
      </div>
      {r.alto && (
        <div className="card mt-6">
          <Chip kind="warn">Si lo necesitas ahora</Chip>
          <h2 className="h2 mt-3">Puedes hablar con alguien hoy mismo</h2>
          <p className="sub mt-1">La {LINEA_MINSA.texto} del Ministerio de Salud es gratuita y atiende las 24 horas.</p>
          <div className="mt-4">
            <Button variant="alerta" onClick={() => void abrirExterno(LINEA_MINSA.tel)}><Icon name="phone" size={20} color="#fff" />Llamar al {LINEA_MINSA.numero}, opción {LINEA_MINSA.opcion}</Button>
            <Button variant="tonal" onClick={() => go('psico')}>Agendar psicología hoy</Button>
          </div>
        </div>
      )}
    </Screen>
  );
}

export function Cita() {
  const { state, set, go, goHome } = useApp();
  const m = byId(MED, state.medId);
  const slot = m.slots[state.medSlot];
  return (
    <Screen back={false} cta={<Button variant="tonal" onClick={goHome}>Ir al inicio</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 24 }}>
        <IconRound name="check" tone="ok" />
        <h1 className="h1">Cita confirmada</h1>
      </div>
      <div className="card mt-5">
        <Chip kind="warn">Medicina</Chip>
        <Fila icon={<Avatar ini={m.ini} color={m.color} />} title={m.nombre} sub={`${m.rol}, ${m.cmp}`} />
        <Fila icon={<IconRound name="calendar" tone="info" />} title={slotTexto(slot)} sub="Teleconsulta de 20 minutos" />
        <Fila icon={<IconRound name="video" tone="info" />} title="Videollamada" sub="Desde esta app; te avisaremos 10 minutos antes" />
      </div>
      {!state.preConsulta && (
        <div className="mt-4"><Button variant="outline" onClick={() => go('pre')}>Responder la pre-consulta</Button></div>
      )}
      <div className="card mt-5">
        <div className="label">Demo: tu cita aún no llega</div>
        <p className="cap mt-1">En el prototipo no esperamos a la hora real. Este control adelanta el reloj de forma honesta.</p>
        <div className="mt-3"><Button onClick={() => { set({ horaLlego: true }); go('sala'); }} haptica="light">Simular que llegó la hora de tu cita</Button></div>
      </div>
    </Screen>
  );
}
