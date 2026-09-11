import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Screen } from '../components/Screen';
import { Avatar, Button, Chip, Fila, IconRound } from '../components/ui';
import { Icon } from '../components/icons';
import { BreathLoader } from '../components/BreathLoader';
import { CalendarStrip } from '../components/Charts';
import { Sheet } from '../components/Sheet';
import { useApp, useTimers } from '../nav/store';
import { CIE10, LIMITE_DIAS_ANIO, MED, PATRON, RELOJ, byId } from '../data/red';
import { evaluarDescanso } from '../logic/evaluarDescanso';
import { puntuarPhq4 } from '../logic/phq4';
import { fechaSlot, fmtLargo, horaDe, rangoTexto, capital } from '../logic/fechas';
import { haptic } from '../platform/native';

export function Sala() {
  const { state, replace } = useApp();
  const m = byId(MED, state.medId);
  const quien = m.nombre.startsWith('Dra') ? 'La doctora' : 'El doctor';
  return (
    <BreathLoader estado={`Sala de espera. ${quien} se conectará en breve`} ciclos={state.presenter.unCiclo ? 1 : 3} contador
      salida={<Button variant="surface" onClick={() => replace('tele')} haptica="medium"><Icon name="video" size={20} />{quien} está en línea. Entrar</Button>} />
  );
}

export function Tele() {
  const { state, set, replace, sheetOpen, setSheetOpen } = useApp();
  const later = useTimers();
  const m = byId(MED, state.medId);
  const [seg, setSeg] = useState(0);
  const [fase, setFase] = useState(0);
  const rapido = state.presenter.unCiclo;
  useEffect(() => {
    const t = window.setInterval(() => setSeg((s) => s + 1), 1000);
    later(() => setFase(1), rapido ? 2000 : 5000);
    later(() => setFase(2), rapido ? 4000 : 10000);
    return () => window.clearInterval(t);
  }, [later, rapido]);

  const finalizar = () => {
    const r = puntuarPhq4(state.preConsulta ?? [0, 0, 0, 0]);
    const ev = evaluarDescanso({
      phq4Total: r.total, patron: PATRON, reloj: state.watch ? RELOJ : null, medico: m,
      fechaConsulta: fechaSlot(m.slots[state.medSlot]), forzarDias: state.presenter.forzarDias,
    });
    set({ consultaHecha: true, evaluacion: ev });
    setSheetOpen(false);
    replace('evaluacion');
  };
  const mm = String(Math.floor(seg / 60)).padStart(2, '0'), ss = String(seg % 60).padStart(2, '0');
  const textos = ['Conectando el video…', `${m.nombre} está revisando tu tamizaje y tu patrón de trabajo.`, 'La consulta va terminando. Recibirás tu indicación por escrito.'];
  return (
    <Screen bar={false} className="screen--tele" cta={
      fase >= 2 ? <Button variant="alerta" onClick={() => setSheetOpen(true)}><Icon name="phone" size={20} color="#fff" />Finalizar consulta</Button>
        : <Button variant="tonal" disabled>Consulta en curso · {mm}:{ss}</Button>}>
      <p className="eyebrow">Teleconsulta simulada</p>
      <h1 className="h1">{m.nombre}</h1>
      <p className="sub">{m.rol}, {m.cmp}</p>
      <div className="video mt-4" style={{ minHeight: 320 }} role="img" aria-label="Videollamada simulada">
        <Avatar ini={m.ini} color={m.color} size="xl" />
        <div className="label" style={{ color: '#fff' }}>{mm}:{ss}</div>
        <motion.p key={fase} className="cap" style={{ color: 'rgba(255,255,255,.85)', maxWidth: 260, textAlign: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>{textos[fase]}</motion.p>
        <div className="video__self" aria-hidden="true">Tú</div>
      </div>
      <p className="cap mt-3">Prototipo: la videollamada no es real. Ningún dato sale de tu teléfono.</p>
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} label="Finalizar consulta">
        <h2 className="h2">¿Terminar la teleconsulta?</h2>
        <p className="sub" style={{ margin: '8px 0 20px' }}>Recibirás la indicación médica por escrito en la siguiente pantalla.</p>
        <Button variant="alerta" onClick={finalizar} haptica="success">Sí, terminar</Button>
        <Button variant="tonal" onClick={() => setSheetOpen(false)}>Seguir en la consulta</Button>
      </Sheet>
    </Screen>
  );
}

export function Evaluacion() {
  const { state, go, sheetOpen, setSheetOpen, toast } = useApp();
  const ev = state.evaluacion!;
  const m = byId(MED, ev.medicoId);
  const acumulados = state.presenter.diasPrevios + ev.dias;
  const supera = acumulados > LIMITE_DIAS_ANIO;
  const apellido = m.nombre.split(' ').slice(-2, -1)[0] ?? m.nombre;
  const trato = m.nombre.startsWith('Dra') ? 'la Dra.' : 'el Dr.';
  return (
    <Screen back={false} cta={<Button onClick={() => go('emitiendo')} haptica="light">Ver mi certificado</Button>}>
      <p className="eyebrow">Evaluación médica</p>
      <h1 className="h1">Tu indicación de pausa</h1>
      <Fila icon={<Avatar ini={m.ini} color={m.color} />} title={m.nombre} sub={`${m.rol}, ${m.cmp}`} />
      <div className="display mt-4" aria-live="polite">{ev.dias} días</div>
      <p className="sub">{rangoTexto(ev.inicio, ev.fin)}</p>
      <CalendarStrip inicio={ev.inicio} dias={ev.dias} />
      <p className="cap mt-2">Te reincorporas el {fmtLargo(ev.reincorporacion)}.</p>
      <blockquote className="mt-5" style={{ margin: '20px 0 0', paddingLeft: 16, borderLeft: '3px solid var(--c-acento)' }}>
        <p>“{capital(ev.fundamento)}”</p>
        <p className="cap mt-1">Indicación de {trato} {apellido}</p>
      </blockquote>
      <div className="hr" />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div><div className="label">Días de descanso en el año</div><div className="cap">{supera ? `Superas los ${LIMITE_DIAS_ANIO}: el certificado se valida ante EsSalud y se canjea por el CITT en 30 días hábiles` : `Hasta ${LIMITE_DIAS_ANIO} se justifican con certificado particular`}</div></div>
        <div className="h2" style={{ whiteSpace: 'nowrap', color: supera ? 'var(--c-alerta)' : 'var(--c-texto)' }}>{acumulados} <span className="cap">de {LIMITE_DIAS_ANIO}</span></div>
      </div>
      <div className="mt-4"><Button variant="outline" onClick={() => setSheetOpen(true)}>Tengo una duda sobre mi indicación</Button></div>
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} label="Mensaje al médico">
        <h2 className="h2">Mensaje para {m.nombre}</h2>
        <p className="sub" style={{ margin: '8px 0 12px' }}>Responde por este canal en menos de 24 horas.</p>
        <label className="field" style={{ marginTop: 0 }}><span>Tu duda</span><input defaultValue="Hola, tengo una duda sobre los días indicados." /></label>
        <div className="mt-4">
          <Button onClick={() => { setSheetOpen(false); toast(`Mensaje enviado a ${m.nombre}`); void haptic('success'); }}>Enviar</Button>
          <Button variant="tonal" onClick={() => setSheetOpen(false)}>Cancelar</Button>
        </div>
      </Sheet>
    </Screen>
  );
}

