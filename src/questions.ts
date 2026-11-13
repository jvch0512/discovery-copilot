import type { L, Measure } from "./types.js";

const l = (en: string, es: string): L => ({ en, es });

export interface MeasureBank { questions: L[]; redFlag: L; demo: { title: L; show: L } }

/** Three open discovery questions per NIS2 Art. 21(2) measure, a red-flag answer and a vendor-neutral demo beat. */
export const BANK: Record<Measure, MeasureBank> = {
  a: {
    questions: [
      l("When was your last formal cyber risk assessment, and who signed off the results?", "¿Cuándo fue su última evaluación formal de riesgos de ciberseguridad y quién aprobó los resultados?"),
      l("Which systems did the assessment cover, and which were left out?", "¿Qué sistemas cubrió la evaluación y cuáles quedaron fuera?"),
      l("How do risk findings turn into funded actions with an owner and a date?", "¿Cómo se convierten los hallazgos de riesgo en acciones con presupuesto, responsable y fecha?"),
    ],
    redFlag: l("The last assessment was for an audit and nobody owns the follow-up.", "La última evaluación fue para una auditoría y nadie gestiona el seguimiento."),
    demo: { title: l("Risk register tied to actions", "Registro de riesgos ligado a acciones"), show: l("A live risk register where each finding has an owner, a due date and a status the board can read.", "Un registro de riesgos vivo donde cada hallazgo tiene responsable, fecha y un estado que la dirección puede leer.") },
  },
  b: {
    questions: [
      l("Walk me through the last real incident: who found it, how long to contain it, what did you learn?", "Cuénteme el último incidente real: quién lo detectó, cuánto tardaron en contenerlo y qué aprendieron."),
      l("If a significant incident started tonight, who decides it is reportable and who files the notification?", "Si esta noche empezara un incidente significativo, ¿quién decide que es notificable y quién presenta la notificación?"),
      l("Do you have a 24/7 detection and response capability, in house or outsourced?", "¿Disponen de capacidad de detección y respuesta 24x7, interna o externalizada?"),
    ],
    redFlag: l("Nobody can name who files the notification, or detection stops outside office hours.", "Nadie sabe quién presenta la notificación, o la detección se detiene fuera del horario de oficina."),
    demo: { title: l("Detection to notification in one timeline", "De la detección a la notificación en una línea de tiempo"), show: l("An incident timeline that starts the 24 and 72 hour clocks and drafts the early warning for review.", "Una línea de tiempo del incidente que arranca los relojes de 24 y 72 horas y prepara el borrador de la alerta temprana.") },
  },
  c: {
    questions: [
      l("When did you last restore a critical system from backup, end to end, and how long did it take?", "¿Cuándo restauró por última vez un sistema crítico desde copia de seguridad, de principio a fin, y cuánto tardó?"),
      l("Are backups isolated from the domain so ransomware cannot encrypt them?", "¿Las copias de seguridad están aisladas del dominio para que el ransomware no pueda cifrarlas?"),
      l("Is there a crisis plan the management has rehearsed, with decisions and contacts written down?", "¿Existe un plan de crisis que la dirección haya ensayado, con decisiones y contactos por escrito?"),
    ],
    redFlag: l("Backups were never test-restored, or sit on the same domain as production.", "Las copias nunca se probaron o están en el mismo dominio que producción."),
    demo: { title: l("Recovery proof", "Prueba de recuperación"), show: l("A restore test report with measured recovery time against the target, and immutable backup status.", "Un informe de prueba de restauración con el tiempo de recuperación medido frente al objetivo y el estado de copias inmutables.") },
  },
  d: {
    questions: [
      l("Which suppliers could stop your service or expose your data, and how do you know?", "¿Qué proveedores podrían detener su servicio o exponer sus datos y cómo lo sabe?"),
      l("What security clauses and audit rights do your critical contracts contain?", "¿Qué cláusulas de seguridad y derechos de auditoría contienen sus contratos críticos?"),
      l("How do you hear about a security problem at a supplier, and how fast?", "¿Cómo se entera de un problema de seguridad en un proveedor y con qué rapidez?"),
    ],
    redFlag: l("There is no supplier inventory ranked by criticality.", "No hay inventario de proveedores ordenado por criticidad."),
    demo: { title: l("Supplier exposure view", "Vista de exposición de proveedores"), show: l("A ranked supplier list with evidence collected, open gaps and contract clause coverage.", "Una lista de proveedores ordenada con evidencias recogidas, brechas abiertas y cobertura de cláusulas contractuales.") },
  },
  e: {
    questions: [
      l("How long does a critical vulnerability stay open on internet-facing systems?", "¿Cuánto tiempo permanece abierta una vulnerabilidad crítica en sistemas expuestos a internet?"),
      l("Do you know your full internet-facing footprint, including forgotten hosts and shadow IT?", "¿Conoce toda su superficie expuesta a internet, incluidos equipos olvidados y TI en la sombra?"),
      l("Is security part of how you buy and build software, such as reviews and dependency checks?", "¿La seguridad forma parte de cómo compra y desarrolla software, por ejemplo con revisiones y control de dependencias?"),
    ],
    redFlag: l("Patching is by calendar, not by exposure, and the asset list is a spreadsheet nobody trusts.", "El parcheo es por calendario, no por exposición, y el inventario es una hoja de cálculo en la que nadie confía."),
    demo: { title: l("Exposure to fix, ranked", "De la exposición a la corrección, priorizada"), show: l("An external scan turned into a ranked fix list with time-to-fix tracked against a target.", "Un escaneo externo convertido en lista de correcciones priorizada con el tiempo de resolución medido frente a un objetivo.") },
  },
  f: {
    questions: [
      l("How do you know your controls work? What was the last test, and what did it find?", "¿Cómo sabe que sus controles funcionan? ¿Cuál fue la última prueba y qué encontró?"),
      l("Do you run exercises or penetration tests, and who sees the results?", "¿Realizan ejercicios o pruebas de intrusión y quién ve los resultados?"),
      l("Which metrics does management receive, and how often?", "¿Qué métricas recibe la dirección y con qué frecuencia?"),
    ],
    redFlag: l("The only evidence is a certificate and an annual audit.", "La única evidencia es un certificado y una auditoría anual."),
    demo: { title: l("Control effectiveness evidence", "Evidencia de eficacia de controles"), show: l("A dashboard of control test results and trend that doubles as audit evidence.", "Un panel de resultados de pruebas de controles y su tendencia que sirve también como evidencia de auditoría.") },
  },
  g: {
    questions: [
      l("What training do staff and the management body get, and how do you measure it works?", "¿Qué formación reciben el personal y el órgano de dirección y cómo mide que funciona?"),
      l("What share of staff fell for the last phishing exercise, and what changed after?", "¿Qué proporción del personal cayó en el último ejercicio de phishing y qué cambió después?"),
      l("Are updates, endpoint protection and email filtering enforced everywhere, including contractors?", "¿Las actualizaciones, la protección de endpoints y el filtrado de correo se aplican en todas partes, incluidos los externos?"),
    ],
    redFlag: l("Training is a yearly video with no measurement and leadership is exempt.", "La formación es un vídeo anual sin medición y la dirección queda exenta."),
    demo: { title: l("Awareness with measurable change", "Concienciación con cambio medible"), show: l("Phishing exercise results by team with the trend after targeted training.", "Resultados del ejercicio de phishing por equipo con la tendencia tras formación dirigida.") },
  },
  h: {
    questions: [
      l("Which data is encrypted at rest and in transit, and who manages the keys?", "¿Qué datos están cifrados en reposo y en tránsito y quién gestiona las claves?"),
      l("Is there a cryptography policy that covers algorithms, certificates and key rotation?", "¿Existe una política de criptografía que cubra algoritmos, certificados y rotación de claves?"),
      l("How do you find expired or weak certificates before they cause an outage?", "¿Cómo detectan certificados caducados o débiles antes de que causen una caída?"),
    ],
    redFlag: l("Certificates are tracked in someone's calendar and laptops are not encrypted.", "Los certificados se controlan en el calendario de alguien y los portátiles no están cifrados."),
    demo: { title: l("Certificate and key hygiene", "Higiene de certificados y claves"), show: l("An inventory of certificates and protocols with expiry and weak settings flagged.", "Un inventario de certificados y protocolos con caducidades y configuraciones débiles señaladas.") },
  },
  i: {
    questions: [
      l("How fast is access removed when someone leaves or changes role?", "¿Con qué rapidez se retira el acceso cuando alguien se va o cambia de puesto?"),
      l("Who reviews privileged accounts, and when was the last review?", "¿Quién revisa las cuentas privilegiadas y cuándo fue la última revisión?"),
      l("Do you have a trusted inventory of assets and owners?", "¿Disponen de un inventario fiable de activos y responsables?"),
    ],
    redFlag: l("Former employees still hold active accounts, or admin rights have no owner.", "Antiguos empleados conservan cuentas activas o los derechos de administración no tienen responsable."),
    demo: { title: l("Access that cleans itself", "Accesos que se depuran solos"), show: l("A privileged access review with stale accounts flagged and removal approved in one flow.", "Una revisión de accesos privilegiados con cuentas obsoletas señaladas y retirada aprobada en un solo flujo.") },
  },
  j: {
    questions: [
      l("Where is multi-factor authentication enforced, and where is it still missing?", "¿Dónde se exige autenticación multifactor y dónde todavía falta?"),
      l("Is remote access, email and every admin account covered?", "¿Están cubiertos el acceso remoto, el correo y todas las cuentas de administración?"),
      l("How do staff communicate securely during an incident if email is compromised?", "¿Cómo se comunica el personal de forma segura durante un incidente si el correo está comprometido?"),
    ],
    redFlag: l("MFA is optional, or admin accounts are exempt.", "El MFA es opcional o las cuentas de administración están exentas."),
    demo: { title: l("MFA coverage map", "Mapa de cobertura de MFA"), show: l("Coverage by system and account type with the exceptions listed and a plan to close them.", "Cobertura por sistema y tipo de cuenta con las excepciones listadas y un plan para cerrarlas.") },
  },
};

