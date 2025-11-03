"use client";
import React, { useEffect, useState } from "react";
import TeamSection from "@/app/components/AboutUs/TeamsSection";
import SeoContentSection from "@/app/components/ContentDescription";
import OurStory from "@/app/components/AboutUs/OurStory";
import { CoreValues } from "@/app/components/AboutUs/CoreValues";
import { CTABanner } from "@/app/components/AboutUs/CTASection";
import { MissionVision } from "@/app/components/AboutUs/MissionVission";
import { CustomerCentricApproach } from "@/app/components/AboutUs/Customer-Approach";
import { WhyChooseUs } from "@/app/components/AboutUs/WhyUs";
import { getAbout } from "@/app/services/About/about.api";
import { Spinner } from "react-bootstrap";
export interface ImageContent {
  content: string;
  image?: string;
  altTag?: string;
}

export interface ApproachItem {
  heading: string;
  subheading?: string;
  image?: string;
  altTag?: string;
}

export interface CoreValueItem {
  heading: string;
  image?: string;
  altTag?: string;
}

export interface AboutPageType {
  _id?: string;
  story: ImageContent;
  mission: ImageContent;
  vision: ImageContent;
  approach: ApproachItem[];
  whyChooseUs: string; // HTML string from editor
  coreValues: CoreValueItem[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AboutUsPage() {
  const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
  const [about, setAbout] = useState<AboutPageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeo, setIsLoadingSeo] = useState(true);

  const fetchSeo = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seo/about-us`
      );
      const seoData = await res.json();
      setSeo(seoData);
      setIsLoadingSeo(false);
    } catch (error) {
      setSeo(null);
      setIsLoadingSeo(false);
    }
  };

  const fetchAbout = async () => {
    const data = await getAbout();
    setAbout(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSeo();
    fetchAbout();
  }, []);
  if (isLoading || isLoadingSeo)
    return (
      <div
        className="text-center position-relative d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner
          animation="border"
          role="status"
          style={{ width: "100px", height: "100px" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  if (!about) {
    return (
      <div
        className="text-center position-relative d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        No Data Found
      </div>
    );
  }

  return (
    <div className=" ">
      <OurStory
        content={about?.story.content}
        image={about?.story.image || ""}
        altTag={about?.story.altTag || ""}
      />
      <MissionVision
        contentMission={about?.mission.content}
        imageMission={about?.mission.image || ""}
        altTagMission={about?.mission.altTag || ""}
        contentVision={about?.vision.content}
        imageVision={about?.vision.image || ""}
        altTagVision={about?.vision.altTag || ""}
      />
      <CustomerCentricApproach approachData={about.approach} />
      <WhyChooseUs content={about.whyChooseUs} />
      <CoreValues coreValues={about.coreValues} />
      <TeamSection />
      <CTABanner />
      {seo?.contentDescription && (
        <SeoContentSection contentDescription={seo?.contentDescription} />
      )}
    </div>
  );
}
