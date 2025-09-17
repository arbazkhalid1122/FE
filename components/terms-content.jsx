"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import api from "@/lib/axios";

export function TermsContent({ activeSection, setActiveSection, setSectionProgress, setIndicatorTop, setIndicatorHeight }) {

  console.log("activeSection", activeSection); const [agreed, setAgreed] = useState(false)
  const router = useRouter()

  const sections = [
    { num: "1", title: "Introduction", id: "introduction" },
    { num: "2", title: "User Responsibilities", id: "user-responsibilities" },
    { num: "3", title: "Platform Usage", id: "platform-usage" },
    { num: "4", title: "Fund Transactions", id: "fund-transactions" },
    { num: "5", title: "Termination & Suspension", id: "termination-suspension" },
    { num: "6", title: "Liability & Indemnification", id: "liability-indemnification" },
    { num: "7", title: "Change to Terms", id: "change-to-terms" },
  ]

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    const lastSection = document.getElementById("change-to-terms");
    const blocker = document.getElementById("scroll-blocker");

    if (lastSection && blocker) {
      const lastBottom = lastSection.offsetTop + lastSection.offsetHeight;
      const blockerTop = blocker.offsetTop;

      // If user scrolls into or beyond the blocker, snap them back
      if (scrollTop + windowHeight > blockerTop) {
        window.scrollTo({
          top: lastBottom - windowHeight + 50, // +50 for padding
          behavior: "smooth",
        });
        return;
      }
    }

    // --- Keep your existing scroll progress logic ---
    const sectionElements = sections
      .map((section) => ({
        ...section,
        element: document.getElementById(section.id),
      }))
      .filter((item) => item.element);

    let currentActiveSection = "1";

    sectionElements.forEach((section) => {
      if (!section.element) return;
      const rect = section.element.getBoundingClientRect();
      const isInView =
        rect.top < windowHeight * 0.6 &&
        rect.bottom > windowHeight * 0.3 &&
        window.scrollY > 100;

      if (isInView) {
        currentActiveSection = section.num;
      }
    });

    setActiveSection(currentActiveSection);

    const currentSectionIndex = sections.findIndex(
      (s) => s.num === currentActiveSection
    );
    const totalSections = sections.length;
    const baseProgress = (currentSectionIndex / totalSections) * 100;

    let sectionInternalProgress = 0;
    const currentSectionElement = document.getElementById(
      sections[currentSectionIndex]?.id
    );

    if (currentSectionElement) {
      const rect = currentSectionElement.getBoundingClientRect();
      const containerOffsetTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const sectionTop = rect.top + containerOffsetTop;
      const relativeTop = sectionTop - 250;

      setIndicatorTop(relativeTop);
      setIndicatorHeight(rect.height);

      if (rect.top <= windowHeight * 0.5) {
        sectionInternalProgress = Math.min(
          1,
          Math.max(0, (windowHeight * 0.5 - rect.top) / rect.height)
        );
      }
    }

    const progressPerSection = 100 / totalSections;
    const totalProgress =
      baseProgress + sectionInternalProgress * progressPerSection;

    setSectionProgress(Math.min(100, Math.max(0, totalProgress)));
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [setActiveSection, setSectionProgress, setIndicatorTop, setIndicatorHeight]);

  const handleAcceptTerms = async() => {
    await api.put('auth/user', { agreedTerms: true })
    window.location.href = "/dashboard"
  }

  const handleDecline = () => {
    router.push("/validate-access-code")
  }

  const getSectionTitleColor = (sectionNum) => {
    return sectionNum === activeSection ? "text-[#03a84e]" : "text-[#272635]"
  }

  return (
    <div className="flex-1 p-4 sm:p-8 lg:p-24 bg-white">
      <div className="max-w-4xl pb-40">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#272635] mb-2">
          Read and agree the EnvoyX fund manager terms of service
        </h1>
        <p className="text-[#5f6057] mb-6 sm:mb-8">Last updated: 30th March, 2025.</p>

        <div className="space-y-8">
          <section id="introduction">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("1")}`}>
              7.1 Introduction
            </h2>
            <p className="text-[#272635] leading-relaxed">
              By using the EnvoyX Financial Manager Platform, you agree to comply with these Terms of Service ("Terms").
              These Terms govern your access to and use of the platform, including all features, functionalities, and
              services provided
            </p>
          </section>

          <section id="user-responsibilities">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("2")}`}>
              7.2 User Responsibilities
            </h2>
            <ul className="space-y-2 text-[#272635]">
              <li>• Users must provide accurate and complete information during onboarding.</li>
              <li>• Users are responsible for maintaining the security of their accounts.</li>
              <li>• Users must comply with all applicable financial regulations and compliance requirements.</li>
            </ul>
          </section>

          <section id="platform-usage">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("3")}`}>
              7.3 Platform Usage
            </h2>
            <ul className="space-y-2 text-[#272635]">
              <li>
                • EnvoyX facilitates invoice verification and financial transactions but does not guarantee the
                creditworthiness of invoices.
              </li>
              <li>
                • Any financial decisions based on the platform's verification results are the sole responsibility of
                the financial institution.
              </li>
            </ul>
          </section>

          <section id="fund-transactions">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("4")}`}>
              7.4 Fund Transactions
            </h2>
            <ul className="space-y-2 text-[#272635]">
              <li>• All transactions made via the platform are subject to verification and approval workflows.</li>
              <li>• Users must ensure sufficient funds in their EnvoyX wallets before approving payments.</li>
              <li>
                • EnvoyX is not liable for any financial losses incurred due to user decisions or fraudulent invoices.
              </li>
            </ul>
          </section>

          <section id="termination-suspension">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("5")}`}>
              7.5 Termination & Suspension
            </h2>
            <ul className="space-y-2 text-[#272635]">
              <li>• EnvoyX reserves the right to suspend or terminate access to any user violating these Terms.</li>
              <li>• Financial institutions may request account closure by providing written notice.</li>
            </ul>
          </section>

          <section id="liability-indemnification">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("6")}`}>
              7.6 Liability & Indemnification
            </h2>
            <ul className="space-y-2 text-[#272635]">
              <li>• EnvoyX is not responsible for financial losses resulting from misinterpretation of data.</li>
              <li>
                • Users agree to indemnify EnvoyX against any claims, liabilities, or damages arising from their use of
                the platform.
              </li>
            </ul>
          </section>

          <section id="change-to-terms">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${getSectionTitleColor("7")}`}>
              7.7 Changes to Terms
            </h2>
            <p className="text-[#272635] leading-relaxed">
              EnvoyX reserves the right to modify these Terms at any time. Users will be notified of significant
              changes.
            </p>
          </section>
        </div>

        <div className="mt-6 rounded-lg">
          <div className="flex items-start gap-2 py-4 border-b border-[#E4E4E7] mb-4">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-[#03a84e]"
            />
            <label htmlFor="agree" className="text-sm text-[#5f6057]">
              By continuing you agree to EnvoyX{" "}
              <a href="#" className="text-[#03a84e] hover:underline">
                Terms of Service and Privacy Policy
              </a>
              .
            </label>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button variant="outline" className="p-5 bg-transparent order-2 sm:order-1" onClick={handleDecline}>
              Decline
            </Button>
            <Button
              className="bg-[#081f24] hover:bg-[#0d2c0d] text-white p-5 order-1 sm:order-2"
              onClick={handleAcceptTerms}
              disabled={!agreed}
            >
              Accept & proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
