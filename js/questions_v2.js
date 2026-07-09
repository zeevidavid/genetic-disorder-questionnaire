const questionnaire = [
  /* ==========================================================
   SECTION A — CLINICAL SEVERITY
========================================================== */

  {
    id: "A1",
    domain: "Mortality",
    section: "Clinical Severity",
    title: "Expected Age at Death",
    question: "Expected age at death (years)",
    help: "Estimate the typical untreated life expectancy attributable to this disorder.",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "≥65 years" },
      { score: 2, label: "40–65 years" },
      { score: 3, label: "20–40 years" },
      { score: 4, label: "<20 years" },
    ],
  },

  {
    id: "A2",
    domain: "Age of Onset",
    section: "Clinical Severity",
    title: "Age of Symptom Onset",
    question: "Typical age of first symptoms",
    help: "Earlier onset generally reflects greater clinical severity.",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Adult (>18 years)" },
      { score: 2, label: "Childhood (2–18 years)" },
      { score: 3, label: "Infancy (1 month–2 years)" },
      { score: 4, label: "Prenatal / Neonatal (<1 month)" },
    ],
  },

  {
    id: "A3",
    domain: "Physical Disability",
    section: "Clinical Severity",
    title: "Physical Disability",
    question: "Maximum lifetime physical disability",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "None or minimal limitation" },
      { score: 2, label: "Mild functional limitation" },
      { score: 3, label: "Requires significant assistance" },
      { score: 4, label: "Completely dependent / wheelchair or bedbound" },
    ],
  },

  {
    id: "A4",
    domain: "Neurodevelopment",
    section: "Clinical Severity",
    title: "Cognitive Impairment",
    question: "Degree of cognitive impairment",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "None" },
      { score: 2, label: "Mild learning impairment" },
      {
        score: 3,
        label: "Moderate intellectual disability / hearing OR vision loss",
      },
      {
        score: 4,
        label:
          "Severe / profound intellectual disability / hearing AND vision loss",
      },
    ],
  },

  {
    id: "A5",
    domain: "Medical Burden",
    section: "Clinical Severity",
    title: "Lifetime Medical Burden",
    question: "Lifetime medical management required",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Minimal follow-up" },
      { score: 2, label: "Regular outpatient management" },
      { score: 3, label: "Frequent specialist care" },
      {
        score: 4,
        label: "Continuous multidisciplinary care / recurrent hospitalization",
      },
    ],
  },

  {
    id: "A6",
    domain: "Quality of Life",
    section: "Clinical Severity",
    title: "Quality of Life",
    question: "Expected number of years from disease onset until death",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "<1 year>" },
      { score: 2, label: "1-5 years" },
      { score: 3, label: "5-20 years" },
      { score: 4, label: ">20 years" },
    ],
  },

  {
    id: "A7",
    domain: "Penetrance",
    section: "Clinical Severity",
    title: "Clinical Penetrance",
    question: "Penetrance among homozygous individuals",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "<50%" },
      { score: 2, label: "50–75%" },
      { score: 3, label: "75–99%" },
      { score: 4, label: "≥99%" },
    ],
  },

  {
    id: "A8",
    domain: "Treatment",
    section: "Clinical Severity",
    title: "Treatment Effectiveness",
    question: "Availability of effective disease-modifying therapy",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Highly effective treatment available" },
      { score: 2, label: "Partially effective treatment" },
      { score: 3, label: "Supportive treatment only" },
      { score: 4, label: "No effective therapy" },
    ],
  },

  /* ==========================================================
   SECTION B — PATHOGENICITY EVIDENCE
========================================================== */

  {
    id: "B1",
    domain: "Clinical Evidence",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Affected Families",
    question: "Number of unrelated affected families",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "1 family" },
      { score: 2, label: "2–4 families" },
      { score: 3, label: "5–9 families" },
      { score: 4, label: "≥10 families" },
    ],
  },

  {
    id: "B2",
    domain: "Segregation",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Segregation Evidence",
    question: "Strength of segregation evidence",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "None" },
      {
        score: 2,
        label: "Limited (1 family with <6 siblings and <2 healthy siblings)",
      },
      {
        score: 3,
        label:
          "Strong (1 family with >6 siblings and at least 2 healthy siblings)",
      },
      { score: 4, label: "Very strong across multiple pedigrees" },
    ],
  },

  {
    id: "B3",
    domain: "Functional Studies",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Functional Evidence",
    question: "Experimental functional validation",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "None" },
      { score: 2, label: "Supportive in vitro evidence" },
      { score: 3, label: "Strong functional (human or animal model) evidence" },
      { score: 4, label: "Both in vitro and in vivo evidence" },
    ],
  },

  {
    id: "B4",
    domain: "Replication",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Independent Replication",
    question: "Independent replication of findings",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Single report" },
      { score: 2, label: "2 independent groups" },
      { score: 3, label: "3–4 independent groups" },
      { score: 4, label: "≥5 independent groups" },
    ],
  },

  {
    id: "B5",
    domain: "Phenotype",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Phenotype Consistency",
    question:
      "Consistency of disease presentation among homozygous individuals",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Highly variable" },
      { score: 2, label: "Moderately variable" },
      { score: 3, label: "Mostly consistent" },
      { score: 4, label: "Highly consistent" },
    ],
  },

