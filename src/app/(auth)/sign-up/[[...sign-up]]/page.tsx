import { SignUp } from "@clerk/nextjs";

export default function SignUpSide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-navy">snartsolgt</h1>
        <p className="text-sm text-muted-fg mt-1">Opprett konto for å komme i gang</p>
      </div>
      <SignUp />
    </div>
  );
}
