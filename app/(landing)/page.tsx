"use client";
import React from "react";
import Header from "./_components/header";
import Hero from "./_components/hero";
import { PropertyCarousel } from "./_components/propertycarousel";
import Footer from "./_components/footer";
import BeAgent from "./_components/beagent";

function page() {
  return (
    <div>
      <Header />
      <Hero />
      <PropertyCarousel />
      <BeAgent />
      <Footer />
    </div>
  );
}

export default page;
