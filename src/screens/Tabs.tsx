import { Screen } from '../components/Screen';
import { Avatar, Button, Chip, Fila, IconRound, Toggle } from '../components/ui';
import { Icon } from '../components/icons';
import { useApp } from '../nav/store';
import { MED, PERSONA, PSICO, byId } from '../data/red';
import { slotTexto, rangoCorto } from '../logic/fechas';
import { useDescarga } from '../components/Viewer';

export function Citas() {
  const { state, set, go } = useApp();
  const m = byId(MED, state.medId);
  const slot = m.slots[state.medSlot];
  const puedeSimular = state.citaConfirmada && !state.consultaHecha;
  return (
    <Screen tabs cta={<Button onClick={() => go('ayuda')}>Agendar una sesión</Button>}>
      <h1 className="h1">Tus citas</h1>
      <p className="sub">Sesiones y consultas de tu red</p>

      <h2 className="eyebrow mt-6">Próximas</h2>
      {!state.citaConfirmada && state.sesiones.length === 0 && !state.tramiteListo && (
        <p className="sub mt-2">Aún no tienes citas. Agenda una sesión o pide una consulta médica.</p>
      )}
      {state.citaConfirmada && (
        <Fila icon={<Avatar ini={m.ini} color={m.color} />} title={m.nombre} sub={`${slotTexto(slot)}, teleconsulta`}
          right={state.consultaHecha ? <Chip kind="ok">Realizada</Chip> : <Chip kind="warn">Confirmada</Chip>} />
      )}
      {puedeSimular && (
        <div className="card mt-3">
          <div className="label">Demo: tu cita aún no llega</div>
          <p className="cap mt-1">En el prototipo no esperamos a la hora real. Este control adelanta el reloj de forma honesta.</p>
          <div className="mt-3">
            <Button variant="tonal" onClick={() => { set({ horaLlego: true }); go(state.preConsulta ? 'sala' : 'preIntro'); }}>Simular que llegó la hora de tu cita</Button>
          </div>
        </div>
      )}
      {state.sesiones.map((s, i) => {
        const p = byId(PSICO, s.proId);
        return <Fila key={i} icon={<Avatar ini={p.ini} color={p.color} />} title={p.nombre} sub={`${slotTexto(s.slot)}, videollamada`} right={<Chip kind="info">Sesión</Chip>} />;
      })}
      {state.tramiteListo && state.sesiones.length === 0 && (
        <Fila icon={<Avatar ini={PSICO[0].ini} color={PSICO[0].color} />} title={PSICO[0].nombre} sub={`${slotTexto(PSICO[0].slots[0])}, acompañamiento`} right={<Chip kind="ok">Incluida</Chip>} />
      )}

      <h2 className="eyebrow mt-6">Anteriores</h2>
      <Fila icon={<Avatar ini="AT" color="blue" />} title="Lic. Andrea Torres" sub="Sesión completada hace 3 semanas" right={<Chip kind="line">Psicología</Chip>} />
    </Screen>
  );
}

