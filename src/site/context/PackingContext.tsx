import { React } from "react";
import { TCargo, TNewCargo, createCargo } from "@/cargo";
import { TContainer, TNewContainer, createContainer } from "@/container";
import { TPack, TNewPack, createPack } from "@/pack";

export type TPackingContextType = {
  // State
  container: TContainer;
  cargoItems: TNewCargo[];
  pack: TPack;
  isPacking: boolean;
  error: string | null;

  // Actions
  dispatchPackContainer: (container: TNewContainer) => void;
  dispatchAddCargoItem: (cargo: TNewCargo) => void;
};

const PackingContext = React.createContext<TPackingContextType | null>(null);

export function PackingProvider({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = React.useState(() => createContainer({ maxWeight: 1000 }));
  const [cargoItems, setCargoItems] = React.useState([]);
  const [pack, setPack] = React.useState(() => createPack({ container }));

  function dispatchPackContainer(container: TNewContainer) {
    setContainer();
  }
  function dispatchAddCargoItem(cargo: TNewCargo) {}

  const value: TPackingContextType = {
    /* State */
    container,
    cargoItems,
    pack,

    /* Actions */
    dispatchPackContainer,
    dispatchAddCargoItem,
  };

  return <PackingContext.Provider value={value}>{children}</PackingContext.Provider>;
}

export function usePacking() {
  const context = React.useContext(PackingContext);
  if (!context) {
    throw new Error("usePacking must be used within PackingProvider");
  }
  return context;
}
