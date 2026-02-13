
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { FloatingParticles } from '@/components/ui/floating-particles';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden">
      <FloatingParticles
        className="absolute inset-0 -z-10"
        quantity={100}
        color="hsl(var(--primary))"
        vy={-0.2}
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
            src="https://ik.imagekit.io/fwqphsval/Gemini_Generated_Image_q0fbgzq0fbgzq0fb.png?updatedAt=1761543030251"
            alt="Background"
            fill
            className="z-0 object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
      </div>
      
      <main className="relative z-20 flex flex-col items-start justify-end flex-grow text-left text-white p-8 md:p-12 mb-16">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold md:text-8xl font-headline">
            AirScribe
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Comprehensive reporting for modern aviation safety.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg">
                Enter Dashboard <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
