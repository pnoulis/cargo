import { React } from "react";
import { TCargo, TNewCargo, createCargo } from "@/cargo";
import { TContainer, TNewContainer, createContainer } from "@/container";
import { TPack, TNewPack, createPack, packContainer } from "@/pack";

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
  const [cargoItems, setCargoItems] = React.useState([]);
  const [pack, setPack] = React.useState(null);

  function dispatchPackContainer(container: TNewContainer) {
    log("dispatching pack container");
    const cargo = [];
    for (let i = 0; i < cargoItems.length; i++) {
      if (cargoItems[i].quantity > 1) cargo.push(...createCargo(cargoItems[i]));
      else cargo.push(createCargo(cargoItems[i]));
    }
    const packedContainer = packContainer(createContainer(container), cargo);
    setPack(packedContainer);
    window.history.pushState({}, "", `./?pack=${packedContainer.id}`);
    window.dispatchEvent(new CustomEvent("pushstate"));
  }

  function dispatchAddCargoItem(cargo: TNewCargo) {}

  const value: TPackingContextType = {
    /* State */
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
