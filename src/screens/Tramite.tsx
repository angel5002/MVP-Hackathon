import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Screen } from '../components/Screen';
import { Avatar, Button, Chip, Fila, IconRound } from '../components/ui';
import { Icon } from '../components/icons';
import { useApp, useTimers } from '../nav/store';
import { LIMITE_DIAS_ANIO, MED, PERSONA, PSICO, byId } from '../data/red';
import { rangoTexto, slotTexto } from '../logic/fechas';
import { construirCorreo, urlCorreo } from '../logic/mail';
import { abrirExterno, haptic } from '../platform/native';
import { useDescarga } from '../components/Viewer';
import type { Destinatario } from '../types';

export function Tramite() {
  const { state, set, replace } = useApp();
  const later = useTimers();
  const rm = useReducedMotion();
  const m = byId(MED, state.evaluacion?.medicoId ?? state.medId);
  const supera = state.presenter.diasPrevios + (state.evaluacion?.dias ?? 0) > LIMITE_DIAS_ANIO;
  const pasos = [
    ['Teleconsulta realizada', `${m.nombre}, hoy`],
    ['Certificado emitido y recibido', 'Guardado en Documentos'],
    ['Colegiatura verificada', `${m.cmp}, registro público del CMP`],
    ...(supera ? [['Expediente de canje por CITT preparado', 'Plazo: 30 días hábiles ante EsSalud']] : []),
    ['Documento listo para tu empleador', 'Sin diagnóstico en el aviso'],
  ];
  const [hechos, setHechos] = useState(0);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    pasos.forEach((_, i) => later(() => { setHechos(i + 1); void haptic(i === pasos.length - 1 ? 'success' : 'light'); }, 500 + i * 800));
    later(() => { setListo(true); set({ tramiteListo: true }); }, 500 + pasos.length * 800 + 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Screen back={false} center cta={listo ? <Button onClick={() => replace('proceso')} haptica="light">Ver mi proceso</Button> : undefined}>
      <Chip kind={listo ? 'ok' : 'info'}>{listo ? 'Listo' : 'En proceso'}</Chip>
      <h1 className="h1 mt-3">{listo ? 'Todo quedó gestionado' : 'Estamos gestionando todo'}</h1>
      <div className="progress" aria-hidden="true"><motion.div className="progress__bar" initial={{ scaleX: 0 }} animate={{ scaleX: hechos / pasos.length }} transition={{ duration: rm ? 0 : 0.6, ease: [0.2, 0.8, 0.2, 1] }} /></div>
      <ol className="steps" style={{ listStyle: 'none', padding: 0 }} aria-live="polite">
        {pasos.map(([t, s], i) => (
          <motion.li key={t} className={`step ${i < hechos ? 'step--on' : ''}`} initial={{ opacity: rm ? 1 : 0.35 }} animate={{ opacity: i < hechos ? 1 : 0.35 }} transition={{ duration: 0.3 }}>
            <span className="step__ck">{i < hechos && <Icon name="check" size={16} color="#fff" stroke={3} />}</span>
            <span><span className="label">{t}</span><br /><span className="cap">{s}</span></span>
          </motion.li>
        ))}
      </ol>
      {listo && <p className="sub mt-6">Solo te queda presentarlo. Nosotros hicimos el resto.</p>}
    </Screen>
  );
}

export function Proceso() {
  const { state, go, goHome, setViewerDoc } = useApp();
  const { descargar } = useDescarga();
  const ev = state.evaluacion!;
  const acumulados = state.presenter.diasPrevios + ev.dias;
  const prox = state.sesiones[0];
  const p = byId(PSICO, prox?.proId ?? PSICO[0].id);
  return (
    <Screen back cta={<Button variant="tonal" onClick={goHome}>Volver al inicio</Button>}>
      <p className="eyebrow">Tu pausa</p>
      <div className="display">{ev.dias} días</div>
      <p className="sub">{rangoTexto(ev.inicio, ev.fin)}</p>
      <div className="metrics metrics--row">
        <div className="metric"><div className="metric__n"><b>{acumulados}</b> de {LIMITE_DIAS_ANIO}</div><div className="cap">días de descanso este año</div></div>
        <div className="metric"><div className="metric__n"><b>{PERSONA.sesionesAnuales - state.sesiones.length}</b> de {PERSONA.sesionesAnuales}</div><div className="cap">sesiones de psicología disponibles</div></div>
      </div>
      <h2 className="eyebrow mt-6">Próxima sesión</h2>
      <Fila icon={<Avatar ini={p.ini} color={p.color} />} title={p.nombre} sub={`${slotTexto(prox?.slot ?? p.slots[0])}, videollamada${prox ? '' : '. Incluida en tu pausa, no usa tus sesiones'}`} right={prox ? <Chip kind="info">Sesión</Chip> : <Chip kind="ok">Incluida</Chip>} />
      <h2 className="eyebrow mt-6">Para tu empleador</h2>
      <div className="card mt-2">
        <Fila icon={<IconRound name="doc" tone="info" />} title="Certificado médico" sub="Listo para descargar" right={
          <span style={{ display: 'flex' }}>
            <button className="iconbtn" aria-label="Ver" onClick={() => setViewerDoc('cert')}><Icon name="eye" /></button>
            <button className="iconbtn" aria-label="Descargar" onClick={() => void descargar('cert')}><Icon name="download" /></button>
          </span>} />
        <Fila icon={<IconRound name="mail" tone="ok" />} title="Avisar a tu empleador" sub="Primero verás exactamente qué recibirá" right={<Icon name="chevron" color="var(--c-texto-2)" />} onClick={() => go('empleador')} />
      </div>
    </Screen>
  );
}

