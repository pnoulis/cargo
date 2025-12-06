import { React } from "react";
import { TCargo, TNewCargo, createCargo } from "@common/cargo";
import { TContainer, TNewContainer, createContainer } from "@common/container";
import { TPack, TNewPack, createPack, loadCargo, unloadCargo, packPack } from "@common/pack";
import { useThrottle, useThrottledValue } from "../utils/useThrottle.tsx";
import { TCargoGroup, ECargoState } from "@common/clients";

export type TPackingContextType = {
  // State
  pack: TPack;
  cargoItems: TNewCargo[];
  isPacking: boolean;
  isEditing: boolean;

  // Actions
  resetAll: () => void;
  editContainer: () => void;
  exportPack: () => void;
  dispatchCreatePack: (container: TNewContainer) => void;
  dispatchCreateCargoGroup: (newCargo: TNewCargo) => void;
  dispatchRemoveCargo: (groupId: string) => void;
  dispatchAddCargo: (groupId: string) => void;
};

const PackingContext = React.createContext<TPackingContextType | null>(null);

export function PackingProvider({ children }: { children: React.ReactNode }) {
  const [pack, setPack] = React.useState(createPack(createContainer()));
  const [cargoGroups, setCargoGroups] = React.useState([]);
  const [isPacking, setIsPacking] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [packArgs, setPackArgs] = useThrottledValue(5000);

  React.useEffect(() => {
    log("pack args changed");
    log(packArgs);
  }, [packArgs]);

  function resetAll() {
    setCargoGroups([]);
    setPack(null);
    setIsPacking(false);
    setIsEditing(true);
  }

  function editContainer() {
    setIsEditing(true);
  }

  function exportPack() {}

  function dispatchCreatePack(newContainer: TNewContainer): void {
    log("dispatching create pack");
    const cargo = [];
    for (let i = 0; i < cargoGroups.length; i++) {
      cargo.push(...cargoGroups[i].cargo);
    }
    const container = createContainer(newContainer);
    const pack = createPack({ container, cargo });

    // Render UI
    setPack(pack);
    setIsEditing(false);

    if (!cargo.length) return;

    // Pack pack
    setPackArgs(pack, packPack);
  }

  function dispatchCreateCargoGroup(newCargo: TNewCargo): void {
    log("dispatching create cargo group");
    /* TODO: Check for cargo name duplicates */
    const cargo = newCargo.quantity === 1 ? [createCargo(newCargo)] : createCargo(newCargo);

    const cargoGroup = {
      id: cargo[0].id /* Re-use the 1st cargo id as the group ID */,
      quantity: cargo.length,
      cargo: cargo[0],
      state: ECargoState.Pending,
      pendingCargo: cargo.length,
      loadedCargo: 0,
      failedCargo: 0,
    };

    // Set cargo groups
    setCargoGroups(cargoGroups.concat(cargoGroup));

    if (!pack) return;

    // Load cargo
    setPackArgs(pack, loadCargo, cargoGroup, cargo.length);
    setIsPacking(true);
  }

  function dispatchRemoveCargo(groupId: string): void {
    log("dispatching remove cargo");
    const i = cargoGroups.findIndex((cargoGroup) => cargoGroup.id === groupId);

    // Decrement quantity
    cargoGroups[i].quantity--;
    cargoGroups[i].state = ECargoState.Pending;

    // Unload cargo
    setPackArgs(pack, unloadCargo, cargoGroups[i], 1);
    setIsPacking(true);

    // Set cargo groups
    if (cargoGroups[i].quantity > 0) return setCargoGroups([...cargoGroups]);

    // If the Cargo quantity is 0 remove the CargoGroup
    if (i === 0) return setCargoGroups(cargoGroups.slice(1));
    else if (i === cargoGroups.length) return setCargoGroups(cargoGroups.slice(0, -1));
    else if (i !== -1)
      return setCargoGroups(cargoGroups.slice(0, i).concat(cargoGroups.slice(i + 1)));
  }

  function dispatchAddCargo(groupId: string): void {
    log("dispatching add cargo");
    const i = cargoGroups.findIndex((cargoGroup) => cargoGroup.id === groupId);

    // Increment quantity
    cargoGroups[i].quantity++;
    cargoGroups[i].pendingCargo++;
    cargoGroups[i].state = ECargoState.Pending;

    // Load cargo
    setPackArgs(pack, loadCargo, cargoGroups[i], 1);
    setIsPacking(true);

    // Set cargo groups
    setCargoGroups([...cargoGroups]);
  }

  const value: TPackingContextType = {
    /* State */
    pack,
    cargoGroups,
    isPacking,
    isEditing,

    /* Actions */
    resetAll,
    editContainer,
    exportPack,
    dispatchCreatePack,
    dispatchCreateCargoGroup,
    dispatchAddCargo,
    dispatchRemoveCargo,
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
