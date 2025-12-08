import { React } from "react";
import { TCargo, TNewCargo, createCargo } from "@common/cargo";
import { TContainer, TNewContainer, createContainer } from "@common/container";
import { TPack, TNewPack, createPack, loadCargo, unloadCargo, packPack } from "@common/pack";
import { useThrottle, useThrottledValue } from "../utils/useThrottle.tsx";
import { TCargoGroup, ECargoState } from "@common/clients";
import { smallID } from "@common/utils";

export type TPackingContextType = {
  // State
  pack: TPack;
  cargoItems: TNewCargo[];
  isPacking: boolean;
  isEditing: boolean;
  isPacked: boolean;
  isExporting: boolean;

  // Actions
  resetAll: () => void;
  editContainer: () => void;
  exportPack: () => void;
  dispatchCreatePack: (container: TNewContainer) => void;
  dispatchCreateCargoGroup: (newCargo: TNewCargo) => void;
  dispatchRemoveCargo: (groupId: string) => void;
  dispatchAddCargo: (groupId: string) => void;
  dispatchPackPack: () => void;
};

const PackingContext = React.createContext<TPackingContextType | null>(null);

export function PackingProvider({ children }: { children: React.ReactNode }) {
  const [pack, setPack] = React.useState();
  const [cargoGroups, setCargoGroups] = React.useState([]);
  const [isPacking, setIsPacking] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(true);
  const [packArgs, setPackArgs] = useThrottledValue(5000);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isPacked, setIsPacked] = React.useState(false);

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

  async function exportPack() {
    if (!pack) return;
    setIsExporting(true);
  }

  function dispatchCreatePack(newContainer: TNewContainer): void {
    log("dispatching create pack");
    const container = createContainer(newContainer);
    const pack = createPack({ container });

    if (cargoGroups.length) {
      for (let i = 0; i < cargoGroups.length; i++) {
        pack.pendingCargo.push(cargoGroups[i].cargo);
        for (let y = 1; y < cargoGroups[i].quantity; y++) {
          pack.pendingCargo.push(createCargo({ ...cargoGroups[i].cargo, id: "" }));
        }
      }
    }
    // Render UI
    setPack(pack);
    setIsEditing(false);
  }

  function dispatchCreateCargoGroup(newCargo: TNewCargo): void {
    log("dispatching create cargo group");
    /* TODO: Check for cargo name duplicates */

    const cargoGroupId = smallID();
    const cargo = createCargo({ ...newCargo, cargoGroup: cargoGroupId, quantity: 1 });

    const cargoGroup = {
      id: cargoGroupId,
      quantity: newCargo.quantity,
      cargo: cargo,
      state: ECargoState.Pending,
      pendingCargo: newCargo.quantity,
      loadedCargo: 0,
      failedCargo: 0,
    };

    // Set cargo groups
    setCargoGroups(cargoGroups.concat(cargoGroup));

    if (!pack) return;

    // Load cargo
    pack.pendingCargo.push(cargo);
    for (let i = 1; i < newCargo.quantity; i++) {
      pack.pendingCargo.push(createCargo({ ...cargo, id: "" }));
    }
    setPack({ ...pack });
  }

  function dispatchRemoveCargo(groupId: string): void {
    log("dispatching remove cargo");
    const i = cargoGroups.findIndex((cargoGroup) => cargoGroup.id === groupId);

    // Decrement quantity
    cargoGroups[i].quantity--;
    cargoGroups[i].state = ECargoState.Pending;

    if (pack) {
      let y = pack.loadedCargo.findIndex((c) => c.cargoGroup === cargoGroups[i].id);
      if (y > -1) {
        pack.loadedCargo.splice(y, 1);
      } else {
        y = pack.pendingCargo.findIndex((c) => c.cargoGroup === cargoGroups[i].id);
        if (y > -1) {
          pack.pendingCargo.splice(y, 1);
        } else {
          y = pack.failedCargo.findIndex((c) => c.cargoGroup === cargoGroups[i].id);
          pack.failedCargo.splice(y, 1);
        }
      }
      setPack({ ...pack });
    }

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

    // Set cargo groups
    setCargoGroups([...cargoGroups]);

    if (!pack) return;
    pack.pendingCargo.push(createCargo({ ...cargoGroups[i].cargo, id: "" }));
    setPack({ ...pack });
  }

  function dispatchPackPack(): void {
    log("dispatching pack pack");
    log(pack);
    const failedCargo = packPack(pack);
    setPack({ ...pack });
    setIsPacked(true);
  }

  const value: TPackingContextType = {
    /* State */
    pack,
    cargoGroups,
    isPacking,
    isEditing,
    isExporting,
    isPacked,

    /* Actions */
    resetAll,
    editContainer,
    exportPack,
    dispatchCreatePack,
    dispatchCreateCargoGroup,
    dispatchAddCargo,
    dispatchRemoveCargo,
    dispatchPackPack,
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
