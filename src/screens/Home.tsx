import { useEffect } from 'react';
import { Screen } from '../components/Screen';
import { Button, Fila, IconRound } from '../components/ui';
import { Icon } from '../components/icons';
import { Ring, WeekBars } from '../components/Charts';
import { Sheet } from '../components/Sheet';
import { useApp, useTimers } from '../nav/store';
import { PATRON, PERSONA, RELOJ } from '../data/red';
import { rangoTexto } from '../logic/fechas';

export function Home() {
  const { state, set, go, goTab, sheetOpen, setSheetOpen } = useApp();
  const later = useTimers();
  const enPausa = state.tramiteListo && !!state.evaluacion;

  useEffect(() => {
    if (!state.alertNever && !state.alertSeen && !enPausa) {
      later(() => { set({ alertSeen: true }); setSheetOpen(true); }, 3000);
    }
    return () => setSheetOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrar = (accion: 'go' | 'later' | 'never') => {
    setSheetOpen(false);
    if (accion === 'never') set({ alertNever: true });
    if (accion === 'go') window.setTimeout(() => go('ayuda'), 200);
  };

  return (
    <Screen tabs cta={<Button onClick={() => go('ayuda')} haptica="light"><Icon name="hand" size={20} color="#fff" />Pedir ayuda</Button>}>
      <h1 className="h1">Hola, {PERSONA.nombre}</h1>
      <p className="sub">{enPausa ? 'Tu pausa está activa. Descansa.' : 'Así va tu semana de trabajo'}</p>

      <div className="estado">
        <Ring estado={enPausa ? 'pausa' : 'elevado'} dias={enPausa ? state.evaluacion!.dias : PATRON.diasSinDesconectar} />
        <div className="metrics">
          <div className="metric"><div className="metric__n"><b>{PATRON.diasSinDesconectar}</b> días</div><div className="cap">sin desconectar más de 12 h</div></div>
          <div className="metric"><div className="metric__n"><b>{PATRON.nochesTarde}</b> noches</div><div className="cap">con actividad después de las 11 pm</div></div>
          <div className="metric"><div className="metric__n"><b>{PATRON.horasSemana}</b> h</div><div className="cap">conectada esta semana</div></div>
        </div>
      </div>

      {state.watch && (
        <div className="metrics metrics--row" aria-label="Datos de tu reloj">
          <div className="metric"><div className="metric__n"><b>{RELOJ.suenoPromedioHoras.toString().replace('.', ',')}</b> h</div><div className="cap">de sueño promedio, según tu reloj</div></div>
          <div className="metric"><div className="metric__n"><b>Irregular</b></div><div className="cap">ritmo de descanso</div></div>
        </div>
      )}

      {enPausa && state.evaluacion && (
        <div className="card mt-5">
          <Fila icon={<IconRound name="pause" tone="ok" />} title={`Pausa de ${state.evaluacion.dias} días`} sub={rangoTexto(state.evaluacion.inicio, state.evaluacion.fin)} right={<Icon name="chevron" color="var(--c-texto-2)" />} onClick={() => go('proceso')} />
        </div>
      )}

      <WeekBars />

      <div className="hr" />
      <p className="cap">Medimos tu patrón de trabajo, no tu salud. <button className="link cap" style={{ color: 'var(--c-texto)' }} onClick={() => goTab('perfil')}>Tú eliges qué datos recoge PAUSA</button></p>

      <Sheet open={sheetOpen} onClose={() => cerrar('later')} label="Alerta de sobrecarga">
        <IconRound name="bell" tone="alerta" />
        <h2 className="h1" style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}>Llevas {PATRON.diasSinDesconectar} días sin desconectar más de 12 horas seguidas.</h2>
        <p className="sub" style={{ margin: '8px 0 20px' }}>¿Quieres hablar con alguien?</p>
        <Button onClick={() => cerrar('go')} haptica="light">Agendar</Button>
        <Button variant="tonal" onClick={() => cerrar('later')}>Ahora no</Button>
        <Button variant="text" onClick={() => cerrar('never')}>No mostrar más</Button>
      </Sheet>
    </Screen>
  );
}
