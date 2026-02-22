'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { destinations } from '../../lib/api/destinations';

export default function DestinationGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  return (
    <section className=" bg-[var(--main-grey)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--second-color)] mb-4">
        Explore Our Amazing Destinations
        </h2>
        <span
        className="relative block h-1 w-40 mb-6 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto relative block  w-40 mx-auto rounded-md

          before:content-['']
          before:absolute
          before:top-1/2
          before:left-1/2
          before:-translate-x-1/2
          before:-translate-y-1/2
          before:w-4
          before:h-4
          before:bg-[url('/assets/images/pryamids-2.svg')]
          before:bg-contain
          before:bg-no-repeat
          before:z-20

          after:content-['']
          after:absolute
          after:top-1/2
          after:left-1/2
          after:-translate-x-1/2
          after:-translate-y-1/2
          after:w-[26px]
          after:h-[26px]
          after:bg-[var(--main-grey)]
          after:rounded-full
          after:z-0
        ">
        </span>
        <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
          Discover breathtaking locations around the world and create unforgettable memories
        </p>
      </div>

        {/* Grid Layout */}
        <div className="grid m-h-screen grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          {/* Large image - top left */}
          <div
            className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href="/contact">
            <div className={`absolute inset-0 bg-gradient-to-br  transition-transform duration-500 ${hoveredIndex === 0 ? 'scale-110' : 'scale-100'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-100">
              <Image
                src={destinations[0].image || "/placeholder.svg"}
                alt={destinations[0].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 0 ? 'opacity-100' : 'opacity-70'}`}></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300">
              <div className="text-sm font-medium opacity-90 mb-1">{destinations[0].location}</div>
              <h3 className="text-2xl font-bold">{destinations[0].title}</h3>
            </div>
            </Link>

          </div>

          {/* Medium image - top middle */}
          <div
            className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href="/contact">
            <div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-500 ${hoveredIndex === 1 ? 'scale-110' : 'scale-100'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-100">
                <Image
                src={destinations[1].image || "/placeholder.svg"}
                alt={destinations[1].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 1 ? 'opacity-100' : 'opacity-70'}`}></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="text-xs font-medium opacity-90 mb-1">{destinations[1].location}</div>
              <h3 className="text-xl font-bold">{destinations[1].title}</h3>
            </div>
            </Link>
          </div>

          {/* Large image - top right */}
          <div
            className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href="/contact">
            <div className={`absolute inset-0 bg-gradient-to-br  transition-transform duration-500 ${hoveredIndex === 2 ? 'scale-110' : 'scale-100'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-100">
                <Image
                src={destinations[2].image || "/placeholder.svg"}
                alt={destinations[2].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 2 ? 'opacity-100' : 'opacity-70'}`}></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="text-sm font-medium opacity-90 mb-1">{destinations[2].location}</div>
              <h3 className="text-2xl font-bold">{destinations[2].title}</h3>
            </div>
            </Link>
          </div>

          {/* Medium image - bottom middle */}
          <div
            className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href="/contact">
            <div className={`absolute inset-0 bg-gradient-to-br  transition-transform duration-500 ${hoveredIndex === 3 ? 'scale-110' : 'scale-100'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-100">
                <Image
                src={destinations[3].image || "/placeholder.svg"}
                alt={destinations[3].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 3 ? 'opacity-100' : 'opacity-70'}`}></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="text-xs font-medium opacity-90 mb-1">{destinations[3].location}</div>
              <h3 className="text-xl font-bold">{destinations[3].title}</h3>
            </div>
            </Link>
          </div>

          {/* Wide image - bottom */}
          <div
            className="md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href="/contact">
            <div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-500 ${hoveredIndex === 4 ? 'scale-110' : 'scale-100'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-100">
                <Image
                src={destinations[4].image || "/placeholder.svg"}
                alt={destinations[4].title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 4 ? 'opacity-100' : 'opacity-70'}`}></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="text-sm font-medium opacity-90 mb-1">{destinations[4].location}</div>
              <h3 className="text-2xl font-bold">{destinations[4].title}</h3>
            </div>
            </Link>
          </div>

          {/* Small images - bottom right */}
          <div className="grid grid-cols-1 gap-4">
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(5)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href="/contact">
              <div className={`absolute inset-0 bg-gradient-to-br  transition-transform duration-500 ${hoveredIndex === 5 ? 'scale-110' : 'scale-100'}`}>
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-100">
                  <Image
                  src={destinations[5].image || "/placeholder.svg"}
                  alt={destinations[5].title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 5 ? 'opacity-100' : 'opacity-70'}`}></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="text-xs font-medium opacity-90 mb-1">{destinations[5].location}</div>
                <h3 className="text-base font-bold">{destinations[5].title}</h3>
              </div>
              </Link>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button className="bg-[var(--main-color)] hover:bg-[var(--main-color)]/90 text-[var(--second-color)] font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
            Plan Your Journey
          </button>
        </div>

      </div>
    </section>
  );
}