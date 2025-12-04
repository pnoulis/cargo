import { React } from "react";
import { TCargo, TNewCargo, createCargo } from "@common/cargo";
import { TContainer, TNewContainer, createContainer } from "@common/container";
import { TPack, TNewPack, createPack, packContainer } from "@common/pack";

export type TPackingContextType = {
  // State
  container: TContainer;
  cargoItems: TNewCargo[];
  pack: TPack;
  error: string | null;
  isPacking: boolean;
  isEditing: boolean;

  // Actions
  dispatchPackContainer: (container: TNewContainer) => void;
  dispatchAddCargoItem: (cargo: TNewCargo) => void;
  resetAll: () => void;
  editContainer: () => void;
  exportPack: () => void;
  setIsPacking: () => void;
  setIsEditing: () => void;
};

const PackingContext = React.createContext<TPackingContextType | null>(null);

export function PackingProvider({ children }: { children: React.ReactNode }) {
  const [cargoItems, setCargoItems] = React.useState([]);
  const [pack, setPack] = React.useState(null);
  const [isPacking, setIsPacking] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(true);

  function dispatchPackContainer(container: TNewContainer) {
    log("dispatching pack container");
    const cargo = [];
    for (let i = 0; i < cargoItems.length; i++) {
      if (cargoItems[i].quantity > 1) cargo.push(...createCargo(cargoItems[i]));
      else cargo.push(createCargo(cargoItems[i]));
    }
    const packedContainer = packContainer(createContainer(container), cargo);
    setPack(packedContainer);
    setIsEditing(false);
  }

  function dispatchAddCargoItem(cargo: TNewCargo) {}

  function resetAll() {
    setCargoItems([]);
    setPack(null);
    setIsPacking(false);
    setIsEditing(true);
  }

  function editContainer() {
    setIsEditing(true);
  }

  function exportPack() {}

  const value: TPackingContextType = {
    /* State */
    cargoItems,
    pack,
    isPacking,
    isEditing,

    /* Actions */
    dispatchPackContainer,
    dispatchAddCargoItem,
    resetAll,
    editContainer,
    exportPack,
    setIsPacking,
    setIsEditing,
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
