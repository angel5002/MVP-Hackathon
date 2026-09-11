import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Screen } from '../components/Screen';
import { Button, Fila, IconRound } from '../components/ui';
import { Icon } from '../components/icons';
import { Ring, WeekBars, WeekStrip } from '../components/Charts';
import { useApp, useTimers } from '../nav/store';
import { PATRON, PERSONA, RELOJ } from '../data/red';
import { rangoTexto } from '../logic/fechas';

const saludo = () => { const h = new Date().getHours(); return h < 12 ? 'buenos días' : h < 19 ? 'buenas tardes' : 'buenas noches'; };

export function Home() {
  const { state, set, go, goTab } = useApp();
  const later = useTimers();
  const rm = useReducedMotion();
  const enPausa = state.tramiteListo && !!state.evaluacion;
  const [alerta, setAlerta] = useState(state.alertSeen && !state.alertNever);

  // La alerta llega como tarjeta héroe a los 2,5 s (antes era un modal): no tapa nada y se lee de un vistazo.
  useEffect(() => {
    if (!state.alertNever && !state.alertSeen && !enPausa) later(() => { set({ alertSeen: true }); setAlerta(true); }, 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen tabs greeting titulo={`${saludo()}, ${PERSONA.nombre.toLowerCase()}.`}
      leftChip={<span className="topbar__chip" aria-label={`${PATRON.diasSinDesconectar} días seguidos con más de 12 horas`}><Icon name="clock" size={16} color="var(--c-alerta)" />{PATRON.diasSinDesconectar} d</span>}>
      <WeekStrip />

      <AnimatePresence initial={false}>
        {enPausa && state.evaluacion ? (
          <motion.section key="pausa" className="hero mt-4" initial={{ opacity: 0, y: rm ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="hero__glow" />
            <p className="eyebrow">Tu pausa activa</p>
            <div className="row" style={{ marginTop: 12, gap: 20 }}>
              <Ring estado="pausa" dias={state.evaluacion.dias} dark />
              <div className="row__grow">
                <h2 className="h1">Descansa.</h2>
                <p className="sub mt-1">{rangoTexto(state.evaluacion.inicio, state.evaluacion.fin)}</p>
              </div>
            </div>
            <div className="mt-5"><Button variant="primary" onClick={() => go('proceso')}>Ver mi proceso</Button></div>
          </motion.section>
        ) : alerta ? (
          <motion.section key="alerta" className="hero mt-4" role="status" initial={{ opacity: 0, y: rm ? 0 : 16, scale: rm ? 1 : 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: rm ? 0 : -8 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
            <div className="hero__glow" />
            <button className="iconbtn" aria-label="No mostrar más" style={{ position: 'absolute', right: 6, top: 6, color: 'rgba(255,255,255,.6)' }} onClick={() => { set({ alertNever: true }); setAlerta(false); }}><Icon name="x" size={20} /></button>
            <p className="eyebrow">Aviso de PAUSA</p>
            <h2 className="h1 mt-3">Llevas {PATRON.diasSinDesconectar} días sin desconectar más de 12 horas.</h2>
            <p className="sub mt-2">Podemos ayudarte a parar. ¿Quieres hablar con alguien hoy?</p>
            <div className="mt-5" style={{ display: 'flex', gap: 10 }}>
              <Button variant="primary" onClick={() => go('ayuda')} haptica="light">Pedir ayuda</Button>
              <Button variant="ghost-light" onClick={() => setAlerta(false)}>Ahora no</Button>
            </div>
          </motion.section>
        ) : (
          <motion.section key="estado" className="hero mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="hero__glow" />
            <p className="eyebrow">Tu ritmo esta semana</p>
            <div className="row" style={{ marginTop: 12, gap: 20 }}>
              <Ring estado="elevado" dias={PATRON.diasSinDesconectar} dark />
              <div className="row__grow">
                <h2 className="h1">Elevado.</h2>
                <p className="sub mt-1">{PATRON.horasSemana} horas conectada y {PATRON.nochesTarde} noches trabajando tarde.</p>
              </div>
            </div>
            <div className="mt-5"><Button variant="primary" onClick={() => go('ayuda')} haptica="light">Pedir ayuda</Button></div>
          </motion.section>
        )}
      </AnimatePresence>

      <p className="eyebrow mt-8">Tu semana</p>
      <div className="stats">
        <div className="stat"><div className="stat__n">{PATRON.diasSinDesconectar}<small>días</small></div><div className="stat__l">seguidos sin desconectar más de 12 h</div></div>
        <div className="stat"><div className="stat__n">{PATRON.nochesTarde}<small>noches</small></div><div className="stat__l">con actividad después de las 11 pm</div></div>
        {state.watch && (
          <>
            <div className="stat"><div className="stat__n">{RELOJ.suenoPromedioHoras.toString().replace('.', ',')}<small>h</small></div><div className="stat__l">de sueño promedio, según tu reloj</div></div>
            <div className="stat"><div className="stat__n" style={{ fontSize: '1.25rem' }}>Irregular</div><div className="stat__l">ritmo de descanso</div></div>
          </>
        )}
      </div>

      <div className="card card--xl mt-4"><WeekBars /></div>

      <p className="eyebrow mt-8">Privacidad</p>
      <div className="card mt-3" style={{ padding: '4px 16px' }}>
        <Fila icon={<IconRound name="shield" tone="info" />} title="Medimos tu patrón de trabajo, no tu salud" sub="Tú eliges qué datos recoge PAUSA" right={<Icon name="chevron" color="var(--c-texto-3)" />} onClick={() => goTab('perfil')} />
      </div>
    </Screen>
  );
}
