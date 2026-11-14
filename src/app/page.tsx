"use client";

import { Separator } from "@radix-ui/themes";
import Hero from "@/app/components/Hero/Hero";
import LifterFeatures from "@/app/components/LifterFeatures/LifterFeatures";
import ReadyToLift from "@/app/components/ReadyToLift/ReadyToLift";
import Navbar from "@/app/components/Navbar/Navbar";
import { useRouteProtection } from "@/app/lib/useRouteProtection";

export default function Home() {
  useRouteProtection();

  return (
    <div>
      <Navbar />
      <Hero />
      <Separator size="4" style={{ maxWidth: "var(--container-4)", display: "flex", margin: "0 auto", padding: "0 1rem" }}/>
      <LifterFeatures />
      <Separator size="4" style={{ maxWidth: "var(--container-4)", display: "flex", margin: "0 auto", padding: "0 1rem" }}/>
      <ReadyToLift />
      <Separator size="4" style={{ maxWidth: "var(--container-4)", display: "flex", margin: "0 auto", padding: "0 1rem" }}/>
    </div>
  );
}