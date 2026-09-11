import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Screen } from '../components/Screen';
import { Button } from '../components/ui';
import { Icon } from '../components/icons';
import { useApp, useTimers } from '../nav/store';

export function Login() {
  const { go } = useApp();
  return (
    <Screen center bar={false}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={{ width: 84, height: 84, borderRadius: 28, background: 'var(--c-primario)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="logo" size={46} color="#fff" />
        </div>
        <div className="display" style={{ letterSpacing: '.18em', marginTop: 8 }}>PAUSA</div>
        <div className="cap">por Pacífico Seguros</div>
      </div>
      <h1 className="h2 center">Ingresa con tu cuenta Pacífico</h1>
      <form onSubmit={(e) => { e.preventDefault(); go('watch'); }}>
        <label className="field"><span>Usuario</span><input defaultValue="camila.reyes" autoComplete="username" spellCheck={false} /></label>
        <label className="field"><span>Contraseña</span><input type="password" defaultValue="pausa2026" autoComplete="current-password" /></label>
        <div className="mt-5"><Button type="submit" haptica="light">Ingresar</Button></div>
      </form>
      <p className="cap center mt-6">¿Aún no tienes PAUSA?<br /><span className="link">Contrátalo en pacifico.com.pe</span></p>
      <p className="cap center mt-4">Prototipo con datos ficticios.</p>
    </Screen>
  );
}

export function Watch() {
  const { set, goHome } = useApp();
  const later = useTimers();
  const rm = useReducedMotion();
  const [estado, setEstado] = useState<'pregunta' | 'conectando' | 'listo'>('pregunta');
  const entrar = (watch: boolean) => { set({ logged: true, watch }); goHome(); };
  const conectar = () => {
    setEstado('conectando');
    later(() => { setEstado('listo'); later(() => entrar(true), 600); }, 1400);
  };
  const titulo = estado === 'pregunta' ? '¿Quieres conectar tu reloj?' : estado === 'conectando' ? 'Conectando tu reloj…' : 'Reloj conectado';
  return (
    <Screen center bar={false}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!rm && estado !== 'listo' && (
            <motion.span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--c-acento)' }}
              animate={{ scale: [0.7, 1.1], opacity: [0.7, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />
          )}
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--c-superficie)', boxShadow: 'var(--e-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={estado === 'listo' ? 'check' : 'watch'} size={44} color={estado === 'listo' ? 'var(--c-exito)' : 'var(--c-primario)'} />
          </div>
        </div>
      </div>
      <h1 className="h1 center" aria-live="polite">{titulo}</h1>
      <p className="sub center mt-2">Si lo conectas, las alertas se afinan con tu descanso y tu ritmo. Si no, la app funciona igual.</p>
      {estado === 'pregunta' && (
        <div className="mt-6">
          <Button onClick={conectar} haptica="light">Conectar</Button>
          <Button variant="tonal" onClick={() => entrar(false)}>Ahora no</Button>
          <Button variant="text" onClick={() => entrar(false)}>No tengo</Button>
        </div>
      )}
    </Screen>
  );
}
