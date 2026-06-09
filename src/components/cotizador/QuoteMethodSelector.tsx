import type { ReactNode } from "react";
import { Check, FileSearch, Search } from "lucide-react";
import type { QuoteMethod } from "@/types/quote";

type QuoteMethodSelectorProps = {
  method: QuoteMethod | null;
  onSelect: (method: QuoteMethod) => void;
};

export function QuoteMethodSelector({
  method,
  onSelect,
}: QuoteMethodSelectorProps) {
  return (
    <div className="mt-8 grid gap-4">
      <MethodCard
        active={method === "vin"}
        icon={<FileSearch size={30} />}
        title="Ya tengo VIN"
        subtitle="Vehículo comprado, apartado o con documentos."
        description="El sistema identifica el vehículo y luego compara contra la referencia SAT."
        onClick={() => onSelect("vin")}
      />

      <MethodCard
        active={method === "sat"}
        icon={<Search size={30} />}
        title="Estoy comparando opciones"
        subtitle="Consulta rápida antes de comprar o participar en subasta."
        description="Busca por tipo, marca, modelo y año usando referencias SAT."
        onClick={() => onSelect("sat")}
      />
    </div>
  );
}

function MethodCard({
  active,
  icon,
  title,
  subtitle,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-[2rem] border p-6 text-left transition active:scale-[0.99] ${
        active
          ? "border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.16)]"
          : "border-white/10 bg-white/[0.06] hover:border-cyan-300/40"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-1 text-sm font-bold text-cyan-200">
                {subtitle}
              </p>
            </div>

            {active && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
                <Check size={17} />
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