export interface RegQuestion { id: string; when: string; text: L; why: L }

/** Framework-specific questions. `when` is a condition key evaluated in plan.ts. */
export const REG_QUESTIONS: RegQuestion[] = [
  { id: "reg-n-1", when: "nis2", text: l("Has the management body approved the cybersecurity measures and received training?", "¿Ha aprobado el órgano de dirección las medidas de ciberseguridad y ha recibido formación?"), why: l("NIS2 Art. 20 makes management accountable and liable.", "El art. 20 de NIS2 hace responsable a la dirección.") },
  { id: "reg-n-2", when: "nis2", text: l("Do you know whether you must register with the competent authority, and have you?", "¿Sabe si debe registrarse ante la autoridad competente y lo ha hecho?"), why: l("Registration duties depend on national law.", "Las obligaciones de registro dependen de la ley nacional.") },
  { id: "reg-n-3", when: "nis2", text: l("Can you produce an early warning within 24 hours with the information the authority expects?", "¿Puede producir una alerta temprana en 24 horas con la información que espera la autoridad?"), why: l("The first deadline is the one teams miss.", "El primer plazo es el que los equipos incumplen.") },
  { id: "reg-n-4", when: "nis2-out", text: l("Do customers send you security questionnaires or add NIS2 clauses to contracts?", "¿Sus clientes le envían cuestionarios de seguridad o añaden cláusulas de NIS2 a los contratos?"), why: l("Out of scope does not mean out of reach: the supply chain carries the duty.", "Estar fuera del ámbito no significa estar fuera de alcance: la cadena de suministro traslada el deber.") },
  { id: "reg-d-1", when: "dora", text: l("Is your register of information on ICT third-party arrangements complete and current?", "¿Está completo y actualizado su registro de información de acuerdos con terceros TIC?"), why: l("It is a DORA duty and a frequent first gap.", "Es un deber de DORA y una primera brecha frecuente.") },
  { id: "reg-d-2", when: "dora", text: l("How do you classify an incident as major, and who reports it to the supervisor?", "¿Cómo clasifica un incidente como grave y quién lo notifica al supervisor?"), why: l("DORA has its own classification and reporting stages.", "DORA tiene su propia clasificación y fases de notificación.") },
  { id: "reg-d-3", when: "dora", text: l("What resilience testing do you run, and is advanced testing expected for you?", "¿Qué pruebas de resiliencia realiza y se espera para usted alguna prueba avanzada?"), why: l("Testing duties scale with the entity.", "Los deberes de pruebas escalan con la entidad.") },
  { id: "reg-d-4", when: "dora-ict", text: l("Have your financial customers asked for DORA contract clauses, and can you meet them?", "¿Le han pedido sus clientes financieros cláusulas contractuales de DORA y puede cumplirlas?"), why: l("Contracts are how DORA reaches ICT providers.", "Los contratos son la vía por la que DORA llega a los proveedores TIC.") },
  { id: "reg-e-1", when: "ens", text: l("Which ENS category do your systems fall under, and how is conformity shown today?", "¿En qué categoría del ENS caen sus sistemas y cómo se acredita hoy la conformidad?"), why: l("Public tenders ask for proof of conformity.", "Las licitaciones públicas piden prueba de conformidad.") },
  { id: "reg-g-1", when: "gdpr", text: l("What is your process to decide, within hours, whether a breach must go to the data protection authority?", "¿Cuál es su proceso para decidir, en horas, si una violación debe notificarse a la autoridad de protección de datos?"), why: l("The 72 hour GDPR clock runs beside any NIS2 clock.", "El reloj de 72 horas del RGPD corre junto a cualquier reloj de NIS2.") },
  { id: "reg-g-2", when: "gdpr", text: l("Who is your data protection officer, and do they sit in the incident response loop?", "¿Quién es su delegado de protección de datos y participa en la respuesta a incidentes?"), why: l("Incident and privacy decisions must meet quickly.", "Las decisiones de incidentes y privacidad deben coincidir con rapidez.") },
];

