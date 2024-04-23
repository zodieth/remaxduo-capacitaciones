"use client";
import React from "react";
import Header from "./_components/header";
import Hero from "./_components/hero";
import { PropertyCarousel } from "./_components/propertycarousel";
import Footer from "./_components/footer";

function page() {
  return (
    <div>
      <Header />
      <Hero />
      <PropertyCarousel />
      <Footer />
    </div>
  );
}

export default page;
