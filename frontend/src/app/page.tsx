"use client";
import React from "react";
import Navbar from "@/components/UI/Navbar";
import CouponScroller from "@/components/UI/CouponScroller";
import CinematicStoryHero from "@/components/Sections/CinematicStoryHero";
import StoryJourney from "@/components/Sections/StoryJourney";
import BuffaloGheeBenefits from "@/components/Sections/BuffaloGheeBenefits";
import Showcase3D from "@/components/Sections/Showcase3D";
import FarmerStories from "@/components/Sections/FarmerStories";
import Footer from "@/components/UI/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <CinematicStoryHero />
      <CouponScroller />
      <StoryJourney />
      <BuffaloGheeBenefits />
      <Showcase3D />
      <FarmerStories />
      <CouponScroller />
      <Footer />
    </main>
  );
}
