export const environment = {
  production: false,
  /**
   * false: {@link FakeIamRepository} (sin servidor).
   * true: {@link HttpIamRepository} → mismo origen `/api/...` (Hosting+Functions) o emulador vía proxy.
   */
  useFirebaseIam: false,
  /** Opcional; vacío = rutas relativas (recomendado en Hosting y con `proxy.conf.json`). */
  apiBaseUrl: '',
};