export function Emitiendo() {
  const { set, replace } = useApp();
  return <BreathLoader estado="Emitiendo tu certificado" ciclos={1} onListo={() => { set({ certEmitido: true }); replace('cert'); }} />;
}

export function Cert() {
  const { state, go, setViewerDoc } = useApp();
  const rm = useReducedMotion();
  const ev = state.evaluacion!;
  const m = byId(MED, ev.medicoId);
  const consulta = fechaSlot(m.slots[state.medSlot]);
  const acumulados = state.presenter.diasPrevios + ev.dias;
  const supera = acumulados > LIMITE_DIAS_ANIO;
  return (
    <Screen back={false} cta={<Button onClick={() => go('tramite')} haptica="light">Iniciar el trámite</Button>}>
      <div className="row">
        <motion.div initial={{ scale: rm ? 1 : 0.6, opacity: rm ? 1 : 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}><IconRound name="check" tone="ok" /></motion.div>
        <div><h1 className="h1">Certificado emitido</h1><p className="sub">Tras tu teleconsulta de hoy, {horaDe(consulta)}</p></div>
      </div>
      <div className="card mt-4">
        <Fila icon={<Avatar ini={m.ini} color={m.color} />} title={m.nombre} sub={`${m.cmp}, ${m.rol}`} />
        <Fila icon={<IconRound name="doc" tone="info" />} title={`${CIE10.codigo}, ${CIE10.titulo}`} sub="Diagnóstico CIE-10 indicado por tu médico" />
        <Fila icon={<IconRound name="calendar" tone="info" />} title={`${ev.dias} días de descanso`} sub={rangoTexto(ev.inicio, ev.fin)} />
        <Fila icon={<IconRound name="eye" tone="info" />} title="Vista previa del certificado" sub="Se descarga al terminar el trámite" right={<Icon name="chevron" color="var(--c-texto-2)" />} onClick={() => setViewerDoc('cert')} />
      </div>
      <h2 className="eyebrow mt-6">Días de descanso acumulados en el año</h2>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="cap row__grow">Los primeros {LIMITE_DIAS_ANIO} días del año se justifican con certificado particular. Pasado ese umbral, el certificado debe validarse ante EsSalud y canjearse por el CITT dentro de 30 días hábiles.</div>
        <div className="h2" style={{ whiteSpace: 'nowrap', color: supera ? 'var(--c-alerta)' : 'var(--c-texto)' }}>{acumulados} <span className="cap">de {LIMITE_DIAS_ANIO}</span></div>
      </div>
      {supera && (
        <div className="card mt-3">
          <Chip kind="warn">Superas los {LIMITE_DIAS_ANIO} días</Chip>
          <p className="sub mt-2">PAUSA prepara el expediente de canje por el CITT y te avisa el plazo. Lo verás como un paso más del trámite.</p>
        </div>
      )}
    </Screen>
  );
}
