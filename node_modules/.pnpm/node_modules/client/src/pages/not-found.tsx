import { Link } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="py-20 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-saffron-500" />
        </div>
        <h1 className="font-heading text-5xl font-bold text-clay-900 mb-3">
          404
        </h1>
        <p className="text-xl text-clay-500 mb-2">Page Not Found</p>
        <p className="text-clay-400 mb-8">
          Looks like this dish isn't on our menu. Let's get you back to the good stuff!
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 px-8 py-4"
        >
          Go Home <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
