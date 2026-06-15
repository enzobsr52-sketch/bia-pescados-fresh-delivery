import logo from "@/assets/IMG-20260615-WA0023.jpg.asset.json";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Pescados da Bia"
      className={`${className} rounded-full object-cover bg-white ring-2 ring-pink/30`}
    />
  );
}
