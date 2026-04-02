import type { ReactNode } from 'react'

export interface ServiceSample {
  serviceNum: string
  docType: string
  docTitle: string
  docNumber: string
  version: string
  date: string
  classification: string
  content: ReactNode
}

/* ─── Shared micro-helpers ─────────────────────────────────────────── */
function H({ t }: { t: string }) { return <div className="sdoc-h2">{t}</div> }
function P({ children }: { children: ReactNode }) { return <p className="sdoc-p">{children}</p> }
function InfoBox({ children }: { children: ReactNode }) { return <div className="sdoc-info-box">{children}</div> }
function Th({ cols }: { cols: string[] }) {
  return <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
}
function ApprovalBlock() {
  return (
    <div className="sdoc-approval-block">
      {['Prepared By', 'Reviewed By', 'Approved By'].map(role => (
        <div className="sdoc-approval-cell" key={role}>
          <div className="sdoc-sig-line" />
          <div className="sdoc-sig-role">{role}</div>
          <div>Name / Title</div>
          <div>Date: ___________</div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SERVICE 01 — Regulatory Affairs: Pre-IND Briefing Document
   ═══════════════════════════════════════════════════════════════ */
const s01: ReactNode = (
  <>
    <H t="1. Executive Summary" />
    <P>
      TXR-2241 is a potent, first-in-class, orally bioavailable covalent inhibitor of KRAS G12C,
      developed for previously treated non-small cell lung cancer (NSCLC). This briefing document
      requests a Type B Pre-IND meeting with FDA/CDER to align on: (a) adequacy of the preclinical
      safety package to support a first-in-human Phase 1 SAD study; (b) proposed starting dose
      and escalation schema; and (c) CMC readiness per 21 CFR 312.82 and FDA Guidance
      <em> "Pre-IND Meeting Requests" (2021)</em>.
    </P>

    <H t="2. Product Profile" />
    <table className="sdoc-table">
      <Th cols={['Attribute', 'Detail']} />
      <tbody>
        {([
          ['Product Code', 'TXR-2241'],
          ['INN (Proposed)', 'txrkibinib'],
          ['Mechanism', 'Irreversible covalent KRAS G12C inhibitor (IC₅₀ = 3.4 nM, biochemical)'],
          ['Indication', 'KRAS G12C-mutant NSCLC — 2nd-line after platinum chemotherapy'],
          ['Route / Form', 'Oral hard gelatin capsule — 10 mg, 25 mg, 50 mg strengths'],
          ['Phase 1 Dose Range', '10 mg QD → 400 mg QD (6 cohorts, 3+3 design)'],
          ['Development Phase', 'Pre-IND (IND target: Q3 2025)'],
          ['Regulatory Strategy', 'Aneuresis Regulatory Sciences LLC'],
        ] as [string, string][]).map(([a, b]) => (
          <tr key={a}><td><strong>{a}</strong></td><td>{b}</td></tr>
        ))}
      </tbody>
    </table>

    <H t="3. Questions for FDA" />
    <ol className="sdoc-ol">
      <li><strong>Preclinical Adequacy:</strong> Does the completed package (GLP 28-day rat + dog, in vitro genotoxicity, ICH S7A/S7B safety pharmacology) adequately support a FIH SAD Phase 1 study?</li>
      <li><strong>Starting Dose:</strong> The sponsor proposes 10 mg QD (1/100th of the rat NOAEL-HED = 972 mg). Does FDA concur per ICH M3(R2) and FDA "Maximum Safe Starting Dose" Guidance (2005)?</li>
      <li><strong>CMC Readiness:</strong> Is a simplified Phase 1 CMC section (drug substance characterization + manufacturing summary) acceptable for IND filing at this stage?</li>
      <li><strong>CDx Strategy:</strong> Given KRAS G12C biomarker eligibility criterion, the sponsor plans to use a validated LDT. Does FDA have CDx co-development expectations at this early stage?</li>
    </ol>

    <H t="4. Preclinical Safety Package Summary" />
    <table className="sdoc-table">
      <Th cols={['Study', 'Species', 'Route', 'GLP', 'Duration', 'Status', 'Key Finding / NOAEL']} />
      <tbody>
        {([
          ['Ames Test', 'S. typhimurium / E. coli', 'N/A', 'Yes', 'Single', 'Complete', 'Non-mutagenic at all concentrations'],
          ['In Vitro MN', 'CHO-K1', 'N/A', 'Yes', '3h/24h', 'Complete', 'Negative — no clastogenicity'],
          ['hERG Patch-Clamp', 'HEK293', 'N/A', 'No', 'Single', 'Complete', 'IC₅₀ = 38 µM; >10,000× margin at Cmax'],
          ['7-Day DRF (Rat)', 'SD Rat M/F', 'PO gavage', 'No', '7-day', 'Complete', 'MTD >500 mg/kg; minor ALT↑ at 500 mg/kg'],
          ['28-Day (Rat)', 'SD Rat M/F n=15/grp', 'PO gavage', 'Yes', '28-day + 14-day recovery', 'Complete', 'NOAEL = 100 mg/kg/day; reversible hepatocellular hypertrophy ≥300 mg/kg'],
          ['28-Day (Dog)', 'Beagle M/F n=4/grp', 'PO capsule', 'Yes', '28-day + 14-day recovery', 'Complete', 'NOAEL = 30 mg/kg/day; reversible GI effects ≥100 mg/kg'],
          ['DART Range-Finder', 'SD Rat F', 'PO gavage', 'No', 'GD6-17', 'Complete', 'Embryofetal toxicity ≥100 mg/kg — restrict to non-WOCBP'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="5. HED Calculation & Proposed Starting Dose" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Rat NOAEL:</strong> 100 mg/kg/day · <strong>HED (Km method):</strong> 100 × (6/37) = <strong>16.2 mg/kg</strong> (~972 mg / 60 kg patient)<br />
        <strong>Dog NOAEL:</strong> 30 mg/kg/day · <strong>HED:</strong> 30 × (20/37) = <strong>16.2 mg/kg</strong> (concordant)<br />
        <strong>MRSD (1/10 HED):</strong> ~97 mg → <strong>Proposed Starting Dose: 10 mg QD</strong> (additional 10× safety factor) ✓
      </p>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 02 — REMS Design
   ═══════════════════════════════════════════════════════════════ */
const s02: ReactNode = (
  <>
    <H t="1. Product & Risk Overview" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Product:</strong> VITRALUX® (isotretinoin analog — systemic retinoid) · <strong>Indication:</strong> Severe recalcitrant nodular acne · <strong>Route:</strong> Oral capsule (20 mg / 40 mg)<br />
        <strong>Serious Risk:</strong> Teratogenicity (Category X) — single dose may cause severe birth defects · <strong>REMS Required:</strong> Yes (21 USC §355-1 determination)
      </p>
    </InfoBox>

    <H t="2. Benefit-Risk Assessment Matrix" />
    <table className="sdoc-table">
      <Th cols={['Risk', 'Severity', 'Frequency', 'Mitigation Measure', 'Residual Risk']} />
      <tbody>
        {([
          ['Teratogenicity (pregnancy exposure)', 'Critical — life-threatening birth defects', 'Very common without controls', 'Mandatory pregnancy testing; dual contraception requirement; iPLEDGE-equivalent enrollment', <span key="r1" className="sdoc-low">Low (with REMS)</span>],
          ['Psychiatric effects (depression/suicidality)', 'Severe', 'Uncommon (1–5%)', 'Mandatory psychiatric screening; Medication Guide; prescriber attestation', <span key="r2" className="sdoc-med">Moderate</span>],
          ['Hyperlipidemia / pancreatitis', 'Moderate', 'Common (25–45%)', 'Baseline + monthly lipid panel; prescriber education module', <span key="r3" className="sdoc-low">Low</span>],
          ['Hepatotoxicity', 'Moderate–Severe', 'Uncommon', 'Baseline LFTs; monitoring schedule; prescriber attestation', <span key="r4" className="sdoc-low">Low</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="3. Proposed ETASU Components" />
    <table className="sdoc-table">
      <Th cols={['ETASU Element', 'Description', 'Stakeholder', 'Key Performance Metric']} />
      <tbody>
        {([
          ['Prescriber Certification', 'Annual online training + competency attestation before prescribing', 'Prescriber', '100% certified; re-certification ≤12 months'],
          ['Pharmacy Certification', 'Enrollment + dispensing controls; activation code per fill', 'Pharmacy', 'Only certified pharmacies dispense'],
          ['Patient Enrollment (Female ROCBP)', 'Enrollment + dual contraception confirmation + monthly negative pregnancy test', 'Patient', 'No dispense without negative test within 7 days'],
          ['Patient Enrollment (Non-ROCBP)', 'Streamlined enrollment; awareness module only', 'Patient', '100% enrollment before first fill'],
          ['Medication Guide Dispensing', 'FDA-approved MedGuide with every fill; patient acknowledgment documented', 'Pharmacy / Patient', '100% MedGuide provision at each dispense'],
          ['REMS Quarterly Assessment', 'Prescription counts, enrollment rates, pregnancy outcomes reported to FDA', 'Sponsor (advisory by SRS)', 'On-time submission; <0.1% pregnancy exposure rate target'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="4. Medication Error Prevention Analysis" />
    <ul className="sdoc-list">
      <li><strong>Name confusion risk (VITRALUX vs. VITRASERT®):</strong> Orthographic analysis performed; tall-man lettering recommended in labeling (VITRAlux)</li>
      <li><strong>Dosing confusion:</strong> Color-coded capsules (20 mg = yellow; 40 mg = blue); carton barcode + NDC verification workflow</li>
      <li><strong>Off-label use prevention:</strong> Prescriber certification module explicitly addresses approved indication scope and prohibited uses</li>
      <li><strong>Community pharmacy safeguard:</strong> Dual-confirmation workflow; activation code locks out unverified fills in pharmacy dispensing system</li>
    </ul>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 03 — Technical Writing: SOP
   ═══════════════════════════════════════════════════════════════ */
const s03: ReactNode = (
  <>
    <H t="1. Purpose & Scope" />
    <P>
      This SOP describes the standardized workflow for automated High-Content Screening (HCS)
      image acquisition and multi-parameter analysis of cell viability, nuclear morphology,
      and cytotoxic phenotype using the Operetta CLS® High-Content Analysis System.
      Applies to all HCS campaigns in the HTS Laboratory. Supersedes SOP-HCS-042 Rev 2.1.
    </P>

    <H t="2. Responsibilities" />
    <table className="sdoc-table">
      <Th cols={['Role', 'Responsibility']} />
      <tbody>
        {([
          ['Principal Scientist / Study Director', 'Approves assay design; reviews analysis parameters; authorizes report release'],
          ['HTS Scientist', 'Performs plate setup, image acquisition, primary analysis; documents deviations in ELN'],
          ['HCS Image Analyst', 'Configures and validates analysis algorithms; QC reviews image segmentation; exports to LIMS'],
          ['Quality Assurance Officer', 'Audits SOP compliance; reviews raw data and audit trail; approves GLP study records'],
          ['Instrument Engineer', 'Scheduled PM; calibration log maintenance; troubleshoots system alerts'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. Procedure" />
    <ol className="sdoc-ol">
      <li><strong>Plate Preparation:</strong> Seed 2,000 cells/well (384-well, µClear® black-bottom) in 40 µL assay medium. Incubate 24 h at 37°C / 5% CO₂ before compound addition.</li>
      <li><strong>Compound Addition:</strong> Transfer 10 µL compound (5× stock) via Mosquito® HTS to achieve 50 µL final volume. Controls: Col 1 = 0.5% DMSO (vehicle); Col 24 = 10 µM staurosporine (100% cytotoxicity).</li>
      <li><strong>Incubation:</strong> 24 h (cytotoxicity) or 72 h (antiproliferative) per study protocol. Record incubator T°/CO₂ at start and end.</li>
      <li><strong>Staining:</strong> Aspirate medium. Add 30 µL staining mix [Hoechst 33342 (2 µg/mL) + TOTO-3 (0.5 µM) + AF488-phalloidin (1:200)] in PBS. Incubate 30 min RT, light-protected.</li>
      <li><strong>Wash & Fix:</strong> Aspirate, wash ×2 PBS, add 40 µL 4% PFA/PBS (15 min RT), wash ×2, seal with Alchemy Plate Seal™.</li>
      <li><strong>Instrument Warm-Up:</strong> Power on Operetta CLS® ≥30 min prior. Run system check (laser power, autofocus calibration). Record in logbook.</li>
      <li><strong>Image Acquisition:</strong> Load plate map. Parameters: 10× objective; 2×2 binning; 4 fields/well; channels: DAPI, TRITC, GFP. Acquisition time ~45 min / 384-well plate.</li>
      <li><strong>Image QC:</strong> Review auto-flagged images (focus fail, edge effect, saturation). Re-acquire within 2 h. Flag wells with &gt;15% cell loss for analyst review.</li>
      <li><strong>Analysis:</strong> Apply validated Harmony® PhenoLOGIC™ protocol. Export per-well data to LIMS. Archive raw images per SOP-DM-006.</li>
      <li><strong>Data Sign-Off:</strong> Scientist reviews QC metrics + acceptance criteria. Signs in LIMS. Deviations documented in ELN; QA review within 48 h.</li>
    </ol>

    <H t="4. Acceptance Criteria" />
    <table className="sdoc-table">
      <Th cols={['QC Parameter', 'Specification', 'Action if Out-of-Spec']} />
      <tbody>
        {([
          ["Z'-factor (per plate)", '≥ 0.50', 'Flag plate; repeat acquisition; escalate to Study Director if persistent'],
          ['Signal-to-Background (S/B)', '≥ 3.0', 'Check staining protocol; verify reagent lot; do not report OOS plates'],
          ['Vehicle Control CV% (% live cells)', '≤ 10%', 'Investigate pipetting error; check cell density uniformity'],
          ['Cytotoxicity Control (% dead cells)', '≥ 80%', 'Verify staurosporine concentration; check staining reagents'],
          ['Total cell count / well (vehicle ctrl)', '1,800 – 2,200 cells', 'Investigate seeding; check cell viability at time of seeding'],
          ['Focus Failure Rate', '< 2% of fields', 'Run autofocus recalibration; contact Instrument Engineer if >5%'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 04 — Medical Device: 510(K) Summary
   ═══════════════════════════════════════════════════════════════ */
const s04: ReactNode = (
  <>
    <H t="1. Device Description" />
    <P>
      The AuraScan™ Continuous Interstitial Glucose Monitor (CGM) is a Class II wireless wearable
      device for real-time glucose monitoring in adult diabetic patients (Type 1 or 2). System
      components: (1) single-use 14-day electrochemical biosensor filament; (2) reusable NFC/BLE
      transmitter; (3) AuraScan™ mobile app (iOS/Android). Submission prepared by Shahane
      Regulatory Sciences LLC; submitted by sponsor via their FDA-registered establishment account.
    </P>

    <H t="2. Predicate Device Comparison (Dexcom G7® — K231847)" />
    <table className="sdoc-table">
      <Th cols={['Characteristic', 'AuraScan™ (Subject)', 'Predicate (K231847)', 'Equivalent?']} />
      <tbody>
        {([
          ['Intended Use', 'Continuous interstitial glucose monitoring, adult diabetic patients', 'CGM, adult + pediatric (≥2 yr)', <span key="e1" className="sdoc-pass">Yes ✓ (adult subset)</span>],
          ['Technology Principle', 'Amperometric glucose oxidase biosensor', 'Amperometric glucose oxidase biosensor', <span key="e2" className="sdoc-pass">Yes ✓</span>],
          ['Calibration', 'Factory calibrated — no finger-stick required', 'Factory calibrated', <span key="e3" className="sdoc-pass">Yes ✓</span>],
          ['Wear Duration', '14 days', '10 days', <span key="e4" className="sdoc-warn">Different — data provided ¹</span>],
          ['Communication', 'NFC + Bluetooth LE 5.2', 'Bluetooth LE', <span key="e5" className="sdoc-pass">Equivalent function ✓</span>],
          ['Alert System', 'Customizable high/low + urgent low (≤55 mg/dL)', 'High/low + urgent low alarm', <span key="e6" className="sdoc-pass">Yes ✓</span>],
          ['Biocompatibility', 'ISO 10993-1 (cytotoxicity, sensitization, implantation)', 'ISO 10993-1 compliant', <span key="e7" className="sdoc-pass">Yes ✓</span>],
          ['Sterility', 'EtO — validated per ISO 11135', 'EtO sterilization', <span key="e8" className="sdoc-pass">Yes ✓</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
    <P>¹ 14-day wear supported by extended bench testing and clinical wear study (n=120; MARD = 8.3% vs. YSI reference at full wear duration).</P>

    <H t="3. Performance Testing Results" />
    <table className="sdoc-table">
      <Th cols={['Test', 'Standard / Method', 'Acceptance Criterion', 'Result', 'Status']} />
      <tbody>
        {([
          ['Analytical Accuracy (MARD)', 'ISO 15197:2013; YSI reference', '≤ 9.0%', 'MARD = 8.3% (n=1,847 readings)', <span key="p1" className="sdoc-pass">PASS ✓</span>],
          ['Low Glucose Accuracy (≤70 mg/dL)', 'ISO 15197:2013 Clarke Zone A+B', '≥ 95% Zone A+B', '98.1% Zone A; 1.9% Zone B', <span key="p2" className="sdoc-pass">PASS ✓</span>],
          ['High Glucose Accuracy (>180 mg/dL)', 'ISO 15197:2013', '≥ 95% Zone A+B', '97.4% Zone A; 2.6% Zone B', <span key="p3" className="sdoc-pass">PASS ✓</span>],
          ['EMC', 'IEC 60601-1-2 (4th Ed.)', 'No interference at 3 V/m', 'Compliant — all frequencies', <span key="p4" className="sdoc-pass">PASS ✓</span>],
          ['Biocompatibility — Cytotoxicity', 'ISO 10993-5 (MEM Elution)', 'Grade ≤ 1', 'Grade 0 — no reactivity', <span key="p5" className="sdoc-pass">PASS ✓</span>],
          ['Shelf Life (accelerated)', 'ASTM F1980; 12-mo real-time', '14-day performance maintained', 'All specs maintained at 24-mo equivalent', <span key="p6" className="sdoc-pass">PASS ✓</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="4. Substantial Equivalence Determination" />
    <InfoBox>
      <P>
        AuraScan™ has the same intended use and technological characteristics as the predicate
        (Dexcom G7®, K231847). The 14-day wear duration difference is supported by performance
        data showing no new safety/effectiveness questions. AuraScan™ is
        <strong> substantially equivalent</strong> per 21 CFR §807.100(b).
      </P>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 05 — QMS: GMP Gap Analysis
   ═══════════════════════════════════════════════════════════════ */
const s05: ReactNode = (
  <>
    <H t="1. Assessment Scope & Methodology" />
    <P>
      GMP Quality System Gap Analysis performed at [Client — Confidential] API manufacturing
      facility against 21 CFR Part 211, FDA "Quality Systems Approach to CGMP" (2006), and
      ICH Q10. Methodology: structured document review, personnel interviews, manufacturing
      observations, and 12-month deviation/CAPA records review. 48 sub-elements assessed
      across 8 quality system components.
    </P>

    <H t="2. Gap Assessment Matrix (Critical & Major Findings)" />
    <table className="sdoc-table">
      <Th cols={['21 CFR Ref.', 'Requirement', 'Current State', 'Gap?', 'Priority', 'Recommended Action']} />
      <tbody>
        {([
          ['§211.68', 'CSV for LIMS and MES', 'LIMS partially validated (2019); no periodic review; MES unvalidated', <span key="g1" className="sdoc-fail">Yes ✗</span>, <span key="p1" className="sdoc-high">Critical</span>, 'Commission full CSV retrospective; GAMP 5 plan within 90 days'],
          ['§211.100', 'Written procedures for production controls', '12 of 34 batch records lack version-controlled MBR reference', <span key="g2" className="sdoc-fail">Yes ✗</span>, <span key="p2" className="sdoc-high">Critical</span>, 'Audit all batch records; implement DMS; 60-day remediation plan'],
          ['§211.68(b)', 'Audit trail / data integrity policy', 'No formal DI policy; no audit trail review SOP', <span key="g3" className="sdoc-fail">Yes ✗</span>, <span key="p3" className="sdoc-high">Critical</span>, 'Adopt FDA Data Integrity Guidance (2018); implement audit trail SOP; train all analysts'],
          ['§211.192', 'Batch record review before release', 'QA review averages 18 days; no SOP time limit defined', <span key="g4" className="sdoc-fail">Yes ✗</span>, <span key="p4" className="sdoc-med">Major</span>, 'Define ≤10 business-day target; track KPI monthly'],
          ['§211.22(d)', 'QA authority formally documented', 'QA batch disposition authority not in QMS writing', <span key="g5" className="sdoc-fail">Yes ✗</span>, <span key="p5" className="sdoc-med">Major</span>, 'Revise QA charter; update Quality Manual §4.2; VP sign-off'],
          ['§211.160(b)', 'Reference standard COAs on file', '3 of 11 compendial RSs lack COA', <span key="g6" className="sdoc-warn">Partial</span>, <span key="p6" className="sdoc-med">Major</span>, 'Procure missing COAs; institute RS receipt SOP within 30 days'],
          ['§211.180(e)', 'Annual Product Review (APR) timeliness', '2 of 5 APRs not completed within 12-month window', <span key="g7" className="sdoc-warn">Partial</span>, <span key="p7" className="sdoc-med">Major</span>, 'Complete overdue APRs within 45 days; rolling APR calendar in QMS'],
          ['ICH Q10 §3.2', 'CAPA effectiveness verification', '34% of CAPAs closed without effectiveness check', <span key="g8" className="sdoc-fail">Yes ✗</span>, <span key="p8" className="sdoc-med">Major</span>, 'Redesign CAPA form; retrospective review of all open CAPAs'],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0]) + String(r[1])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="3. Remediation Priority Summary" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Critical Findings:</strong> 3 (CSV, batch record control, data integrity) — Address within <strong>60–90 days</strong><br />
        <strong>Major Findings:</strong> 5 — Address within <strong>90–180 days</strong><br />
        <strong>Minor / Observations:</strong> 11 (full report) — Address within <strong>next inspection cycle</strong><br />
        <strong>Overall GMP Compliance Score:</strong> <strong>64 / 100</strong> — Remediation required before next FDA inspection
      </p>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 06 — Pre-clinical: Toxicology Summary
   ═══════════════════════════════════════════════════════════════ */
const s06: ReactNode = (
  <>
    <H t="1. Study Design" />
    <table className="sdoc-table">
      <Th cols={['Parameter', 'Detail']} />
      <tbody>
        {([
          ['Study Title', '28-Day Oral (Gavage) Repeat-Dose Toxicology + 14-Day Recovery — Sprague-Dawley Rat (GLP)'],
          ['Study Number', 'TOX-2025-R28-TXR001'],
          ['GLP Status', 'GLP-compliant (21 CFR Part 58)'],
          ['Test Article', 'TXR-2241 — 99.2% purity (HPLC); vehicle: 0.5% MC / 0.1% Tween 80'],
          ['Dose Groups', 'Group 1: 0 mg/kg | Group 2: 30 mg/kg | Group 3: 100 mg/kg | Group 4: 300 mg/kg (oral gavage, QD, 28 days)'],
          ['Animals / Group', '15 M + 15 F main study; 5 M + 5 F recovery (G1, G4 only)'],
          ['Endpoints', 'Clinical obs., body weight, food consumption, ophthalmology, clinical pathology (wk 2 & 4), gross necropsy, organ weights, histopathology (>40 tissues)'],
        ] as string[][]).map(([a, b]) => (
          <tr key={a}><td><strong>{a}</strong></td><td>{b}</td></tr>
        ))}
      </tbody>
    </table>

    <H t="2. Key Histopathology & Clinical Pathology Findings" />
    <table className="sdoc-table">
      <Th cols={['Organ / Parameter', 'Finding', 'Dose Group(s)', 'Severity', 'Incidence', 'Reversible?']} />
      <tbody>
        {([
          ['Liver (histo)', 'Hepatocellular hypertrophy (centrilobular)', '100, 300 mg/kg', 'Minimal → Mild', '10/10 at 300 mg/kg', <span key="rv1" className="sdoc-pass">Yes (14-day recovery)</span>],
          ['Liver (clin. path)', 'ALT elevation ≥3× ULN', '300 mg/kg', 'Moderate', '15/15 (M+F)', <span key="rv2" className="sdoc-pass">Yes — normalized by day 43</span>],
          ['Liver (clin. path)', 'ALT elevation 1.5–2× ULN', '100 mg/kg', 'Slight', '8/10 M; 6/10 F', <span key="rv3" className="sdoc-pass">Yes</span>],
          ['Adrenal gland', 'Cortical vacuolation (lipid accumulation)', '300 mg/kg', 'Minimal', '6/15 M; 4/15 F', <span key="rv4" className="sdoc-pass">Yes</span>],
          ['Bone marrow', 'Hypocellularity', '300 mg/kg', 'Mild', '4/15 M; 3/15 F', <span key="rv5" className="sdoc-pass">Yes — recovery complete</span>],
          ['GI (stomach)', 'Mucosal erosion / hemorrhage', '300 mg/kg only', 'Minimal', '2/15 M; 1/15 F', <span key="rv6" className="sdoc-pass">Yes</span>],
          ['Body weight', 'Reduced vs. control (−12%)', '300 mg/kg', 'Mild', '15/15 M+F', 'N/A (functional)'],
          ['All other tissues', 'No treatment-related findings', '0–300 mg/kg', 'None', 'N/A', 'N/A'],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0]) + String(r[1])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="3. NOAEL Determination & HED" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>NOAEL (Rat, 28-day):</strong> <strong>100 mg/kg/day</strong> — hepatocellular hypertrophy at 100 mg/kg classified as adaptive, not adverse (ICH S8)<br />
        <strong>LOAEL:</strong> <strong>300 mg/kg/day</strong> (ALT ≥3× ULN, bone marrow hypocellularity)<br />
        <strong>HED (Km method, ICH M3(R2)):</strong> 100 × (6/37) = <strong>16.2 mg/kg</strong> (~972 mg / 60 kg patient)<br />
        <strong>Safety Margin at proposed 100 mg starting dose:</strong> <strong>972 / 100 = 9.7× ✓</strong>
      </p>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 07 — Bioassay Validation Report
   ═══════════════════════════════════════════════════════════════ */
const s07: ReactNode = (
  <>
    <H t="1. Assay Description & Principle" />
    <P>
      The NF-κB Luciferase Reporter Gene Potency Assay quantifies agonist/antagonist activity
      on the NF-κB pathway using HEK293 cells stably transfected with 5× NF-κB-RE-firefly
      luciferase (HEK293/NF-κB-Luc). TNF-α reference agonist stimulation drives luminescence
      output (RLU) proportional to transcriptional activity. EC₅₀ derived by 4-parameter logistic
      (4PL) curve fitting. Developed and validated per ICH Q2(R2) and USP &lt;1033&gt; Biological
      Assay Validation.
    </P>

    <H t="2. Validation Parameters Summary (n=6 independent runs)" />
    <table className="sdoc-table">
      <Th cols={['Parameter', 'Acceptance Criterion', 'Result', 'Status']} />
      <tbody>
        {([
          ['Specificity', 'EC₅₀ shift ≥2-fold with anti-TNF-α neutralization', 'Mean shift = 38.4-fold (p<0.001)', <span key="vs1" className="sdoc-pass">PASS ✓</span>],
          ['Accuracy (% recovery)', '85.0 – 115.0%', 'Mean = 101.4% (range 96.2–108.7%)', <span key="vs2" className="sdoc-pass">PASS ✓</span>],
          ['Precision — Intra-assay CV%', '≤ 15.0%', 'Mean CV = 5.8% (range 3.2–9.1%)', <span key="vs3" className="sdoc-pass">PASS ✓</span>],
          ['Precision — Inter-assay CV%', '≤ 20.0%', 'Inter-assay CV = 11.3% (6 runs, 3 analysts)', <span key="vs4" className="sdoc-pass">PASS ✓</span>],
          ['Linearity (R²)', '≥ 0.980', 'R² = 0.997 (4PL, 8-point dilution series)', <span key="vs5" className="sdoc-pass">PASS ✓</span>],
          ['Range (LLOQ → ULOQ)', 'Defined by CV ≤20% and accuracy ±25%', 'LLOQ = 0.08 ng/mL; ULOQ = 50 ng/mL (625-fold range)', <span key="vs6" className="sdoc-pass">PASS ✓</span>],
          ['Robustness — Cell passage', 'CV ≤15% across passages 12–24', 'CV = 7.2% across passages 12–22', <span key="vs7" className="sdoc-pass">PASS ✓</span>],
          ['Robustness — Analyst', 'CV ≤20% across analysts', 'CV = 9.6% (3 analysts)', <span key="vs8" className="sdoc-pass">PASS ✓</span>],
          ["System Suitability — Z'-factor", '≥ 0.50 per plate', "Mean Z' = 0.76 ± 0.07 (all runs)", <span key="vs9" className="sdoc-pass">PASS ✓</span>],
          ['System Suitability — S/B ratio', '≥ 5.0', 'Mean S/B = 18.3 (stimulated vs. unstimulated)', <span key="vs10" className="sdoc-pass">PASS ✓</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="3. Representative Standard Curve — Run 4" />
    <table className="sdoc-table">
      <Th cols={['TNF-α Conc. (ng/mL)', 'Mean RLU', 'SD', 'CV%', '4PL Predicted', '% Accuracy']} />
      <tbody>
        {([
          ['0.04', '1,820', '145', '7.97%', '1,789', '101.7%'],
          ['0.08 (LLOQ)', '3,410', '228', '6.69%', '3,521', '96.8%'],
          ['0.20', '8,945', '534', '5.97%', '9,010', '99.3%'],
          ['0.63', '24,380', '1,128', '4.63%', '24,892', '97.9%'],
          ['2.00', '58,720', '2,914', '4.96%', '57,405', '102.3%'],
          ['6.30', '89,340', '4,022', '4.50%', '91,203', '97.9%'],
          ['20.00', '102,450', '5,843', '5.70%', '104,200', '98.3%'],
          ['50.00 (ULOQ)', '108,120', '7,340', '6.79%', '107,650', '100.4%'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>4PL Parameters (Run 4):</strong> Bottom = 1,802 RLU | Top = 110,450 RLU | EC₅₀ = 1.42 ng/mL | Hill Slope (n) = 1.18 | R² = 0.9989
      </p>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 08 — Bioassay Tech Transfer
   ═══════════════════════════════════════════════════════════════ */
const s08: ReactNode = (
  <>
    <H t="1. Transfer Overview" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Assay:</strong> IL-2-Dependent CTLL-2 Cell Proliferation Potency Assay (CellTiter-Glo® readout)<br />
        <strong>Purpose:</strong> Lot release potency testing for recombinant IL-2 drug substance<br />
        <strong>Sending Site:</strong> Site A — R&D, Cambridge MA (Originator) · <strong>Receiving Site:</strong> Site B — QC, San Diego CA<br />
        <strong>Transfer Protocol:</strong> TTR-2025-IL2-CTLL2-001 (authored by Aneuresis Regulatory Sciences LLC)
      </p>
    </InfoBox>

    <H t="2. Comparability Results — Qualification Runs (n=6 per site)" />
    <table className="sdoc-table">
      <Th cols={['Parameter', 'Site A Mean ± SD', 'Site B Mean ± SD', 'Acceptance Criterion', 'Status']} />
      <tbody>
        {([
          ['EC₅₀ (ng/mL)', '0.84 ± 0.09', '0.88 ± 0.11', '0.50 – 1.50 ng/mL', <span key="tt1" className="sdoc-pass">PASS ✓</span>],
          ['EC₅₀ Inter-site Ratio (B/A)', '—', '1.05', '0.67 – 1.50 (≤1.5-fold)', <span key="tt2" className="sdoc-pass">PASS ✓</span>],
          ['Emax (% vs. reference)', '98.4 ± 4.2%', '101.2 ± 5.6%', '80.0 – 120.0%', <span key="tt3" className="sdoc-pass">PASS ✓</span>],
          ['Hill Slope (n)', '1.42 ± 0.12', '1.39 ± 0.14', '1.0 – 2.0', <span key="tt4" className="sdoc-pass">PASS ✓</span>],
          ['Intra-assay CV% (ref. std)', '5.1 ± 1.4%', '6.8 ± 2.1%', '≤ 15.0%', <span key="tt5" className="sdoc-pass">PASS ✓</span>],
          ['Inter-assay CV% (ref. std)', '9.2%', '12.4%', '≤ 20.0%', <span key="tt6" className="sdoc-pass">PASS ✓</span>],
          ["Z'-factor (system suitability)", '0.74 ± 0.06', '0.71 ± 0.08', '≥ 0.50', <span key="tt7" className="sdoc-pass">PASS ✓</span>],
          ['Cell viability at plating', '97.2 ± 0.8%', '95.8 ± 1.4%', '≥ 90.0% (trypan blue)', <span key="tt8" className="sdoc-pass">PASS ✓</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="3. Deviations & Resolution" />
    <table className="sdoc-table">
      <Th cols={['Dev. #', 'Description', 'Root Cause', 'Resolution']} />
      <tbody>
        {([
          ["DEV-001", "Run 2 at Site B: Z'-factor = 0.41 (below 0.50)", 'Cell culture mycoplasma contamination; MCB replaced', 'Fresh cells from tested MCB used for Runs 3–6; all passed'],
          ['DEV-002', 'CellTiter-Glo® reagent lot change between Runs 3 and 4', 'Reagent lot expiry; new lot received per SOP', 'Lot-to-lot CV ≤5%; no impact on results confirmed'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="4. Transfer Qualification Decision" />
    <InfoBox>
      <P>
        All 8 primary parameters met acceptance criteria at Site B across 6 qualification runs
        (excluding DEV-001 failed run). Inter-site EC₅₀ ratio = 1.05 (well within 1.5-fold
        criterion). The CTLL-2 Proliferation Potency Assay is hereby declared
        <strong> QUALIFIED at Site B</strong> for routine GLP lot release testing.
        Site B may commence testing upon QA approval and sign-off on SOP-QC-CTLL2-SD-003 Rev 1.0.
      </P>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 09 — Regulatory Intelligence: Landscape Analysis
   ═══════════════════════════════════════════════════════════════ */
const s09: ReactNode = (
  <>
    <H t="1. Executive Summary" />
    <P>
      This Regulatory Landscape Analysis evaluates global regulatory pathways for allogeneic
      CAR-T cell therapies targeting CD19+ B-cell malignancies (DLBCL, ALL). Analysis uses
      exclusively publicly available agency guidance, published approval databases, and
      peer-reviewed literature — no FDA proprietary system access is utilized. Coverage:
      FDA/CBER (US), EMA/CAT (EU), PMDA (Japan), Health Canada, and ANVISA (Brazil).
      Key insight: FDA Breakthrough Therapy Designation (BTD) was granted to 4 of 7
      approved allogeneic programs — highest-value regulatory acceleration available.
    </P>

    <H t="2. Global Regulatory Pathway Comparison Matrix" />
    <table className="sdoc-table">
      <Th cols={['Jurisdiction', 'Pathway / Product Class', 'Key Guidance', 'Est. Timeline (IND→Approval)', 'Notable Precedents']} />
      <tbody>
        {([
          ['FDA / CBER (US)', 'BLA; RMAT, BTD, Fast Track, Accelerated Approval', 'CBER Cell Therapy Guidance 2023; ICH Q5E', '5–8 yr (standard); 2–4 yr (Accelerated Approval)', 'Kymriah® (BLA 125646); Yescarta® (BLA 125643); Breyanzi®'],
          ['EMA / CAT (EU)', 'ATMP — Centralised Procedure mandatory; PRIME designation', 'EMA/CAT ATMP Guideline EMEA/149995; GMP Annex 2A', '6–9 yr; PRIME: 4–6 yr', 'Carvykti® (EU/1/22/1639); Tecartus®'],
          ['PMDA (Japan)', 'RMPA — Sakigake Designation; early conditional approval', 'PMDA CAR-T Guidance (2020)', '5–7 yr; Sakigake review ~6 months post-submission', 'Kymriah® (approved 2019, Japan)'],
          ['Health Canada', 'NDS — Biologics; Priority Review + NOC/c pathway', 'HC Allogeneic Donor Eligibility; Biologics Regulations', '5–7 yr standard; Priority Review: 180-day clock', 'Kymriah® NOC (2018); Yescarta® NOC (2019)'],
          ['ANVISA (Brazil)', 'Biological product — Regime Especial (RDC 204/2017)', 'RDC 55/2010; IN 15/2015', '6–9 yr; Priority regime ~360-day review', 'Kymriah® ANVISA approval (2022)'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. Key Regulatory Themes & Strategic Observations" />
    <ul className="sdoc-list">
      <li><strong>CMC Manufacturing Complexity:</strong> Allogeneic manufacturing scale-up (donor variability, MCB characterization, batch consistency) is the most-cited regulatory interaction deficiency across all jurisdictions.</li>
      <li><strong>Long-Term Follow-Up (LTFU):</strong> FDA, EMA, and PMDA require minimum 15-year LTFU for gene-modified therapies — design LTFU registry into Phase 1 protocol from inception; retrofit is costly.</li>
      <li><strong>Expedited Pathway Stacking:</strong> BTD + RMAT combination offers comprehensive FDA development support: rolling review, increased meeting frequency, priority review voucher, and labeling input.</li>
      <li><strong>HLA Typing & Donor Eligibility:</strong> Jurisdictions diverge significantly — multi-region submissions require harmonized donor eligibility SOPs mapped to all applicable regulations simultaneously.</li>
    </ul>

    <H t="4. Strategic Recommendations" />
    <InfoBox>
      <ol className="sdoc-ol" style={{ marginBottom: 0 }}>
        <li>File for <strong>FDA Breakthrough Therapy Designation</strong> concurrently with Phase 1 IND — compelling preclinical evidence accepted for serious unmet need conditions.</li>
        <li>Seek <strong>EMA PRIME Designation</strong> in parallel — reduces EU timeline by 18–24 months via early scientific advice.</li>
        <li>Include 15-year LTFU clause in Phase 1 protocol from inception — satisfies FDA, EMA, and PMDA requirements simultaneously.</li>
        <li>Engage PMDA Sakigake pre-application consultation by end of Phase 1 — Japan approval supports ANVISA Priority Review pathway.</li>
      </ol>
    </InfoBox>
    <ApprovalBlock />
  </>
)

/* ═══════════════════════════════════════════════════════════════
   SERVICE 10 — AI-Assisted Regulatory Research Report
   ═══════════════════════════════════════════════════════════════ */
const s10: ReactNode = (
  <>
    <H t="1. Analysis Methodology" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Documents Analyzed:</strong> 52 FDA CDER/CDRH/CBER Guidance Documents (2020–2024) — all publicly available via FDA.gov<br />
        <strong>Objective:</strong> Identify emerging compliance requirements and thematic shifts relevant to Advanced Therapy Medicinal Products (ATMPs) and complex biologics<br />
        <strong>AI Pipeline:</strong> GPT-4o (thematic extraction) + Custom regulatory NLP classifier (trained on ICH/FDA corpus) + BERTopic topic modeling<br />
        <strong>Note:</strong> All analysis performed exclusively on publicly available documents — no proprietary or FDA-restricted data sources accessed
      </p>
    </InfoBox>

    <H t="2. Top Emerging Themes Across 52 Guidance Documents" />
    <table className="sdoc-table">
      <Th cols={['Emerging Theme', 'Doc Count', 'Key Guidance References', 'Compliance Implication', 'Urgency']} />
      <tbody>
        {([
          ['Data Integrity & Audit Trail (Digital Systems)', '14 / 52', 'FDA DI Guidance 2018; 21 CFR Part 11; MHRA GxP Ref.', 'All electronic systems in regulated submissions must have 21 CFR Part 11-compliant audit trails; AI tools require additional validation', <span key="t1" className="sdoc-high">HIGH</span>],
          ['AI/ML Software as a Medical Device (AI-SaMD)', '11 / 52', 'FDA AI/ML Action Plan (2021); PCCP Guidance (2023)', 'AI-based decision support in devices requires Predetermined Change Control Plans (PCCP); transparency documentation required', <span key="t2" className="sdoc-high">HIGH</span>],
          ['Real-World Data (RWD) / Real-World Evidence (RWE)', '9 / 52', 'FDA RWD/RWE Framework (2018); DCT Guidance (2023)', 'RWD accepted for label expansion + rare disease — but source verification and data quality standards rising rapidly', <span key="t3" className="sdoc-med">MEDIUM</span>],
          ['Advanced Manufacturing (CM, Digital Twins)', '8 / 52', 'FDA Advanced Mfg. Pilot (2023); ICH Q13', 'ICH Q13 finalized — CM adopters must include PAT strategy and real-time release testing approach', <span key="t4" className="sdoc-med">MEDIUM</span>],
          ['Post-Market Safety Surveillance (PMSS) for Biologics', '5 / 52', '21 CFR 314.81; FDA FAERS; Sentinel System', 'Enhanced REMS + post-approval studies increasingly required; AI pharmacovigilance signal detection expected in PSUR/PBRER', <span key="t5" className="sdoc-med">MEDIUM</span>],
          ['Environmental Sustainability in CMC', '5 / 52', 'FDA Drug Shortages; ICH Q3D (Elemental Impurities)', 'Emerging expectation for lifecycle CMC to address solvent selection, elemental impurity reduction, and supply chain resilience', <span key="t6" className="sdoc-low">LOW–MEDIUM</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="3. AI-Extracted Cross-Document Compliance Gaps" />
    <table className="sdoc-table">
      <Th cols={['Identified Gap', 'Impacted Sections', 'ICH / FDA Reference', 'Risk Level']} />
      <tbody>
        {([
          ['No explicit AI/ML tool validation plan in BLA/NDA submissions using AI for data analysis', 'Module 2, Module 5 (CSRs)', 'FDA AI/ML Action Plan; ICH E6(R3) GCP', <span key="g1" className="sdoc-high">HIGH</span>],
          ['RWD sources lack standardized provenance documentation', 'Module 2.7 (Clinical Summary)', 'FDA RWD Framework; 21 CFR §312', <span key="g2" className="sdoc-high">HIGH</span>],
          ['CMC sections for continuous manufacturing lack ICH Q13-aligned process model documentation', 'Module 3 (Quality)', 'ICH Q13 (2022)', <span key="g3" className="sdoc-med">MEDIUM</span>],
          ['Post-approval safety plans for biologics do not reference Sentinel System integration', '21 CFR 314.81 Annual Report; PSUR', 'FDA Sentinel Initiative; ICH E2C(R2)', <span key="g4" className="sdoc-med">MEDIUM</span>],
          ['Complex combination product labeling lacks AI-decision transparency statements', 'Module 1 (Labeling)', 'FDA Transparency Guidance Draft (2023)', <span key="g5" className="sdoc-low">LOW</span>],
        ] as (string | JSX.Element)[][]).map(r => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>

    <H t="4. Recommendations" />
    <ol className="sdoc-ol">
      <li>Integrate an <strong>AI Tool Validation Annex</strong> into all BLA/NDA submissions where AI was used — document algorithm version, training data source, validation approach, and uncertainty quantification.</li>
      <li>Establish a <strong>RWD Data Provenance Standard</strong> for real-world evidence submissions: data source characterization, completeness assessment, and bias analysis as Module 2.7 appendices.</li>
      <li>Initiate <strong>ICH Q13 readiness assessment</strong> for any continuous/semi-continuous CMC manufacturing — gap to current guidance is significant; reviewers increasingly request Q13 alignment.</li>
      <li>Engage FDA in a <strong>pre-submission Type C meeting</strong> on AI/ML tool acceptance criteria before filing — current reviewer expectations are ahead of published guidance.</li>
    </ol>
    <ApprovalBlock />
  </>
)

/* ─── Master export ──────────────────────────────────────────────────── */
export const SERVICE_SAMPLES: ServiceSample[] = [
  { serviceNum: '01', docType: 'PRE-IND TYPE B MEETING BRIEFING DOCUMENT', docTitle: 'TXR-2241 (KRAS G12C Inhibitor) — Pre-IND Meeting Request: Phase 1 FIH Study', docNumber: 'BRD-2025-TXR001', version: 'Rev 1.0', date: '15 Jan 2025', classification: 'CONFIDENTIAL', content: s01 },
  { serviceNum: '02', docType: 'REMS PROGRAM DESIGN FRAMEWORK', docTitle: 'VITRALUX® (Systemic Retinoid) — Proposed REMS Program Design & Benefit-Risk Documentation', docNumber: 'REMS-DES-2025-003', version: 'Rev 2.0', date: '20 Feb 2025', classification: 'CONFIDENTIAL', content: s02 },
  { serviceNum: '03', docType: 'STANDARD OPERATING PROCEDURE', docTitle: 'SOP-HCS-042: Automated High-Content Screening — Cell Viability & Nuclear Morphology Assessment', docNumber: 'SOP-HCS-042', version: 'Rev 3.0', date: '01 Mar 2025', classification: 'INTERNAL — GLP CONTROLLED DOCUMENT', content: s03 },
  { serviceNum: '04', docType: '510(K) PREMARKET NOTIFICATION SUMMARY', docTitle: 'AuraScan™ Continuous Interstitial Glucose Monitor — Substantial Equivalence Summary', docNumber: 'K25-AURA-001', version: 'Rev 1.0', date: '10 Mar 2025', classification: 'PUBLIC SUMMARY (upon clearance)', content: s04 },
  { serviceNum: '05', docType: 'GMP QUALITY SYSTEM GAP ANALYSIS REPORT', docTitle: 'API Manufacturing Facility — 21 CFR Part 211 / ICH Q10 Gap Assessment', docNumber: 'QA-GAP-2025-012', version: 'Rev 1.0', date: '05 Feb 2025', classification: 'CONFIDENTIAL — ATTORNEY–CLIENT PRIVILEGED', content: s05 },
  { serviceNum: '06', docType: '28-DAY REPEAT-DOSE TOXICOLOGY STUDY SUMMARY', docTitle: 'TXR-2241 — Oral Gavage Repeat-Dose GLP Rat Study with 14-Day Recovery', docNumber: 'TOX-2025-R28-TXR001', version: 'Rev 1.0', date: '28 Feb 2025', classification: 'CONFIDENTIAL', content: s06 },
  { serviceNum: '07', docType: 'BIOASSAY VALIDATION REPORT', docTitle: 'NF-κB Luciferase Reporter Gene Potency Assay — Full Validation per ICH Q2(R2) / USP <1033>', docNumber: 'VAL-2025-BIO-019', version: 'Rev 1.0', date: '18 Mar 2025', classification: 'INTERNAL — GLP CONTROLLED DOCUMENT', content: s07 },
  { serviceNum: '08', docType: 'BIOASSAY TECHNOLOGY TRANSFER REPORT', docTitle: 'IL-2-Dependent CTLL-2 Potency Assay — Site A (R&D) to Site B (QC) Transfer Qualification Report', docNumber: 'TTR-2025-IL2-CTLL2-001', version: 'Rev 1.0', date: '22 Mar 2025', classification: 'INTERNAL — GLP CONTROLLED DOCUMENT', content: s08 },
  { serviceNum: '09', docType: 'REGULATORY PATHWAY LANDSCAPE ANALYSIS', docTitle: 'Allogeneic CAR-T Cell Therapies for B-Cell Malignancies — Global Regulatory Pathway Comparison (5 Jurisdictions)', docNumber: 'REG-INT-2025-007', version: 'Rev 1.1', date: '12 Mar 2025', classification: 'CONFIDENTIAL', content: s09 },
  { serviceNum: '10', docType: 'AI-ASSISTED REGULATORY DOCUMENT ANALYSIS REPORT', docTitle: 'Thematic Analysis of 52 FDA Guidance Documents (2020–2024) — Emerging ATMP Compliance Requirements', docNumber: 'AI-REG-2025-014', version: 'Rev 1.0', date: '24 Mar 2025', classification: 'CONFIDENTIAL', content: s10 },
]
