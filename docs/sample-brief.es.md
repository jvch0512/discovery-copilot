# Informe de discovery: Nube Gestionada Iberia (managed service provider)

## Ámbito regulatorio

- **NIS2**: entidad importante. Entidad importante: empresa mediana en un sector del Anexo I.
- **DORA**: revisar. DORA le alcanza de forma indirecta: presta servicios TIC a entidades financieras.
- **ENS**: aplica. El ENS aplica a los sistemas que dan soporte a servicios que presta al sector público español.
- **GDPR**: aplica. El RGPD aplica: se tratan datos personales.

  - Tamaño: medium (plantilla 64, facturación 9 MEUR, balance 6 MEUR).
  - Una cifra está a menos de un 15 por ciento de un umbral de tamaño. Confirme los datos exactos.
  - Sanción administrativa máxima: 7 millones de euros o el 1,4 por ciento de la facturación mundial anual, lo que sea mayor (Art. 34).
  - España no había completado la transposición de NIS2 en la última revisión. El anteproyecto de Ley de Coordinación y Gobernanza de la Ciberseguridad (aprobado por el Consejo de Ministros el 14 de enero de 2025) seguía en tramitación, por lo que el Real Decreto-ley 12/2018 (la norma de NIS1) sigue siendo la norma vinculante. El anteproyecto es la mejor guía de lo que viene. Compruebe el BOE antes de citar fechas.
  - DORA: Sus clientes financieros deben incluir disposiciones contractuales de DORA en sus contratos TIC: espere cláusulas de niveles de servicio, apoyo en incidentes, auditoría y salida.
  - DORA: Las Autoridades Europeas de Supervisión pueden designar proveedores TIC críticos para supervisión directa. Pregunte si es plausible en su caso.
  - ENS: El Real Decreto 311/2022 establece el Esquema Nacional de Seguridad con tres categorías de sistemas (básica, media, alta) y conformidad por certificación o autoevaluación según la categoría.
  - ENS: Los clientes públicos pedirán prueba de conformidad en las licitaciones. Pregunte qué categoría implica su contrato.
  - GDPR: El art. 32 exige seguridad adecuada. El art. 33 exige notificar a la autoridad de control una violación de datos personales en 72 horas cuando sea posible, salvo que sea improbable que entrañe riesgo para las personas.
  - GDPR: Un incidente puede activar dos relojes: NIS2 y RGPD corren de forma independiente.

Deberes de NIS2 para anclar la conversación:
- Art. 20: el órgano de dirección aprueba las medidas de gestión de riesgos, las supervisa, puede ser responsable y debe formarse.
- Art. 21(2): diez medidas mínimas de gestión de riesgos, desde el análisis de riesgos hasta la autenticación multifactor.
- Art. 23: alerta temprana en 24 horas, notificación del incidente en 72 horas e informe final un mes después de la notificación.

## Ranking de brechas (NIS2 art. 21(2))

| # | Medida | Madurez | Puntuación |
|---|---|---|---|
| 1 | 21(2)(c) Continuidad de negocio, copias de seguridad y gestión de crisis | ninguna | 3.9 |
| 2 | 21(2)(d) Seguridad de la cadena de suministro | ninguna | 3.3 |
| 3 | 21(2)(f) Evaluación de la eficacia de las medidas | ninguna | 2.4 |
| 4 | 21(2)(b) Gestión de incidentes | parcial | 1.95 |
| 5 | 21(2)(i) Seguridad de recursos humanos, control de acceso y gestión de activos | parcial | 1.65 |
| 6 | 21(2)(a) Análisis de riesgos y políticas de seguridad de los sistemas de información | parcial | 1.5 |
| 7 | 21(2)(e) Seguridad en adquisición, desarrollo y mantenimiento, incluida la gestión de vulnerabilidades | parcial | 1.5 |
| 8 | 21(2)(g) Ciberhigiene básica y formación | parcial | 1.35 |
| 9 | 21(2)(h) Criptografía y cifrado | parcial | 1.05 |
| 10 | 21(2)(j) Autenticación multifactor y comunicaciones seguras | sólida | 0.39 |

