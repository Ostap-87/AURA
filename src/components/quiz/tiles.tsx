import { IndustryIcon } from "./industry-icon";

export type Tile = { id: string; label: string };

export function Tiles({
  tiles,
  onSelect,
  withIcons = false,
}: {
  tiles: Tile[];
  onSelect: (id: string) => void;
  withIcons?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          onClick={() => onSelect(tile.id)}
          className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-card border border-ink bg-warm-parchment p-6 text-center transition-transform duration-200 hover:-translate-y-1"
        >
          {withIcons && <IndustryIcon id={tile.id} className="h-8 w-8" />}
          <span className="text-body font-medium">{tile.label}</span>
        </button>
      ))}
    </div>
  );
}
