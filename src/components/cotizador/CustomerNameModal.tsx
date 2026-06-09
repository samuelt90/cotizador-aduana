import { MessageCircle } from "lucide-react";

type CustomerNameModalProps = {
  isOpen: boolean;
  customerName: string;
  whatsappUrl: string;
  onChangeName: (value: string) => void;
  onClose: () => void;
};

export function CustomerNameModal({
  isOpen,
  customerName,
  whatsappUrl,
  onChangeName,
  onClose,
}: CustomerNameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 px-4 pb-4 backdrop-blur-sm md:items-center md:justify-center md:pb-0">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#08111f] p-6 shadow-2xl shadow-black/40">
        <h3 className="text-2xl font-black">Antes de enviar a Ronaldo</h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Agrega tu nombre para que la consulta llegue más ordenada por
          WhatsApp.
        </p>

        <input
          value={customerName}
          onChange={(event) => onChangeName(event.target.value)}
          placeholder="Tu nombre"
          className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-base font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
        />

        <div className="mt-5 flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          >
            <MessageCircle size={18} />
            Abrir WhatsApp
          </a>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white/90 transition hover:bg-white hover:text-slate-950"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