export function Docs() {
  const { state, go, setViewerDoc } = useApp();
  const { descargar } = useDescarga();
  const m = byId(MED, state.evaluacion?.medicoId ?? state.medId);
  if (!state.tramiteListo || !state.evaluacion) {
    return (
      <Screen tabs>
        <h1 className="h1">Documentos</h1>
        <p className="sub">Lo que la red médica genera por ti</p>
        <div className="mt-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <IconRound name="doc" tone="info" />
          <h2 className="h2">Aún no hay documentos</h2>
          <p className="sub mt-2">Cuando termine el trámite de tu certificado, aparecerá aquí listo para descargar y enviar.</p>
        </div>
      </Screen>
    );
  }
  const ev = state.evaluacion;
  const acts = (k: 'cert' | 'aviso') => (
    <span style={{ display: 'flex' }}>
      <button className="iconbtn" aria-label="Ver" onClick={() => setViewerDoc(k)}><Icon name="eye" /></button>
      <button className="iconbtn" aria-label="Descargar" onClick={() => void descargar(k)}><Icon name="download" /></button>
    </span>
  );
  return (
    <Screen tabs>
      <h1 className="h1">Documentos</h1>
      <p className="sub">Lo que la red médica generó por ti</p>
      <h2 className="eyebrow mt-6">Emitidos</h2>
      <div className="card mt-2">
        <Fila icon={<IconRound name="doc" tone="info" />} title="Certificado médico" sub={`${ev.dias} días, ${rangoCorto(ev.inicio, ev.fin)}`} right={acts('cert')} />
        <Fila icon={<IconRound name="mail" tone="info" />} title="Aviso de ausencia" sub="Para tu jefe directo, sin diagnóstico" right={acts('aviso')} />
      </div>
      <h2 className="eyebrow mt-6">Enviar</h2>
      <div className="card mt-2">
        <Fila icon={<IconRound name="mail" tone="ok" />} title="Avisar a tu empleador" sub="Primero verás exactamente qué recibirá" right={<Icon name="chevron" color="var(--c-texto-2)" />} onClick={() => go('empleador')} />
      </div>
      <h2 className="eyebrow mt-6">Verificación</h2>
      <Fila icon={<IconRound name="check" tone="ok" />} title="Colegiatura verificada" sub={`${m.cmp}, registro público del CMP (simulación)`} />
    </Screen>
  );
}

export function Perfil() {
  const { state, set, reset } = useApp();
  return (
    <Screen tabs right="none" cta={<Button variant="outline" onClick={reset}>Cerrar sesión</Button>}>
      <div className="row">
        <Avatar ini={PERSONA.iniciales} color="blue" size="xl" />
        <div><h1 className="h1">{PERSONA.nombreCompleto}</h1><p className="sub">{PERSONA.cargo}, {PERSONA.edad} años</p></div>
      </div>
      <h2 className="eyebrow mt-6">Tu cobertura</h2>
      <Fila icon={<IconRound name="shield" tone="ok" />} title={PERSONA.plan} sub={`${PERSONA.primaMensual} al mes, asegurada desde ${PERSONA.planDesde}`} right={<Chip kind="ok">Activa</Chip>} />
      <Fila icon={<IconRound name="chat" tone="info" />} title={`${PERSONA.sesionesAnuales - state.sesiones.length} de ${PERSONA.sesionesAnuales} sesiones disponibles`} sub="Psicología por videollamada, al año" />

      <h2 className="eyebrow mt-6">Tú eliges qué datos recoge PAUSA</h2>
      <p className="cap mt-1">Esto controla lo que la app mide. Lo que ve tu empleador lo decides al enviar el certificado.</p>
      <div className="card mt-3" style={{ padding: '4px 16px' }}>
        <Fila title="Reloj conectado" sub="Sueño y ritmo de descanso" right={<Toggle on={state.watch} onChange={(v) => set({ watch: v })} label="Reloj conectado" />} />
        <Fila title="Horario de conexión" sub="Horas y noches de actividad" right={<Toggle on={state.toggles.hours} onChange={(v) => set({ toggles: { ...state.toggles, hours: v } })} label="Horario de conexión" />} />
        <Fila title="Ubicación" sub="Para sugerirte profesionales cercanos" right={<Toggle on={state.toggles.geo} onChange={(v) => set({ toggles: { ...state.toggles, geo: v } })} label="Ubicación" />} />
      </div>

      <h2 className="eyebrow mt-6">Preferencias</h2>
      <div className="card mt-3" style={{ padding: '4px 16px' }}>
        <Fila title="Vibración en la respiración" sub="Un toque suave al inhalar y al exhalar" right={<Toggle on={state.haptica} onChange={(v) => set({ haptica: v })} label="Vibración en la respiración" />} />
      </div>
      <p className="cap mt-4">Datos simulados. Profesionales y colegiaturas son ficticios.</p>
    </Screen>
  );
}
