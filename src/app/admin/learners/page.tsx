import { PortalIntro, PortalList, PortalPanel } from "@/components/training-portal/portal-primitives";

const learnerSignals = [
  {
    meta: "Lean Fundamentals Cohort A • Attendance 100%",
    note: "Ready for Module 4. Completed prework and passed the previous knowledge check.",
    status: "Healthy",
    title: "Priya S.",
  },
  {
    meta: "Lean Leader Cohort B • Attendance 75%",
    note: "Missed the last coaching clinic and still needs feedback on the practical assignment.",
    status: "At risk",
    title: "Michael R.",
  },
  {
    meta: "Continuous Improvement Bootcamp • New enrollee",
    note: "Needs onboarding, sponsor approval, and initial confidence baseline before launch.",
    status: "Needs setup",
    title: "Amina K.",
  },
];

export default function AdminLearnersPage() {
  return (
    <div className="space-y-10">
      <PortalIntro
        eyebrow="Learners"
        title="See who is on track and who needs intervention."
        description="A training admin view should expose learner readiness, attendance, assessment risk, and coaching actions instead of making teams infer all of that from generic profile and support pages."
      />

      <PortalPanel
        title="Learner health"
        description="Signals that should drive coaching, sponsor escalation, and support actions."
      >
        <PortalList items={learnerSignals} />
      </PortalPanel>
    </div>
  );
}
