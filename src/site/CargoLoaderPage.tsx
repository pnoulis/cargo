import { React } from "react";
import "./CargoLoaderPage.css";
import { ContainerForm } from "./components/ContainerForm.tsx";
import { CargoForm } from "./components/CargoForm.tsx";
import { PackController } from "./components/PackController.tsx";
import { usePacking, PackingProvider } from "./context/PackingContext.tsx";
import { ResultsDisplay } from "./components/ResultsDisplay.tsx";
import { CargoList } from "./components/CargoList.tsx";

export function CargoLoaderPage() {
  return (
    <PackingProvider>
      <CargoLoader />
    </PackingProvider>
  );
}

function CargoLoader() {
  const { isEditing } = usePacking();

  return (
    <main className="layout-cargo-loader">
      <header className="layout-container-configurator">
        {isEditing ? <ContainerForm /> : <PackController />}
      </header>
      <section className="layout-cargo-configurator">
        <CargoForm />
      </section>
      <section className="layout-cargo-list">
        <CargoList />
      </section>
      <section className="layout-pack-renderer">
        <ResultsDisplay />
      </section>
    </main>
  );
}
