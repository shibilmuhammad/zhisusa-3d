"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { WorkHero } from "@/components/work/Hero";
import { WorkspaceComparison } from "@/components/work/WorkspaceComparison";
import { BookingWorkSection } from "@/components/work/BookingWorkSection";
import "./work.css";

export default function WorkPage() {
  return (
    <div className="work-page">
      <PageHeader currentPage="work" pageTitle="Work at ZHISUSA" />
      
      <WorkHero />
      <WorkspaceComparison />
      <BookingWorkSection />

      {/* Footer */}
      <div className="work-page__footer">
        <a href="/" className="work-page__back-link">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}


