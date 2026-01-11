"use client";

import { useState } from "react";
import { WizardHero } from "@/components/wizard/Hero";
import { ProgressNav } from "@/components/wizard/ProgressNav";
import { LiveSection } from "@/components/wizard/LiveSection";
import { LeisureSection } from "@/components/wizard/LeisureSection";
import { WorkSection } from "@/components/wizard/WorkSection";
import { ReviewSection } from "@/components/wizard/ReviewSection";
import styles from "./wizard.module.css";

export default function PackageWizardPage() {
  const [liveData, setLiveData] = useState<any>(null);
  const [leisureData, setLeisureData] = useState<any>(null);
  const [workData, setWorkData] = useState<any>(null);

  const handleLiveContinue = (data: any) => {
    setLiveData(data);
    // Scroll to next section
    setTimeout(() => {
      document.getElementById("section-leisure")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleLeisureContinue = (data: any) => {
    setLeisureData(data);
    // Scroll to next section
    setTimeout(() => {
      document.getElementById("section-work")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleWorkContinue = (data: any) => {
    setWorkData(data);
    // Scroll to review section
    setTimeout(() => {
      document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <main className={styles.wizardPage}>
      <WizardHero />
      <ProgressNav />
      <LiveSection onContinue={handleLiveContinue} />
      <LeisureSection onContinue={handleLeisureContinue} />
      <WorkSection onContinue={handleWorkContinue} />
      <ReviewSection
        liveData={liveData}
        leisureData={leisureData}
        workData={workData}
      />
    </main>
  );
}

