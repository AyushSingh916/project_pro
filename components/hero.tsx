import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-center py-20">
      <div className="container mx-auto relative z-10">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white pb-6 flex flex-col">
          Elevate Your Project Management <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with
            <Image
              src={"logo.svg"}
              alt="ProjectPro Logo"
              width={400}
              height={80}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Drive productivity and seamless collaboration with our advanced
          project planning platform.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out px-8 py-3 sm:px-6 sm:py-2"
            >
              Get Started Today <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900 border-2 shadow-md transition-all duration-300 ease-in-out px-8 py-3 sm:px-6 sm:py-2"
            >
              Explore Features
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black opacity-50 z-0"></div>
    </section>
  );
};

export default Hero;
