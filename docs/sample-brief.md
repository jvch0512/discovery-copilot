# Discovery brief: Nube Gestionada Iberia (managed service provider)

## Regulatory scope

- **NIS2**: important entity. Important entity: medium-sized company in an Annex I sector.
- **DORA**: check. DORA reaches you indirectly: you provide ICT services to financial entities.
- **ENS**: applies. ENS applies to the systems that support services you provide to the Spanish public sector.
- **GDPR**: applies. GDPR applies: personal data is processed.

  - Size class: medium (staff 64, turnover 9 MEUR, balance sheet 6 MEUR).
  - A figure sits within 15 percent of a size threshold. Confirm the exact numbers.
  - Maximum administrative fine: EUR 7 million or 1.4 percent of worldwide annual turnover, whichever is higher (Art. 34).
  - Spain had not completed NIS2 transposition at the last review. The draft Ley de Coordinación y Gobernanza de la Ciberseguridad (approved by the Council of Ministers as a bill on 14 January 2025) was still in the legislative process, so Real Decreto-ley 12/2018 (the NIS1 law) remains the binding rule. The draft is the best guide to what is coming. Check the BOE before quoting a date.
  - DORA: Your financial customers must put DORA contractual provisions in their ICT contracts: expect clauses on service levels, incident support, audit and exit.
  - DORA: The European Supervisory Authorities can designate critical ICT third-party providers for direct oversight. Ask whether that is plausible for you.
  - ENS: Royal Decree 311/2022 sets the Esquema Nacional de Seguridad with three system categories (basic, medium, high) and conformity through certification or self-declaration depending on category.
  - ENS: Public customers will ask for proof of conformity in tenders. Ask which category their contract implies.
  - GDPR: Art. 32 requires appropriate security. Art. 33 requires notifying the supervisory authority of a personal data breach within 72 hours when feasible, unless unlikely to risk individuals.
  - GDPR: An incident can start two clocks: NIS2 and GDPR run independently.

NIS2 duties to anchor the conversation:
- Art. 20: the management body approves the cybersecurity risk measures, oversees them, can be held liable and must be trained.
- Art. 21(2): ten minimum risk measures, from risk analysis to multi-factor authentication.
- Art. 23: early warning within 24 hours, incident notification within 72 hours and a final report one month after the notification.

## Gap ranking (NIS2 Art. 21(2))

| # | Measure | Maturity | Score |
|---|---|---|---|
| 1 | 21(2)(c) Business continuity, backup and crisis management | none | 3.9 |
| 2 | 21(2)(d) Supply chain security | none | 3.3 |
| 3 | 21(2)(f) Assessing the effectiveness of measures | none | 2.4 |
| 4 | 21(2)(b) Incident handling | partial | 1.95 |
| 5 | 21(2)(i) HR security, access control and asset management | partial | 1.65 |
| 6 | 21(2)(a) Risk analysis and information system security policies | partial | 1.5 |
| 7 | 21(2)(e) Security in acquisition, development and maintenance, including vulnerability handling | partial | 1.5 |
| 8 | 21(2)(g) Basic cyber hygiene and training | partial | 1.35 |
| 9 | 21(2)(h) Cryptography and encryption | partial | 1.05 |
| 10 | 21(2)(j) Multi-factor authentication and secure communications | solid | 0.39 |

## Discovery questions

### Regulatory

- [ ] Has the management body approved the cybersecurity measures and received training?
  - Why: NIS2 Art. 20 makes management accountable and liable.
- [ ] Do you know whether you must register with the competent authority, and have you?
  - Why: Registration duties depend on national law.
- [ ] Can you produce an early warning within 24 hours with the information the authority expects?
  - Why: The first deadline is the one teams miss.
- [ ] Have your financial customers asked for DORA contract clauses, and can you meet them?
  - Why: Contracts are how DORA reaches ICT providers.
- [ ] Which ENS category do your systems fall under, and how is conformity shown today?
  - Why: Public tenders ask for proof of conformity.
- [ ] What is your process to decide, within hours, whether a breach must go to the data protection authority?
  - Why: The 72 hour GDPR clock runs beside any NIS2 clock.
- [ ] Who is your data protection officer, and do they sit in the incident response loop?
  - Why: Incident and privacy decisions must meet quickly.

### Top gaps

- [ ] When did you last restore a critical system from backup, end to end, and how long did it take?
  - Why: NIS2 Art. 21(2)(c): Business continuity, backup and crisis management.
  - Red flag: Backups were never test-restored, or sit on the same domain as production.
