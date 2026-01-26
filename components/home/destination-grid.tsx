'use client';

import { useState } from 'react';
import Image from "next/image";
import { destinations } from '../../lib/api/destinations';

export default function DestinationGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  return (
    <section className=" bg-[var(--main-grey)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <div className="h-1 w-20 bg-[var(--main-color)] mx-auto"></div>
        </div>
        <h2 className="text-4xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
        Explore Our Amazing Destinations
        </h2>
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
          </div>

          {/* Medium image - top middle */}
          <div
            className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
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
          </div>

          {/* Large image - top right */}
          <div
            className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
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
          </div>

          {/* Medium image - bottom middle */}
          <div
            className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
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
          </div>

          {/* Wide image - bottom */}
          <div
            className="md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
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
          </div>

          {/* Small images - bottom right */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(5)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
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
            </div>
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(5)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br  transition-transform duration-500 ${hoveredIndex === 5 ? 'scale-110' : 'scale-100'}`}>
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-100">
                  <Image
                  src={destinations[6].image || "/placeholder.svg"}
                  alt={destinations[6].title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${hoveredIndex === 6 ? 'opacity-100' : 'opacity-70'}`}></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="text-xs font-medium opacity-90 mb-1">{destinations[6].location}</div>
                <h3 className="text-base font-bold">{destinations[6].title}</h3>
              </div>
            </div>
            {/* <div className="relative rounded-3xl overflow-hidden bg-[var(--second-color)] flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-all duration-300 group">
              <div className="text-center text-white p-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">✈️</div>
                <div className="text-xs font-medium opacity-90 mb-1">{destinations[6].location}</div>
                <h3 className="text-base font-bold">{destinations[6].title}</h3>
              </div>
            </div> */}
          </div>
          
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button className="bg-[var(--main-color)] hover:bg-[var(--main-color)]/90 text-[var(--second-color)] font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
            Plan Your Journey
          </button>
        </div>
        <div className="relative">
        <input
          required
          type="text"
          name="text"
          autoComplete="off"
          className="peer w-full border-[1.5px] border-solid border-[#9e9e9e] rounded-2xl bg-transparent px-4 py-4 text-base text-[#f5f5f5] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#1a73e8] valid:border-[#1a73e8] valid:outline-none outline-none"
        />
        <label className="absolute left-[15px] text-[#aaa] pointer-events-none translate-y-4 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] peer-focus:-translate-y-1/2 peer-focus:scale-80 peer-focus:bg-[#212121] peer-focus:px-[0.2em] peer-focus:py-0 peer-focus:text-[#2196f3] peer-valid:-translate-y-1/2 peer-valid:scale-80 peer-valid:bg-[#212121] peer-valid:px-[0.2em] peer-valid:py-0 peer-valid:text-[#2196f3]">
          First Name
        </label>
    </div>
      </div>
    </section>
  );
}