## Preguntas de discovery

### Regulatorio

- [ ] ¿Ha aprobado el órgano de dirección las medidas de ciberseguridad y ha recibido formación?
  - Por qué: El art. 20 de NIS2 hace responsable a la dirección.
- [ ] ¿Sabe si debe registrarse ante la autoridad competente y lo ha hecho?
  - Por qué: Las obligaciones de registro dependen de la ley nacional.
- [ ] ¿Puede producir una alerta temprana en 24 horas con la información que espera la autoridad?
  - Por qué: El primer plazo es el que los equipos incumplen.
- [ ] ¿Le han pedido sus clientes financieros cláusulas contractuales de DORA y puede cumplirlas?
  - Por qué: Los contratos son la vía por la que DORA llega a los proveedores TIC.
- [ ] ¿En qué categoría del ENS caen sus sistemas y cómo se acredita hoy la conformidad?
  - Por qué: Las licitaciones públicas piden prueba de conformidad.
- [ ] ¿Cuál es su proceso para decidir, en horas, si una violación debe notificarse a la autoridad de protección de datos?
  - Por qué: El reloj de 72 horas del RGPD corre junto a cualquier reloj de NIS2.
- [ ] ¿Quién es su delegado de protección de datos y participa en la respuesta a incidentes?
  - Por qué: Las decisiones de incidentes y privacidad deben coincidir con rapidez.

### Brechas principales

- [ ] ¿Cuándo restauró por última vez un sistema crítico desde copia de seguridad, de principio a fin, y cuánto tardó?
  - Por qué: NIS2 Art. 21(2)(c): Continuidad de negocio, copias de seguridad y gestión de crisis.
  - Señal de alarma: Las copias nunca se probaron o están en el mismo dominio que producción.
- [ ] ¿Las copias de seguridad están aisladas del dominio para que el ransomware no pueda cifrarlas?
  - Por qué: NIS2 Art. 21(2)(c): Continuidad de negocio, copias de seguridad y gestión de crisis.
- [ ] ¿Existe un plan de crisis que la dirección haya ensayado, con decisiones y contactos por escrito?
  - Por qué: NIS2 Art. 21(2)(c): Continuidad de negocio, copias de seguridad y gestión de crisis.
- [ ] ¿Qué proveedores podrían detener su servicio o exponer sus datos y cómo lo sabe?
  - Por qué: NIS2 Art. 21(2)(d): Seguridad de la cadena de suministro.
  - Señal de alarma: No hay inventario de proveedores ordenado por criticidad.
- [ ] ¿Qué cláusulas de seguridad y derechos de auditoría contienen sus contratos críticos?
  - Por qué: NIS2 Art. 21(2)(d): Seguridad de la cadena de suministro.
- [ ] ¿Cómo se entera de un problema de seguridad en un proveedor y con qué rapidez?
  - Por qué: NIS2 Art. 21(2)(d): Seguridad de la cadena de suministro.
- [ ] ¿Cómo sabe que sus controles funcionan? ¿Cuál fue la última prueba y qué encontró?
  - Por qué: NIS2 Art. 21(2)(f): Evaluación de la eficacia de las medidas.
  - Señal de alarma: La única evidencia es un certificado y una auditoría anual.
- [ ] ¿Realizan ejercicios o pruebas de intrusión y quién ve los resultados?
  - Por qué: NIS2 Art. 21(2)(f): Evaluación de la eficacia de las medidas.
- [ ] ¿Qué métricas recibe la dirección y con qué frecuencia?
  - Por qué: NIS2 Art. 21(2)(f): Evaluación de la eficacia de las medidas.

### Validar el resto

- [ ] Cuénteme el último incidente real: quién lo detectó, cuánto tardaron en contenerlo y qué aprendieron.
  - Por qué: NIS2 Art. 21(2)(b): Gestión de incidentes.
  - Señal de alarma: Nadie sabe quién presenta la notificación, o la detección se detiene fuera del horario de oficina.
