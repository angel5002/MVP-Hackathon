import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Screen } from '../components/Screen';
import { Button } from '../components/ui';
import { Icon } from '../components/icons';
import { Bird } from '../components/Bird';
import { useApp, useTimers } from '../nav/store';

export function Login() {
  const { go } = useApp();
  const rm = useReducedMotion();
  return (
    <Screen bar={false}>
      {/* Portada clara, al estilo de la introducción de stoic.: texto centrado y el pájaro abajo a la izquierda */}
      <section className="intro" aria-label="Bienvenida">
        <motion.div className="intro__text" initial={{ opacity: 0, y: rm ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
          <Icon name="logo" size={28} color="var(--c-acento)" className="intro__logo" />
          <h1 className="intro__h">hola, soy PAUSA.<br />tu compañía para<br />parar a tiempo.</h1>
          <p className="cap mt-3">por Pacífico Seguros</p>
        </motion.div>
        <motion.div className="intro__bird" initial={{ opacity: 0, x: rm ? 0 : -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}>
          <Bird size={150} />
        </motion.div>
      </section>

      <h2 className="h2 mt-6">Ingresa con tu cuenta Pacífico</h2>
      <form onSubmit={(e) => { e.preventDefault(); go('watch'); }}>
        <label className="field"><span>Usuario</span><input defaultValue="camila.reyes" autoComplete="username" spellCheck={false} /></label>
        <label className="field"><span>Contraseña</span><input type="password" defaultValue="pausa2026" autoComplete="current-password" /></label>
        <div className="mt-5"><Button type="submit" haptica="light">Ingresar</Button></div>
      </form>
      <p className="cap center mt-5">¿Aún no tienes PAUSA? <span className="link">Contrátalo en pacifico.com.pe</span></p>
      <p className="cap center mt-2" style={{ color: 'var(--c-texto-3)' }}>Prototipo con datos ficticios.</p>
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
            <Icon name={estado === 'listo' ? 'check' : 'watch'} size={44} color={estado === 'listo' ? 'var(--c-exito)' : 'var(--c-acento-fuerte)'} />
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
