import { Minus, Plus, X } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type ContextualFaqProps = {
  isOpen: boolean;
  items: FaqItem[];
  openFaq: number | null;
  onToggleFaq: (index: number) => void;
  onClose: () => void;
};

export function ContextualFaq({
  isOpen,
  items,
  openFaq,
  onToggleFaq,
  onClose,
}: ContextualFaqProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
      <div className="max-h-[82vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#08111f] p-5 shadow-2xl shadow-black/40">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Ayuda rápida
              </p>

              <h3 className="mt-2 text-2xl font-black">Dudas frecuentes</h3>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {items.map((item, index) => {
              const isItemOpen = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.05]"
                >
                  <button
                    onClick={() => onToggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="text-sm font-black text-white">
                      {item.question}
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-300">
                      {isItemOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  {isItemOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">
                      <p className="text-sm leading-6 text-slate-400">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
