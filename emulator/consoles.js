(function () {
  'use strict';
  const CONSOLES = {
    sega: {
      id: 'sega',
      title: 'Sega Genesis',
      subtitle: 'Mega Drive Emulator',
      emoji: '🎮',
      // EmulatorJS core: genesis_plus_gx.
      ejsCore: 'segaMD',
      fileAccept: '.md,.bin,.gen,.smd,.zip,.7z',
      fileExtsLabel: '.md / .bin / .gen',
      accentHex: '#e94560',
      accentGoldHex: '#c2410c',
      iaBaseUrl: 'https://archive.org/download/sega-genesis-romset-ultra-usa',
      iaThumbnailSystems: ['Sega - Mega Drive - Genesis'],
      iaDescriptionPrefix: 'Classic Sega Genesis game',
      romHelp:
        'Bring your own .md / .bin / .gen dump, or browse the collection and choose Play in browser. If that is slow, use Download instead and load the saved file here.',
      controls: [
        { label: 'D-Pad', key: 'Arrow keys' },
        { label: 'A button', key: 'Z' },
        { label: 'B button', key: 'X' },
        { label: 'C button', key: 'C' },
        { label: 'X button', key: 'A' },
        { label: 'Y button', key: 'S' },
        { label: 'Z button', key: 'D' },
        { label: 'Start', key: 'Enter' },
        { label: 'Save state', key: 'F5' },
        { label: 'Load state', key: 'F9' }
      ]
    }
  };

  /**
   * Path landers: /emulator/nes/, /emulator/sega/, …
   * Legacy query: /emulator/?console=nes (rewritten to the path form).
   */
  function getConsoleIdFromPathname(pathname) {
    const parts = String(pathname || '')
      .replace(/\/+$/, '')
      .split('/')
      .filter(Boolean);
    if (parts[0] !== 'emulator' || !parts[1]) return null;
    const id = parts[1].toLowerCase();
    return CONSOLES[id] ? id : null;
  }

  function getConsoleIdFromSearch(search) {
    const params = new URLSearchParams(search || '');
    const requested = (params.get('console') || '').toLowerCase();
    return CONSOLES[requested] ? requested : null;
  }

  // Prefer path landers; fall back to ?console= for old bookmarks / embeds.
  function getConsoleId() {
    return (
      getConsoleIdFromPathname(window.location.pathname) ||
      getConsoleIdFromSearch(window.location.search)
    );
  }

  /** Canonical deep-link path for a console id (`nes` → `/emulator/nes/`). */
  function emulatorConsolePath(id) {
    return `/emulator/${id}/`;
  }

  /**
   * On the hub (`/emulator/`) with `?console=<id>`, replace with the
   * path lander so sitemap/canonical and the live URL match. Preserves
   * other query params (`rom`, `tv`, …) and the hash.
   * @returns {boolean} true if a navigation was started
   */
  function canonicalizeEmulatorConsoleUrl() {
    if (getConsoleIdFromPathname(window.location.pathname)) return false;
    const id = getConsoleIdFromSearch(window.location.search);
    if (!id) return false;
    const norm = String(window.location.pathname || '/')
      .replace(/\/+$/, '')
      .replace(/\/index\.html$/i, '');
    if (norm !== '/emulator') return false;

    const params = new URLSearchParams(window.location.search);
    params.delete('console');
    const qs = params.toString();
    const dest = emulatorConsolePath(id) + (qs ? `?${qs}` : '') + (window.location.hash || '');
    window.location.replace(dest);
    return true;
  }

  window.EMULATOR_CONSOLES = CONSOLES;
  window.getEmulatorConsole = function getEmulatorConsole() {
    const id = getConsoleId();
    return id ? CONSOLES[id] : null;
  };
  window.getEmulatorConsoleId = getConsoleId;
  window.getEmulatorConsoleIdFromPathname = getConsoleIdFromPathname;
  window.emulatorConsolePath = emulatorConsolePath;
  window.canonicalizeEmulatorConsoleUrl = canonicalizeEmulatorConsoleUrl;
})();
