package pe.pausa.hackathon;

import android.os.Build;
import android.os.Bundle;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * La app dibuja de borde a borde. La barra de navegación del sistema (los tres botones o la pastilla
 * de gestos) se oculta en modo inmersivo: reaparece de forma transitoria al deslizar desde el borde
 * inferior y se vuelve a esconder sola. Además se desactiva la franja opaca que Android pinta detrás
 * de los tres botones, para que el fondo de la app llegue hasta abajo.
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        WindowCompat.setDecorFitsSystemWindows(w, false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            w.setNavigationBarContrastEnforced(false);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        ocultarBarraNavegacion();
        // El plugin SystemBars de Capacitor vuelve a mostrar las barras en su carga (en un runnable
        // encolado al hilo principal); este post se ejecuta después y deja la barra oculta.
        getWindow().getDecorView().post(this::ocultarBarraNavegacion);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) ocultarBarraNavegacion();
    }

    private void ocultarBarraNavegacion() {
        Window w = getWindow();
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(w, w.getDecorView());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        c.hide(WindowInsetsCompat.Type.navigationBars());
    }
}
