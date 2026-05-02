import { Link } from "react-router-dom";
import { ArrowRight, CalendarFold, CheckCircle2 } from "lucide-react";
import { projects, type Project } from "../data/projects";

function ProjectCard({ project }: { project: Project }) {
  const detailHref = `/products/projects/${project.slug}`;
  return (
    <div
      data-aos="fade-up"
      className="bg-white rounded-[24px] shadow-[0px_4px_20px_0px_rgba(220,61,80,0.10)] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6"
    >
      <div className="relative shrink-0 w-full sm:w-[230px] lg:w-[260px] aspect-square rounded-2xl bg-cyberlightred overflow-hidden">
        <img
          src={project.mockup}
          alt={`${project.name} laptop mockup`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain scale-[1.35]"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-3">
        <h3 className="text-xl sm:text-2xl font-bold text-cyberred leading-tight">
          {project.name}
        </h3>
        <p className="text-sm text-[#3f3f3f] leading-snug">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {project.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-full bg-cyberlightred px-3 py-2"
            >
              <CheckCircle2
                className="w-4 h-4 text-cyberred shrink-0"
                strokeWidth={2}
              />
              <span className="text-[#473c59] text-xs leading-tight">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3 mt-2">
          <span className="text-sm sm:text-base text-[#3f3f3f]">Powered By:</span>
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            {project.poweredBy.map((logo, i) => {
              const img = (
                <picture className="inline-flex items-center">
                  {logo.avif && <source srcSet={logo.avif} type="image/avif" />}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-9 sm:h-10 w-auto object-contain"
                  />
                </picture>
              );
              return logo.href ? (
                <Link
                  key={i}
                  to={logo.href}
                  aria-label={`Learn more about ${logo.alt}`}
                  className="inline-flex items-center hover:opacity-80 transition"
                >
                  {img}
                </Link>
              ) : (
                <span key={i}>{img}</span>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-11 sm:h-12 bg-cyberred text-white rounded-xl font-bold text-base hover:opacity-90 transition shadow-sm"
            >
              <CalendarFold className="w-[18px] h-[18px]" strokeWidth={2} />
              View Website
            </a>
          )}
          <Link
            to={detailHref}
            className="inline-flex items-center justify-center gap-2 w-full h-11 sm:h-12 border-2 border-cyberred text-cyberred rounded-xl font-bold text-base hover:bg-cyberred/5 transition"
          >
            See More
            <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsCompleted() {
  return (
    <section
      aria-labelledby="projects-completed-title"
      className="mt-16 sm:mt-24 lg:mt-32"
    >
      <h2
        id="projects-completed-title"
        data-aos="fade-up"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-cyberred mb-3 sm:mb-4"
      >
        Projects Completed
      </h2>
      <p
        data-aos="fade-up"
        data-aos-delay="100"
        className="text-sm sm:text-base md:text-lg lg:text-2xl text-[#3f3f3f] max-w-[1258px] mb-10 sm:mb-14"
      >
        Explore our tailored, comprehensive development packages designed to
        accelerate your unique digital growth journey.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
