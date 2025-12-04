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
  dispatchCreateCargoGroup: (newCargo: TNewCargo) => void;
  dispatchRemoveCargoGroup: (groupId: string) => void;
  resetAll: () => void;
  editContainer: () => void;
  exportPack: () => void;
  setIsPacking: () => void;
  setIsEditing: () => void;
};

const PackingContext = React.createContext<TPackingContextType | null>(null);

export function PackingProvider({ children }: { children: React.ReactNode }) {
  const [cargoGroups, setCargoGroups] = React.useState([]);
  const [pack, setPack] = React.useState(null);
  const [isPacking, setIsPacking] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(true);

  function dispatchPackContainer(newContainer: TNewContainer): void {
    log("dispatching pack container");
    const cargo = [];
    for (let i = 0; i < cargoGroups.length; i++) {
      cargo.push(...cargoGroups[i].cargo);
    }
    const packedContainer = packContainer(createContainer(newContainer), cargo);
    setPack(packedContainer);
    setIsEditing(false);
  }

  function dispatchCreateCargoGroup(newCargo: TNewCargo): void {
    log("dispatching create cargo group");
    /* TODO: Check for cargo name duplicates */
    const cargo = newCargo.quantity === 1 ? [createCargo(newCargo)] : createCargo(newCargo);
    const cargoGroup = {
      id: cargo[0].id /* Re-use the 1st cargo id as the group ID */,
      quantity: cargo.length,
      cargo: cargo,
      pendingCargo: 1,
      loadedCargo: 0,
      failedCargo: 0,
    };
    setCargoGroups(cargoGroups.concat(cargoGroup));
  }

  function dispatchRemoveCargoGroup(groupId: string): void {
    const i = cargoGroups.findIndex((cargoGroup) => cargoGroup.id === groupId);
    if (i === 0) return setCargoGroups(cargoGroups.slice(1));
    else if (i === cargoGroups.length) return setCargoGroups(cargoGroups.slice(0, -1));
    else if (i !== -1)
      return setCargoGroups(cargoGroups.slice(0, i).concat(cargoGroups.slice(i + 1)));
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
    cargoGroups,
    pack,
    isPacking,
    isEditing,

    /* Actions */
    dispatchPackContainer,
    dispatchAddCargoItem,
    dispatchCreateCargoGroup,
    dispatchRemoveCargoGroup,
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
