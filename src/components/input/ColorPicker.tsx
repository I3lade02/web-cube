import type { Color } from "@/lib/cube/types";

const COLORS: { c: Color; label: string; className: string }[] = [
  { c: "W", label: "White", className: "bg-white" },
  { c: "Y", label: "Yellow", className: "bg-yellow-300" },
  { c: "R", label: "Red", className: "bg-red-500" },
  { c: "O", label: "Orange", className: "bg-orange-500" },
  { c: "B", label: "Blue", className: "bg-blue-600" },
  { c: "G", label: "Green", className: "bg-green-500" }
];

export function ColorPicker({
  value,
  onChange
}: {
  value: Color;
  onChange: (c: Color) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map(({ c, label, className }) => {
        const active = c === value;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={[
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
              "hover:opacity-90",
              active ? "border-black/60 ring-2 ring-black/20" : "border-black/15"
            ].join(" ")}
            aria-pressed={active}
            title={label}
          >
            <span className={["h-5 w-5 rounded-md border border-black/20", className].join(" ")} />
            <span className="text-black/80">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
