import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutUs from "./AboutUs";
import CertifiedExcellence from "./CertifiedExcellence";
import KeyMilestones from "./KeyMilestones";
import { AboutSkeleton } from "../components/Skeleton";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const seo = (
    <Seo
      title="About Cybernest — Our Story, Milestones & Certifications"
      description="Cybernest Solutions is a Philippine technology company building workflow automation and digital transformation products. Meet the team, milestones, and certifications behind our work."
      path="/about"
      breadcrumbs={breadcrumbItems}
    />
  );

  if (loading) return <>{seo}<AboutSkeleton /></>;

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth">
      {seo}
      <NavBar />

      <main className="bg-white pt-32 sm:pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 mb-6 sm:mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <AboutUs />
        <KeyMilestones />
        <CertifiedExcellence />
      </main>

      <Footer />
    </div>
  );
}