export const COMMERCIAL: { id: string; text: L; why: L }[] = [
  { id: "com-1", text: l("What made this a priority now: an audit, a customer, an incident, the board?", "¿Qué lo ha convertido en prioridad ahora: una auditoría, un cliente, un incidente, el consejo?"), why: l("The trigger sets the urgency and the champion.", "El detonante marca la urgencia y quién lo impulsa.") },
  { id: "com-2", text: l("Who owns the budget, and who else must agree?", "¿Quién tiene el presupuesto y quién más debe estar de acuerdo?"), why: l("Maps the buying group early.", "Identifica pronto al grupo de compra.") },
  { id: "com-3", text: l("Which date matters, and what happens if it is missed?", "¿Qué fecha importa y qué pasa si no se cumple?"), why: l("A real deadline separates projects from wishes.", "Un plazo real distingue proyectos de deseos.") },
  { id: "com-4", text: l("What do you use today for your biggest gap, and why is it not enough?", "¿Qué usa hoy para su mayor brecha y por qué no es suficiente?"), why: l("Surfaces the incumbent and the switching cost.", "Descubre el proveedor actual y el coste de cambio.") },
  { id: "com-5", text: l("How will you judge success after 90 days?", "¿Cómo juzgará el éxito a los 90 días?"), why: l("Turns the demo into measurable outcomes.", "Convierte la demo en resultados medibles.") },
];
