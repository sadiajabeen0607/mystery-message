"use client";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/data/messages.json";
import { Mail } from "lucide-react";

const Home = () => {
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center my-10 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery Message - Where your Identity remains a Secret.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-lg"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-6">
                  <Card>
                    <CardHeader className="font-semibold text-2xl">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                      {/* Mail Icon on the left */}
                      <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                      <div className="flex flex-col mt-2">
                        <span className="w-full text-lg font-medium">
                          {message.content}
                        </span>
                        <span className="text-xs text-gray-500 -mt-0.5">
                          {message.received}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        ;
      </main>

    </>
  );
};

export default Home;
