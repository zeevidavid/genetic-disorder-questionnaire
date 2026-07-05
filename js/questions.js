const questionnaire = [
  /* =========================
   SECTION A: CLINICAL SEVERITY
   ========================= */

  {
    id: "A1",
    section: "Clinical Severity",
    title: "Life Expectancy",
    question: "Does the disorder shorten life expectancy?",
    help: "Consider mortality directly attributable to the disorder.",
    lowLabel: "No effect",
    highLabel: "Severely reduced / early death",
    required: true,
    comments: true,
  },

  {
    id: "A2",
    section: "Clinical Severity",
    title: "Age of Onset",
    question: "What is the typical age of onset?",
    help: "Earlier onset generally indicates higher severity.",
    lowLabel: "Adulthood",
    highLabel: "Neonatal / infancy",
    required: true,
    comments: true,
  },

  {
    id: "A3",
    section: "Clinical Severity",
    title: "Functional Disability",
    question: "Does the disorder cause significant physical disability?",
    lowLabel: "None or mild",
    highLabel: "Severe lifelong disability",
    required: true,
    comments: true,
  },

  {
    id: "A4",
    section: "Clinical Severity",
    title: "Cognitive Impairment",
    question: "Is there associated intellectual or cognitive impairment?",
    lowLabel: "None",
    highLabel: "Severe intellectual disability",
    required: true,
    comments: true,
  },

  {
    id: "A5",
    section: "Clinical Severity",
    title: "Chronic Disease Burden",
    question: "Is long-term medical management required?",
    lowLabel: "Minimal",
    highLabel: "High lifelong burden",
    required: true,
    comments: true,
  },

  {
    id: "A6",
    section: "Clinical Severity",
    title: "Quality of Life",
    question: "How severely is quality of life impacted?",
    lowLabel: "Minimal impact",
    highLabel: "Severely reduced QoL",
    required: true,
    comments: true,
  },

  {
    id: "A7",
    section: "Clinical Severity",
    title: "Penetrance",
    question: "Is penetrance high among homozygous individuals?",
    lowLabel: "Low / variable",
    highLabel: "Complete penetrance",
    required: true,
    comments: true,
  },

  {
    id: "A8",
    section: "Clinical Severity",
    title: "Treatment Availability",
    question: "Is there an effective and practical treatment?",
    help: "Effective gene/diet/drug therapy reduces severity score.",
    lowLabel: "Effective treatment exists",
    highLabel: "No effective treatment",
    required: true,
    comments: true,
  },

  /* =========================
   SECTION B: PATHOGENICITY EVIDENCE
   ========================= */

  {
    id: "B1",
    section: "Pathogenicity Evidence",
    title: "Affected Families",
    question:
      "How many unrelated families show the same genotype-phenotype association?",
    lowLabel: "1 family",
    highLabel: "10+ independent families",
    required: true,
    comments: true,
  },

  {
    id: "B2",
    section: "Pathogenicity Evidence",
    title: "Segregation Evidence",
    question: "Does the variant segregate with disease in families?",
    lowLabel: "No segregation",
    highLabel: "Strong segregation across generations",
    required: true,
    comments: true,
  },

  {
    id: "B3",
    section: "Pathogenicity Evidence",
    title: "Functional Evidence",
    question: "Is there experimental functional validation?",
    lowLabel: "None",
    highLabel: "Strong functional confirmation",
    required: true,
    comments: true,
  },

  {
    id: "B4",
    section: "Pathogenicity Evidence",
    title: "Independent Replication",
    question: "Has the finding been replicated by independent groups?",
    lowLabel: "No",
    highLabel: "Multiple independent studies",
    required: true,
    comments: true,
  },

  {
    id: "B5",
    section: "Pathogenicity Evidence",
    title: "Genotype-Phenotype Consistency",
    question: "Is the phenotype consistent across homozygous carriers?",
    lowLabel: "Highly variable",
    highLabel: "Highly consistent",
    required: true,
    comments: true,
  },

  {
    id: "B6",
    section: "Pathogenicity Evidence",
    title: "Population Data Consistency",
    question: "Is the variant absent or extremely rare in healthy controls?",
    lowLabel: "Common in population",
    highLabel: "Absent / ultra-rare",
    required: true,
    comments: true,
  },

  {
    id: "B7",
    section: "Pathogenicity Evidence",
    title: "Homozygous Controls",
    question:
      "Are there unaffected homozygous individuals in population databases?",
    lowLabel: "Many healthy homozygotes",
    highLabel: "No healthy homozygotes",
    required: true,
    comments: true,
  },

  {
    id: "B8",
    section: "Pathogenicity Evidence",
    title: "Literature Support",
    question: "Is the disorder well characterized in scientific literature?",
    lowLabel: "Poorly described",
    highLabel: "Extensively described",
    required: true,
    comments: true,
  },

  /* =========================
   SECTION C: SCREENING UTILITY
   ========================= */

  {
    id: "C1",
    section: "Screening Utility",
    title: "Carrier Frequency",
    question: "What is the carrier frequency in the target population?",
    lowLabel: "Extremely rare",
    highLabel: "Relatively common",
    required: true,
    comments: true,
  },

  {
    id: "C2",
    section: "Screening Utility",
    title: "Variant Frequency Interpretation",
    question:
      "Does observed variant frequency support pathogenic recessive model?",
    lowLabel: "Too common (unlikely pathogenic)",
    highLabel: "Compatible with pathogenic founder variant",
    required: true,
    comments: true,
  },

  {
    id: "C3",
    section: "Screening Utility",
    title: "Expected Carrier Couples",
    question: "Estimated number of at-risk couples in population?",
    lowLabel: "Negligible",
    highLabel: "High expected burden",
    required: true,
    comments: true,
  },

  {
    id: "C4",
    section: "Screening Utility",
    title: "Clinical Demand",
    question: "How many families have requested clinical assistance?",
    lowLabel: "None",
    highLabel: "Many independent requests",
    required: true,
    comments: true,
  },
];
