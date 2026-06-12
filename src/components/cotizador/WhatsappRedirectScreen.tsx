import { CheckCircle2, Copy, MessageCircle, RotateCcw } from "lucide-react";

type WhatsappRedirectScreenProps = {
  copied: boolean;
  onOpenWhatsapp: () => void;
  onCopyMessage: () => void;
  onNewQuote: () => void;
};

export function WhatsappRedirectScreen({
  copied,
  onOpenWhatsapp,
  onCopyMessage,
  onNewQuote,
}: WhatsappRedirectScreenProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-xl items-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
            <CheckCircle2 size={34} strokeWidth={2.4} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
            Cotización generada
          </p>

          <h1 className="mt-3 text-3xl font-black leading-tight text-white">
            Ya preparamos tu mensaje para WhatsApp.
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Te estamos redirigiendo a WhatsApp para que Ronaldo valide tus
            datos. Cuando se abra el chat, presiona{" "}
            <span className="font-black text-white">Enviar</span> en WhatsApp
            para iniciar la validación.
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            WhatsApp no envía el mensaje automáticamente. El texto queda listo
            en el chat, pero debes presionar el botón de enviar.
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={onOpenWhatsapp}
              className="flex items-center justify-center gap-3 rounded-[1.4rem] bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            >
              <MessageCircle size={19} strokeWidth={2.5} />
              Abrir WhatsApp nuevamente
            </button>

            <button
              type="button"
              onClick={onCopyMessage}
              className="flex items-center justify-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-black text-white transition hover:bg-white/[0.1]"
            >
              <Copy size={18} strokeWidth={2.5} />
              {copied ? "Datos copiados" : "Copiar datos de cotización"}
            </button>

            <button
              type="button"
              onClick={onNewQuote}
              className="flex items-center justify-center gap-3 rounded-[1.4rem] border border-white/10 bg-slate-950/40 px-5 py-4 text-sm font-black text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <RotateCcw size={18} strokeWidth={2.5} />
              Nueva cotización
            </button>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Si WhatsApp no se abre, usa “Abrir WhatsApp nuevamente” o copia los
            datos y pégalos manualmente en el chat.
          </p>
        </div>
      </section>
    </main>
  );
}