/*
  {
    id: "B6",
    domain: "Population Data",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Population Frequency",
    question: "Frequency of variant relative to live births with disease",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Common (>1:1000)" },
      { score: 2, label: "Rare (1:1,000-1:10,000)" },
      { score: 3, label: "Very rare (1:10,000-1:50,000)" },
      { score: 4, label: "Absent / ultra-rare (<1:50,000)" },
    ],
  },
*/
  {
    id: "B6",
    domain: "Population Data",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Healthy Homozygotes",
    question: "Unaffected homozygous individuals observed",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Many reported" },
      { score: 2, label: "Few reported" },
      { score: 3, label: "One uncertain report" },
      { score: 4, label: "None observed" },
    ],
  },

  {
    id: "B7",
    domain: "Literature",
    section: "Pathogenicity Evidence (confidence that variant causes disease)",
    title: "Literature Support",
    question: "Published characterization of the disorder",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Single publication" },
      { score: 2, label: "Several reports" },
      { score: 3, label: "Well characterized" },
      { score: 4, label: "Extensively characterized" },
    ],
  },

  /* ==========================================================
   SECTION C — SCREENING UTILITY
========================================================== */

  {
    id: "C1",
    domain: "Population Screening",
    section: "Screening Utility",
    title: "Carrier Frequency",
    question: "Carrier frequency in target population",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "<1 in 10,000" },
      { score: 2, label: "1 in 1,000–10,000" },
      { score: 3, label: "1 in 200–1,000" },
      { score: 4, label: ">1 in 200" },
    ],
  },

  {
    id: "C2",
    domain: "Founder Effect",
    section: "Screening Utility",
    title: "Variant Frequency Interpretation",
    question: "Compatibility with pathogenic autosomal recessive inheritance",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Incompatible" },
      { score: 2, label: "Weakly compatible" },
      { score: 3, label: "Compatible" },
      { score: 4, label: "Strong founder-effect evidence" },
    ],
  },

  {
    id: "C3",
    domain: "Population Impact",
    section: "Screening Utility",
    title: "Expected Carrier Couples",
    question: "Expected burden of at-risk couples (relevant for genes with multiple variants)",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "Very uncommon" },
      { score: 2, label: "Occasional" },
      { score: 3, label: "Moderately frequent" },
      { score: 4, label: "Common" },
    ],
  },

  {
    id: "C4",
    domain: "Clinical Demand",
    section: "Screening Utility",
    title: "Clinical Demand",
    question: "Demand for clinical testing",
    help: "",
    reference: "",
    required: true,
    comments: true,
    weight: 1,
    rubric: [
      { score: 1, label: "None" },
      { score: 2, label: "Occasional referrals" },
      { score: 3, label: "Regular referrals" },
      { score: 4, label: "High sustained demand" },
    ],
  },
];
