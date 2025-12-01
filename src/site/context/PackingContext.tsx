import { React } from "react";
import { EUnit } from "@/utils/index.ts";
import { TCargo, createCargo } from "@/cargo.ts";
import { TContainer, createContainer } from "@/container.ts";
import { TPack, packContainer } from "@/pack.ts";

export type ContainerInput = {
  name?: string;
  l: number;
  w: number;
  h: number;
  maxWeight?: number;
};

export type CargoInput = {
  id?: string;
  l: number;
  w: number;
  h: number;
  weight?: number;
  priority?: number;
  quantity: number;
};

type PackingContextType = {
  // State
  unit: EUnit;
  container: ContainerInput | null;
  cargoItems: CargoInput[];
  pack: TPack | null;
  isPacking: boolean;
  error: string | null;

  // Actions
  setUnit: (unit: EUnit) => void;
  setContainer: (container: ContainerInput | null) => void;
  addCargo: (cargo: CargoInput) => void;
  updateCargo: (id: string, cargo: CargoInput) => void;
  removeCargo: (id: string) => void;
  executePacking: () => void;
  resetAll: () => void;
};

const PackingContext = React.createContext<PackingContextType | null>(null);

export function PackingProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = React.useState<EUnit>(EUnit.Centimeter);
  const [container, setContainer] = React.useState<ContainerInput | null>(null);
  const [cargoItems, setCargoItems] = React.useState<CargoInput[]>([]);
  const [pack, setPack] = React.useState<TPack | null>(null);
  const [isPacking, setIsPacking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addCargo = React.useCallback((cargo: CargoInput) => {
    setCargoItems((prev) => {
      const newCargo = { ...cargo };
      if (!newCargo.id) {
        newCargo.id = `cargo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      }
      return [...prev, newCargo];
    });
  }, []);

  const updateCargo = React.useCallback((id: string, cargo: CargoInput) => {
    setCargoItems((prev) =>
      prev.map((item) => (item.id === id ? { ...cargo, id } : item))
    );
  }, []);

  const removeCargo = React.useCallback((id: string) => {
    setCargoItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const executePacking = React.useCallback(() => {
    if (!container) {
      setError("Container dimensions are required");
      return;
    }
    if (cargoItems.length === 0) {
      setError("At least one cargo item is required");
      return;
    }

    setIsPacking(true);
    setError(null);

    try {
      // Create container
      const cont = createContainer({
        l: container.l,
        w: container.w,
        h: container.h,
        maxWeight: container.maxWeight || Number.POSITIVE_INFINITY,
        unit: unit,
      });

      // Create cargo array, expanding by quantity
      const cargo: TCargo[] = [];
      for (const item of cargoItems) {
        for (let i = 0; i < item.quantity; i++) {
          cargo.push(
            createCargo({
              id: `${item.id}-${i}`,
              l: item.l,
              w: item.w,
              h: item.h,
              weight: item.weight || 0,
              priority: item.priority || 0,
              unit: unit,
            })
          );
        }
      }

      // Run algorithm
      const result = packContainer(cont, cargo);
      setPack(result);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Packing failed";
      setError(message);
      setPack(null);
    } finally {
      setIsPacking(false);
    }
  }, [container, cargoItems, unit]);

  const resetAll = React.useCallback(() => {
    setContainer(null);
    setCargoItems([]);
    setPack(null);
    setError(null);
  }, []);

  const value: PackingContextType = {
    unit,
    setUnit,
    container,
    setContainer,
    cargoItems,
    addCargo,
    updateCargo,
    removeCargo,
    pack,
    isPacking,
    error,
    executePacking,
    resetAll,
  };

  return (
    <PackingContext.Provider value={value}>{children}</PackingContext.Provider>
  );
}

export function usePacking() {
  const context = React.useContext(PackingContext);
  if (!context) {
    throw new Error("usePacking must be used within PackingProvider");
  }
  return context;
}
