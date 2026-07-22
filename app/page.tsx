import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
} from "@/features/home";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
