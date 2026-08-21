import logo from "@/assets/img/IMG-20260615-WA0023.webp";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Pescados da Bia"
      className={`${className} rounded-full object-cover bg-white ring-2 ring-pink/30`}
    />
  );
}
