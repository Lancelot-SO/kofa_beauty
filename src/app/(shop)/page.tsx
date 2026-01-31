import { Hero } from "@/components/home/Hero";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { EssentialsDrop } from "@/components/home/EssentialsDrop";
import { Tutorials } from "@/components/home/Tutorials";
import { BundleOffer } from "@/components/home/BundleOffer";
import { BrandStory } from "@/components/home/BrandStory";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProduct />
      <EssentialsDrop />
      <Tutorials />
      <BundleOffer />
      <BrandStory />
      <Newsletter />
    </>
  );
}