- [ ] Are backups isolated from the domain so ransomware cannot encrypt them?
  - Why: NIS2 Art. 21(2)(c): Business continuity, backup and crisis management.
- [ ] Is there a crisis plan the management has rehearsed, with decisions and contacts written down?
  - Why: NIS2 Art. 21(2)(c): Business continuity, backup and crisis management.
- [ ] Which suppliers could stop your service or expose your data, and how do you know?
  - Why: NIS2 Art. 21(2)(d): Supply chain security.
  - Red flag: There is no supplier inventory ranked by criticality.
- [ ] What security clauses and audit rights do your critical contracts contain?
  - Why: NIS2 Art. 21(2)(d): Supply chain security.
- [ ] How do you hear about a security problem at a supplier, and how fast?
  - Why: NIS2 Art. 21(2)(d): Supply chain security.
- [ ] How do you know your controls work? What was the last test, and what did it find?
  - Why: NIS2 Art. 21(2)(f): Assessing the effectiveness of measures.
  - Red flag: The only evidence is a certificate and an annual audit.
- [ ] Do you run exercises or penetration tests, and who sees the results?
  - Why: NIS2 Art. 21(2)(f): Assessing the effectiveness of measures.
- [ ] Which metrics does management receive, and how often?
  - Why: NIS2 Art. 21(2)(f): Assessing the effectiveness of measures.

### Validate the rest

- [ ] Walk me through the last real incident: who found it, how long to contain it, what did you learn?
  - Why: NIS2 Art. 21(2)(b): Incident handling.
  - Red flag: Nobody can name who files the notification, or detection stops outside office hours.
- [ ] How fast is access removed when someone leaves or changes role?
  - Why: NIS2 Art. 21(2)(i): HR security, access control and asset management.
  - Red flag: Former employees still hold active accounts, or admin rights have no owner.
- [ ] When was your last formal cyber risk assessment, and who signed off the results?
  - Why: NIS2 Art. 21(2)(a): Risk analysis and information system security policies.
  - Red flag: The last assessment was for an audit and nobody owns the follow-up.
- [ ] How long does a critical vulnerability stay open on internet-facing systems?
  - Why: NIS2 Art. 21(2)(e): Security in acquisition, development and maintenance, including vulnerability handling.
  - Red flag: Patching is by calendar, not by exposure, and the asset list is a spreadsheet nobody trusts.
- [ ] What training do staff and the management body get, and how do you measure it works?
  - Why: NIS2 Art. 21(2)(g): Basic cyber hygiene and training.
  - Red flag: Training is a yearly video with no measurement and leadership is exempt.
- [ ] Which data is encrypted at rest and in transit, and who manages the keys?
  - Why: NIS2 Art. 21(2)(h): Cryptography and encryption.
  - Red flag: Certificates are tracked in someone's calendar and laptops are not encrypted.
- [ ] Where is multi-factor authentication enforced, and where is it still missing?
  - Why: NIS2 Art. 21(2)(j): Multi-factor authentication and secure communications.
  - Red flag: MFA is optional, or admin accounts are exempt.

### Commercial

- [ ] What made this a priority now: an audit, a customer, an incident, the board?
  - Why: The trigger sets the urgency and the champion.
- [ ] Who owns the budget, and who else must agree?
  - Why: Maps the buying group early.
- [ ] Which date matters, and what happens if it is missed?
  - Why: A real deadline separates projects from wishes.
- [ ] What do you use today for your biggest gap, and why is it not enough?
  - Why: Surfaces the incumbent and the switching cost.
- [ ] How will you judge success after 90 days?
  - Why: Turns the demo into measurable outcomes.

## Demo storyline

1. **The stakes**. Open with their status and the two clocks, in their own terms. _(Important entity: medium-sized company in an Annex I sector.)_
2. **Recovery proof**. A restore test report with measured recovery time against the target, and immutable backup status. _(Closes the gap on NIS2 Art. 21(2)(c): Business continuity, backup and crisis management.)_
3. **Supplier exposure view**. A ranked supplier list with evidence collected, open gaps and contract clause coverage. _(Closes the gap on NIS2 Art. 21(2)(d): Supply chain security.)_
4. **Control effectiveness evidence**. A dashboard of control test results and trend that doubles as audit evidence. _(Closes the gap on NIS2 Art. 21(2)(f): Assessing the effectiveness of measures.)_
5. **The next step**. Agree the success measure, the owner and a date for a scoped pilot or proposal. _(Hand over to proposal and ROI work (presales-studio).)_

> Rules reviewed 2026-11. This is pre-sales preparation, not legal advice. Confirm scope with counsel and the competent authority.