- [ ] ¿Con qué rapidez se retira el acceso cuando alguien se va o cambia de puesto?
  - Por qué: NIS2 Art. 21(2)(i): Seguridad de recursos humanos, control de acceso y gestión de activos.
  - Señal de alarma: Antiguos empleados conservan cuentas activas o los derechos de administración no tienen responsable.
- [ ] ¿Cuándo fue su última evaluación formal de riesgos de ciberseguridad y quién aprobó los resultados?
  - Por qué: NIS2 Art. 21(2)(a): Análisis de riesgos y políticas de seguridad de los sistemas de información.
  - Señal de alarma: La última evaluación fue para una auditoría y nadie gestiona el seguimiento.
- [ ] ¿Cuánto tiempo permanece abierta una vulnerabilidad crítica en sistemas expuestos a internet?
  - Por qué: NIS2 Art. 21(2)(e): Seguridad en adquisición, desarrollo y mantenimiento, incluida la gestión de vulnerabilidades.
  - Señal de alarma: El parcheo es por calendario, no por exposición, y el inventario es una hoja de cálculo en la que nadie confía.
- [ ] ¿Qué formación reciben el personal y el órgano de dirección y cómo mide que funciona?
  - Por qué: NIS2 Art. 21(2)(g): Ciberhigiene básica y formación.
  - Señal de alarma: La formación es un vídeo anual sin medición y la dirección queda exenta.
- [ ] ¿Qué datos están cifrados en reposo y en tránsito y quién gestiona las claves?
  - Por qué: NIS2 Art. 21(2)(h): Criptografía y cifrado.
  - Señal de alarma: Los certificados se controlan en el calendario de alguien y los portátiles no están cifrados.
- [ ] ¿Dónde se exige autenticación multifactor y dónde todavía falta?
  - Por qué: NIS2 Art. 21(2)(j): Autenticación multifactor y comunicaciones seguras.
  - Señal de alarma: El MFA es opcional o las cuentas de administración están exentas.

### Comercial

- [ ] ¿Qué lo ha convertido en prioridad ahora: una auditoría, un cliente, un incidente, el consejo?
  - Por qué: El detonante marca la urgencia y quién lo impulsa.
- [ ] ¿Quién tiene el presupuesto y quién más debe estar de acuerdo?
  - Por qué: Identifica pronto al grupo de compra.
- [ ] ¿Qué fecha importa y qué pasa si no se cumple?
  - Por qué: Un plazo real distingue proyectos de deseos.
- [ ] ¿Qué usa hoy para su mayor brecha y por qué no es suficiente?
  - Por qué: Descubre el proveedor actual y el coste de cambio.
- [ ] ¿Cómo juzgará el éxito a los 90 días?
  - Por qué: Convierte la demo en resultados medibles.

## Guion de demo

1. **Lo que está en juego**. Abra con su condición y los dos relojes, en sus propios términos. _(Entidad importante: empresa mediana en un sector del Anexo I.)_
2. **Prueba de recuperación**. Un informe de prueba de restauración con el tiempo de recuperación medido frente al objetivo y el estado de copias inmutables. _(Cierra la brecha del art. 21(2)(c) de NIS2: Continuidad de negocio, copias de seguridad y gestión de crisis.)_
3. **Vista de exposición de proveedores**. Una lista de proveedores ordenada con evidencias recogidas, brechas abiertas y cobertura de cláusulas contractuales. _(Cierra la brecha del art. 21(2)(d) de NIS2: Seguridad de la cadena de suministro.)_
4. **Evidencia de eficacia de controles**. Un panel de resultados de pruebas de controles y su tendencia que sirve también como evidencia de auditoría. _(Cierra la brecha del art. 21(2)(f) de NIS2: Evaluación de la eficacia de las medidas.)_
5. **El siguiente paso**. Acordar la medida de éxito, el responsable y una fecha para un piloto acotado o una propuesta. _(Pasar al trabajo de propuesta y ROI (presales-studio).)_

> Reglas revisadas 2026-11. Esto es preparación comercial, no asesoramiento jurídico. Confirme el ámbito con asesoría jurídica y la autoridad competente.

