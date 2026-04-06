# Content Cluster Blueprint — tacklersconsulting.com

---

## Cluster Architecture Overview

Content clusters group related pages around a pillar page, connected by internal links. Each cluster targets a keyword family and establishes topical authority for that theme.

---

## Cluster 1: Operational Excellence

### Pillar page
`/operational-excellence-consulting-uk` (existing — expand)

### Cluster pages
| Page | Type | Status |
|------|------|--------|
| 7 service detail pages | Service | Existing — expand |
| "What Is Operational Excellence?" blog post | Blog pillar | **Create** |
| "Operational Excellence Framework" blog post | Blog pillar | **Create** |
| Case study (sector-relevant) | Case study | **Create** |

### Internal link map
```
/operational-excellence-consulting-uk (pillar)
├── → /services/business-process-management-consulting-uk
├── → /services/cost-management-consulting-uk
├── → /services/executive-leadership-coaching-operations
├── → /services/productivity-improvement-consulting-uk
├── → /services/supplier-quality-development-consulting
├── → /services/strategy-deployment-consulting-uk
├── → /services/project-management-for-transformation
├── → /blog/what-is-operational-excellence
├── → /blog/operational-excellence-framework
└── → /case-studies/[relevant]

Each service page ← → 2–3 sibling service pages
Each service page → /discovery-call
Blog posts → pillar page + 1 service page + /discovery-call
```

---

## Cluster 2: Lean Transformation

### Pillar page
`/lean-transformation-consulting-uk` (**NEW**)

### Cluster pages
| Page | Type | Status |
|------|------|--------|
| "Why Lean Transformation Fails" blog post | Blog | **Create** |
| "How to Sustain Lean Improvements" blog post | Blog | **Create** |
| BPM service page | Service | Existing (cross-link) |
| Productivity service page | Service | Existing (cross-link) |
| Cost Management service page | Service | Existing (cross-link) |
| Case study (transformation-focused) | Case study | **Create** |

### Internal link map
```
/lean-transformation-consulting-uk (pillar)
├── → /blog/why-lean-transformation-fails
├── → /blog/how-to-sustain-lean-improvements
├── → /services/business-process-management-consulting-uk
├── → /services/productivity-improvement-consulting-uk
├── → /services/cost-management-consulting-uk
├── → /case-studies/[relevant]
└── → /discovery-call

Blog posts → pillar page + 1 service page + /discovery-call
```

---

## Cluster 3: Gemba & Methodology

### Pillar page
`/gemba-consulting` (**NEW**)

### Cluster pages
| Page | Type | Status |
|------|------|--------|
| "What Is Gemba?" blog post | Blog pillar | **Create** |
| "Gemba Walk Checklist" blog post | Blog tool guide | **Create** |
| "Lean Daily Management" blog post | Blog | **Create** |
| On-site assessment page | Conversion | Existing (cross-link) |
| Case study (Gemba-focused) | Case study | **Create** |

### Internal link map
```
/gemba-consulting (pillar)
├── → /blog/what-is-gemba-walk
├── → /blog/gemba-walk-checklist
├── → /blog/lean-daily-management
├── → /on-site-assessment
├── → /case-studies/[relevant]
└── → /discovery-call

Blog posts → pillar page + /on-site-assessment + /discovery-call
```

---

## Cluster 4: Continuous Improvement

### Pillar page
`/continuous-improvement-consulting-uk` (**NEW**)

### Cluster pages
| Page | Type | Status |
|------|------|--------|
| "Continuous Improvement Framework" blog post | Blog pillar | **Create** |
| "Kaizen Events" blog post | Blog tool guide | **Create** |
| "Standard Work" blog post | Blog tool guide | **Create** |
| "Value Stream Mapping Guide" blog post | Blog pillar | **Create** |
| Productivity service page | Service | Existing (cross-link) |
| BPM service page | Service | Existing (cross-link) |

### Internal link map
```
/continuous-improvement-consulting-uk (pillar)
├── → /blog/continuous-improvement-framework
├── → /blog/kaizen-events
├── → /blog/standard-work
├── → /blog/value-stream-mapping-guide
├── → /services/productivity-improvement-consulting-uk
├── → /services/business-process-management-consulting-uk
└── → /discovery-call

Blog posts → pillar page + 1 related blog + 1 service page + /discovery-call
```

---

## Cluster 5: Training & Capability

### Pillar page
`/lean-training-uk` (existing — expand)

### Cluster pages
| Page | Type | Status |
|------|------|--------|
| "Lean Leadership Principles" blog post | Blog | **Create** |
| "How to Build Internal Lean Capability" blog post | Blog | **Create** |
| "Lean Coaching for Managers" blog post | Blog | **Create** |
| Book training page | Conversion | Existing (link from pillar) |
| Executive coaching service page | Service | Existing (cross-link) |

### Internal link map
```
/lean-training-uk (pillar)
├── → /book-lean-training
├── → /blog/lean-leadership-principles
├── → /blog/build-internal-lean-capability
├── → /blog/lean-coaching-for-managers
├── → /services/executive-leadership-coaching-operations
└── → /discovery-call

Blog posts → pillar page + /book-lean-training + /discovery-call
```

---

## Cluster 6: Industry Expertise

### Hub page
`/industries` (**NEW**)

### Cluster pages (6 industry pages + 6 industry blog posts)
| Page | Type | Status |
|------|------|--------|
| 6 industry pages | Industry | Existing — expand |
| 6 industry-specific blog posts | Blog | **Create** |
| Industry-relevant case studies | Case study | **Create** |

### Internal link map
```
/industries (hub)
├── → /industries/aerospace-defence-operational-excellence
│   ├── → /blog/lean-in-aerospace
│   ├── → /services/supplier-quality-development-consulting
│   └── → /case-studies/[aerospace-case]
├── → /industries/healthcare-life-sciences-process-improvement
│   ├── → /blog/healthcare-process-improvement
│   ├── → /services/business-process-management-consulting-uk
│   └── → /case-studies/[healthcare-case]
├── → /industries/energy-sector-operational-improvement
│   ├── → /blog/energy-sector-operational-improvement
│   └── → /services/cost-management-consulting-uk
├── → /industries/public-sector-lean-transformation
│   ├── → /blog/lean-in-public-sector
│   └── → /services/strategy-deployment-consulting-uk
├── → /industries/it-services-lean-operations
│   ├── → /blog/lean-for-it-services
│   └── → /services/productivity-improvement-consulting-uk
└── → /industries/manufacturing-operational-excellence
    ├── → /blog/lean-manufacturing-uk
    ├── → /services/productivity-improvement-consulting-uk
    └── → /case-studies/[manufacturing-case]
```

---

## Cross-Cluster Links

Clusters should not be siloed. Key cross-cluster links:

| From cluster | To cluster | Link path |
|-------------|-----------|-----------|
| Operational Excellence | Gemba | Pillar → /gemba-consulting via "our Gemba approach" |
| Lean Transformation | Training | Blog posts → /lean-training-uk via "build capability" |
| Gemba | Continuous Improvement | Blog posts → CI pillar via "continuous improvement tools" |
| Training | Lean Transformation | Pillar → /lean-transformation-consulting-uk via "transformation consulting" |
| Industry | All service clusters | Each industry page → 2–3 service pages |
| All clusters | Case studies | Results/outcomes sections → relevant case study |
