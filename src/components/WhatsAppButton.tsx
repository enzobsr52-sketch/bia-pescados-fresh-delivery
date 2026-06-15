export function WhatsAppButton() {
  const url = "https://wa.me/5511999990000?text=" + encodeURIComponent("Olá! Vim pelo site da Pescados da Bia e quero fazer um pedido.");
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Atendimento WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-whats px-4 py-3 text-white shadow-soft transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white" aria-hidden>
        <path d="M19.1 17.3c-.3-.1-1.7-.9-2-1s-.5-.1-.7.2c-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3.1 5 4.3 1.7.7 2.4.8 3.2.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.8 1 3.9 1.5 6.2 1.5 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1.1 1.1-3.9-.3-.4C5.6 20 5 18 5 16 5 9.9 9.9 5 16 5s11 4.9 11 11-4.9 10.6-11 10.6z"/>
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">Fale conosco</span>
    </a>
  );
}
