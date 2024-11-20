import { ThemeToggle } from "~/components/theme-toggle";
import { HeroSection } from "~/components/hero-section";
import { FeatureGrid } from "~/components/feature-grid";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/remix";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prime Stack</h1>
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </SignedIn>

          <ThemeToggle />

          <SignedOut>
            <SignInButton>Log in</SignInButton>
          </SignedOut>
        </div>
      </header>
      <main>
        <HeroSection />
        <FeatureGrid />
      </main>
      <footer className="container mx-auto py-6 px-4 text-center text-muted-foreground">
        <p>&copy; 2023 Prime Stack. All rights reserved.</p>
      </footer>
    </div>
  );
}