export function Empleador() {
  const { state, set, go } = useApp();
  const [ok, setOk] = useState(false);
  const c = construirCorreo(state);
  const dest = state.correoDest;
  const setDest = (d: Destinatario) => { void haptic('light'); set({ correoDest: d }); setOk(false); };
  return (
    <Screen back cta={<Button disabled={!ok} onClick={() => go('correo')} haptica="light">Continuar</Button>}>
      <p className="eyebrow">Antes de enviar</p>
      <h1 className="h1">Tu empleador verá esto</h1>
      <p className="sub">Elige a quién escribes. El diagnóstico nunca va en el texto: solo dentro del certificado que recibe Recursos Humanos.</p>
      <div className="slots mt-4" style={{ gridTemplateColumns: '1fr 1fr' }} role="radiogroup" aria-label="Destinatario">
        <button role="radio" aria-checked={dest === 'jefe'} className={`slot ${dest === 'jefe' ? 'slot--sel' : ''}`} onClick={() => setDest('jefe')}><b>Jefe directo</b><small>Aviso sin diagnóstico</small></button>
        <button role="radio" aria-checked={dest === 'rrhh'} className={`slot ${dest === 'rrhh' ? 'slot--sel' : ''}`} onClick={() => setDest('rrhh')}><b>Recursos Humanos</b><small>Certificado adjunto</small></button>
      </div>
      {dest === 'jefe' ? (
        <>
          <label className="field"><span>Nombre de tu jefe o jefa</span><input value={state.jefeNombre} placeholder="Nombre" onChange={(e) => set({ jefeNombre: e.target.value })} /></label>
          <label className="field"><span>Correo</span><input value={state.correoJefe} inputMode="email" onChange={(e) => set({ correoJefe: e.target.value })} /></label>
        </>
      ) : (
        <label className="field"><span>Correo de Recursos Humanos</span><input value={state.correoRrhh} inputMode="email" onChange={(e) => set({ correoRrhh: e.target.value })} /></label>
      )}
      <div className="card mt-5" aria-label="Vista previa del correo">
        <div className="cap">Para: {c.to || '—'}</div>
        <div className="label mt-2">{c.asunto}</div>
        <p className="mt-3" style={{ whiteSpace: 'pre-line', font: 'var(--t-caption)', color: 'var(--c-texto)' }}>{c.cuerpo}</p>
        <div className="hr" style={{ margin: '12px 0' }} />
        <Fila icon={<IconRound name="doc" tone="info" />} title={c.adjunto === 'cert' ? 'Adjunto: certificado médico' : 'Adjunto: aviso de ausencia'} sub={c.adjunto === 'cert' ? 'Incluye el diagnóstico CIE-10, como exige el certificado' : 'No incluye diagnóstico ni datos clínicos'} />
      </div>
      <button className="row row--tap mt-4" role="checkbox" aria-checked={ok} onClick={() => { void haptic('light'); setOk(!ok); }}>
        <span className={`step__ck ${ok ? '' : ''}`} style={{ background: ok ? 'var(--c-exito)' : 'var(--crema-300)' }}>{ok && <Icon name="check" size={16} color="#fff" stroke={3} />}</span>
        <span className="label row__grow">Entiendo qué recibirá {dest === 'jefe' ? 'mi jefe directo' : 'Recursos Humanos'} y quiero continuar</span>
      </button>
    </Screen>
  );
}

export function Correo() {
  const { state, toast } = useApp();
  const { descargar } = useDescarga();
  const c = construirCorreo(state);
  const enviar = async (via: 'gmail' | 'outlook' | 'otro') => {
    void haptic('light');
    const ok = await abrirExterno(urlCorreo(via, c));
    toast(ok ? 'Abriendo tu correo…' : 'No se encontró una app de correo');
  };
  return (
    <Screen back>
      <h1 className="h1">Enviar el correo</h1>
      <p className="sub">Se abre tu app de correo con el texto listo. Adjunta el archivo que descargues aquí.</p>
      <div className="card mt-5">
        <div className="cap">Para: {c.to}</div>
        <div className="label mt-2">{c.asunto}</div>
        <p className="mt-3" style={{ whiteSpace: 'pre-line', font: 'var(--t-caption)', color: 'var(--c-texto)' }}>{c.cuerpo}</p>
      </div>
      <h2 className="eyebrow mt-6">1. Descarga el adjunto</h2>
      <div className="mt-2"><Button variant="outline" onClick={() => void descargar(c.adjunto)}><Icon name="download" size={20} />{c.adjunto === 'cert' ? 'Certificado médico (PNG)' : 'Aviso de ausencia (PNG)'}</Button></div>
      <h2 className="eyebrow mt-6">2. Abre tu correo</h2>
      <div className="mt-2">
        <Button onClick={() => void enviar('gmail')}>Gmail</Button>
        <Button variant="tonal" onClick={() => void enviar('outlook')}>Outlook</Button>
        <Button variant="tonal" onClick={() => void enviar('otro')}>Otra app de correo</Button>
      </div>
      <p className="cap mt-4">En el teléfono se abre fuera de PAUSA, en tu app de correo o en el navegador.</p>
    </Screen>
  );
}
