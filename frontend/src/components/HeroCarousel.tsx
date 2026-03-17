import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  img: string;
  tag?: string;
};

const slides: Slide[] = [
  {
    title: "Makeup essentials",
    subtitle: "Base, blush, and glow—everyday staples.",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=80",
    tag: "NEW",
  },
  {
    title: "Skincare heroes",
    subtitle: "Cleansers, serums, moisturizers & SPF.",
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1800&q=80",
    tag: "TRENDING",
  },
  {
    title: "Fragrance & body",
    subtitle: "Soft scents and silky finishes.",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&q=80",
    tag: "EDITOR'S PICK",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div key={s.title} className="min-w-0 flex-[0_0_100%]">
              <div className="relative h-[220px] sm:h-[280px] md:h-[320px]">
                <img
                  src={s.img}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-6 sm:p-8 flex items-end">
                  <div className="max-w-xl text-white">
                    {s.tag ? (
                      <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                        {s.tag}
                      </div>
                    ) : null}
                    <div className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
                      {s.title}
                    </div>
                    <div className="mt-2 text-sm sm:text-base text-white/85">
                      {s.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase">
            Featured
          </span>
          <span className="gradient-text text-sm font-bold tracking-wide sm:text-base">
            Skincare, makeup & more — explore below
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                selectedIndex === i ? "bg-foreground scale-110" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

