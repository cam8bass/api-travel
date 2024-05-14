import { HelmetOptions } from "helmet";

export const helmetOptions: Readonly<HelmetOptions> = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Limite les ressources à celles du même origine
      baseUri: ["'self'"],
      blockAllMixedContent: [],
      fontSrc: ["'self'", "https:", "data:"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Désactive le COEP pour permettre le chargement de ressources cross-origin sans headers CORS
  crossOriginOpenerPolicy: { policy: "same-origin" }, // Isolation de l'origine pour les fenêtres ouvertes
  crossOriginResourcePolicy: { policy: "same-origin" }, // Restreint les ressources à l'origine même
  dnsPrefetchControl: { allow: false }, // Désactive le DNS prefetching
  frameguard: { action: "deny" }, // Prévient le clickjacking
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }, // Strict-Transport-Security: force la connexion HTTPS
  ieNoOpen: true, // X-Download-Options pour IE8+
  noSniff: true, // X-Content-Type-Options: empêche le MIME sniffing
  permittedCrossDomainPolicies: { permittedPolicies: "none" }, // X-Permitted-Cross-Domain-Policies
  referrerPolicy: { policy: "no-referrer" }, // Contrôle l'en-tête Referer
  xssFilter: true, // X-XSS-Protection: active le filtre XSS dans la plupart des navigateurs modernes
};