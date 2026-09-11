import { Screen } from '../components/Screen';
import { Avatar, Button, Chip, Fila, IconRound, ProCard, Slots } from '../components/ui';
import { Icon } from '../components/icons';
import { useApp } from '../nav/store';
import { PERSONA, PSICO, byId } from '../data/red';
import { slotTexto } from '../logic/fechas';
import { haptic } from '../platform/native';

export function Ayuda() {
  const { go } = useApp();
  const Ruta = ({ tone, icon, chip, t, s, onClick }: { tone: 'info' | 'alerta'; icon: 'chat' | 'pause'; chip: string; t: string; s: string; onClick: () => void }) => (
    <button className="card mt-3" style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 12, alignItems: 'flex-start' }} onClick={() => { void haptic('light'); onClick(); }}>
      <IconRound name={icon} tone={tone} />
      <div className="row__grow">
        <Chip kind={tone === 'info' ? 'info' : 'warn'}>{chip}</Chip>
        <div className="h2 mt-2">{t}</div>
        <div className="sub">{s}</div>
      </div>
      <Icon name="chevron" color="var(--c-texto-2)" />
    </button>
  );
  return (
    <Screen back>
      <h1 className="h1">¿Qué necesitas?</h1>
      <p className="sub">Elige la ruta que te sirva hoy</p>
      <div className="mt-3">
        <Ruta tone="info" icon="chat" chip="Psicología" t="Quiero hablar con alguien" s="Sesión con un psicólogo de la red" onClick={() => go('psico')} />
        <Ruta tone="alerta" icon="pause" chip="Medicina" t="Necesito parar unos días" s="Consulta con un médico que puede indicarte descanso" onClick={() => go('buscando')} />
      </div>
      <p className="cap center mt-6">Ninguna de las dos avisa a tu empresa todavía.</p>
    </Screen>
  );
}

export function Psico() {
  const { state, set, go } = useApp();
  const elegido = state.psico ? byId(PSICO, state.psico) : null;
  const lista = elegido ? [elegido, ...PSICO.filter((p) => p.id !== elegido.id).slice(0, 1)] : PSICO;
  const disponibles = PERSONA.sesionesAnuales - state.sesiones.length;
  const confirmar = () => {
    if (!elegido || state.psicoSlot === null) return;
    set((s) => ({ sesiones: [...s.sesiones, { proId: elegido.id, slot: elegido.slots[s.psicoSlot ?? 0] }], psico: null, psicoSlot: null }));
    go('psicoOk');
  };
  return (
    <Screen back cta={<Button disabled={!elegido || state.psicoSlot === null} onClick={confirmar} haptica="success">Confirmar sesión</Button>}>
      <h1 className="h1">Elige con quién hablar</h1>
      <p className="sub">Psicólogos de la red disponibles esta semana</p>
      <div className="mt-4">
        {lista.map((p) => (
          <ProCard key={p.id} p={p} selected={p.id === state.psico} onClick={() => set({ psico: p.id, psicoSlot: null })}
            extra={p.id === state.psico && p.nota ? <div className="cap mt-2">{p.nota}</div> : undefined} />
        ))}
      </div>
      {elegido ? (
        <>
          <h2 className="h2 mt-6">Elige un horario</h2>
          <Slots slots={elegido.slots} sel={state.psicoSlot} onSel={(i) => set({ psicoSlot: i })} />
          <p className="cap mt-3">Videollamada desde esta app, 45 minutos. Usa 1 de tus {disponibles} sesiones disponibles.</p>
        </>
      ) : <p className="cap center mt-4">Toca un profesional para ver sus horarios</p>}
    </Screen>
  );
}

export function PsicoOk() {
  const { state, goHome } = useApp();
  const ult = state.sesiones[state.sesiones.length - 1];
  const p = byId(PSICO, ult?.proId ?? PSICO[0].id);
  const slot = ult?.slot ?? p.slots[0];
  return (
    <Screen back cta={<Button variant="tonal" onClick={goHome}>Ir al inicio</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 24 }}>
        <IconRound name="check" tone="ok" />
        <h1 className="h1">Sesión agendada</h1>
      </div>
      <div className="card mt-5">
        <Chip kind="info">Psicología</Chip>
        <Fila icon={<Avatar ini={p.ini} color={p.color} />} title={p.nombre} sub={p.rol} />
        <Fila icon={<IconRound name="calendar" tone="info" />} title={slotTexto(slot)} sub="Duración estimada: 45 min" />
        <Fila icon={<IconRound name="video" tone="info" />} title="Videollamada" sub="Desde esta app" />
      </div>
      <p className="cap center mt-4">Te avisaremos 10 minutos antes. Puedes cambiarla desde Citas.</p>
    </Screen>
  );
}
