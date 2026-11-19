'use strict';

const sessionKey = 'panda-catalogo.session';
const form = document.getElementById('login');
const button = document.getElementById('entrar');
const buttonLabel = button.querySelector('span');
const statusMessage = document.getElementById('loginEstado');
const params = new URLSearchParams(location.search);

function mensaje(texto, error = false) {
  statusMessage.hidden = false;
  statusMessage.textContent = texto;
  statusMessage.className = error ? 'alert alert-danger' : 'alert alert-secondary';
}

function abrirPanel() {
  const volver = params.get('volver') ?? '';
  const ruta = volver.split(/[?#]/, 1)[0];
  const destino = /^\/productos(?:\/(?:nuevo|\d+(?:\/editar)?))?$/.test(ruta)
    ? volver
    : '/productos';
  location.replace('/gestion-catalogo' + destino);
}

if (params.get('motivo') === 'sesion' || params.has('expired')) {
  mensaje('Tu sesión terminó. Inicia sesión de nuevo para continuar.');
} else if (params.has('logout')) {
  mensaje('Cerraste sesión correctamente.');
} else if (params.has('error')) {
  mensaje('Usuario o contraseña incorrectos.', true);
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;

  const datos = Object.fromEntries(new FormData(form));
  datos.username = datos.username.trim();
  button.disabled = true;
  buttonLabel.textContent = 'Iniciando sesión…';
  form.setAttribute('aria-busy', 'true');
  statusMessage.hidden = true;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const session = await response.json().catch(() => null);
    if (!response.ok) {
      mensaje(response.status === 401
        ? 'Usuario o contraseña incorrectos.'
        : session?.errors?.join('\n') || 'No se pudo iniciar sesión. Inténtalo de nuevo.', true);
      return;
    }

    const { accessToken, expiresIn, username, roles } = session;
    sessionStorage.setItem(sessionKey, JSON.stringify({
      accessToken, expiresAt: Date.now() + expiresIn * 1000, username, roles,
    }));
    document.getElementById('clave').value = '';
    abrirPanel();
  } catch {
    mensaje('No se pudo iniciar sesión. Inténtalo de nuevo.', true);
  } finally {
    button.disabled = false;
    buttonLabel.textContent = 'Iniciar sesión';
    form.removeAttribute('aria-busy');
  }
});

async function revisarSesion() {
  const guardada = sessionStorage.getItem(sessionKey);
  if (!guardada) return;

  try {
    const { accessToken, expiresAt } = JSON.parse(guardada);
    if (typeof accessToken !== 'string' || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      sessionStorage.removeItem(sessionKey);
      return;
    }

    const response = await fetch('/api/auth/me', {
      credentials: 'omit',
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    if (button.disabled || sessionStorage.getItem(sessionKey) !== guardada) return;
    if (response.ok) abrirPanel();
    else if (response.status === 401 || response.status === 403) sessionStorage.removeItem(sessionKey);
  } catch (error) {
    if (error instanceof SyntaxError && sessionStorage.getItem(sessionKey) === guardada) {
      sessionStorage.removeItem(sessionKey);
    }
  }
}

void revisarSesion();
