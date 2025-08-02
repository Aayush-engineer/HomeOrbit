import React from "react";
import FooterSection from "./FooterSection";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
