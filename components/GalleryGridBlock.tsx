"use client";
import React, { KeyboardEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";

// Curated high-fashion & luxury runway sample images for HEBS Lagos
const galleryImages = [
  {
    id: 1,
    url: "https://unsplash.com",
    title: "High-Fashion Editorial Runway",
    category: "Runway",
  },
  {
    id: 2,
    url: "https://unsplash.com",
    title: "Precision Barbering Masterclass",
    category: "Barbering",
  },
  {
    id: 3,
    url: "https://unsplash.com",
    title: "Avant-Garde Glamour Makeup",
    category: "Makeup",
  },
  {
    id: 4,
    url: "https://unsplash.com",
    title: "Avant-Garde Hair Silhouette",
    category: "Hairstyling",
  },
  {
    id: 5,
    url: "https://unsplash.com",
    title: "Luxury Pre-Gala Showcase",
    category: "Runway",
  },
  {
    id: 6,
    url: "https://unsplash.com",
    title: "Elite Masterclass Masterminds",
    category: "Hairstyling",
  },
];

export default function GalleryGridBlock() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(galleryImages.map((img) => img.category)))];

  const filteredImages = filter === "All"
    ? galleryImages
    : galleryImages.filter((img) => img.category === filter);

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage);
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage);
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].id);
    }
  };

  const selectedImageData = galleryImages.find((img) => img.id === selectedImage);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, imageId: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedImage(imageId);
    }
  };

  return (
    <section className="w-full bg-[#050505] px-6 py-32 border-t border-neutral-900" id="gallery">
      <div className="mx-auto max-w-6xl">

        {/* Editorial Section Header Layout */}
        <div className="border-b border-neutral-900 pb-8 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-3">Visual Archive</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
              Relive the <span className="italic font-normal">Magic</span>
            </h2>
          </div>
          <p className="font-sans text-sm text-neutral-400 max-w-xs font-light leading-relaxed">
            A look back at the intense creativity, live championships, and energy defining the HEBS legacy.
          </p>
        </div>

        {/* Minimalist Filter Navigation Bar */}
        <div className="mb-12 flex flex-wrap gap-3 border-b border-neutral-900/60 pb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`font-sans text-xs uppercase tracking-wider px-4 py-2 transition-all rounded-xs border ${
                filter === category
                  ? "bg-white text-black border-white font-medium"
                  : "bg-transparent text-neutral-400 border-neutral-900 hover:text-white hover:border-neutral-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid Matrix */}
        <div className="grid gap-px bg-neutral-900 border border-neutral-900 overflow-hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(image.id)}
                onKeyDown={(e) => handleCardKeyDown(e, image.id)}
                role="button"
                tabIndex={0}
                className="group relative cursor-pointer overflow-hidden bg-[#050505] aspect-square outline-none"
              >
                <motion.img
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Premium Smooth Glass Overlay Mask */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300 p-6">
                  <ZoomIn className="mb-3 h-6 w-6 text-white font-light opacity-60" />
                  <h3 className="mb-2 text-center font-serif text-xl font-light text-white">
                    {image.title}
                  </h3>
                  <span className="font-sans text-[9px] uppercase tracking-widest text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-xs">
                    {image.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Full Screen Cinematic Lightbox Interface */}
        <AnimatePresence>
          {selectedImage !== null && selectedImageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-lg"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button UI */}
              <button
                className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors z-50 p-2"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6 font-light" />
              </button>

              <div className="relative max-h-[75vh] max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* Image Component */}
                <img
                  src={selectedImageData.url}
                  alt={selectedImageData.title}
                  className="max-h-[75vh] max-w-full object-contain rounded-sm border border-neutral-900 shadow-2xl"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-3 bg-black/60 border border-neutral-800 text-white rounded-full hover:bg-neutral-900 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-3 bg-black/60 border border-neutral-800 text-white rounded-full hover:bg-neutral-900 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Informational Captions Grid */}
              <div className="mt-6 text-center max-w-md" onClick={(e) => e.stopPropagation()}>
                <h4 className="font-serif text-2xl font-light text-white">{selectedImageData.title}</h4>
                <p className="font-sans text-xs text-amber-500 uppercase tracking-widest mt-1">{selectedImageData.category}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
