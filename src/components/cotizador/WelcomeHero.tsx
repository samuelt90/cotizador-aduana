import { Sparkles } from "lucide-react";

export function WelcomeHero() {
  return (
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
        <Sparkles size={15} />
        Bienvenido
      </div>

      <h2 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
        Calcula una estimación antes de traer tu vehículo.
      </h2>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
        Usa VIN si ya tienes el vehículo comprado, o busca por marca y modelo si
        todavía estás comparando opciones. Al final, envías una ficha ordenada
        al WhatsApp de Ronaldo para validar el caso real.
      </p>

      <div className="mt-8 rounded-[1.7rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
        El resultado es preliminar. Puede variar según valor de compra,
        documentación, referencia SAT, versión exacta del vehículo y validación
        aduanera.
      </div>
    </div>
  );
}
