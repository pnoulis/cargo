import { React } from "react";
import "./CargoLoaderPage.css";
import { ContainerForm } from "./components/ContainerForm.tsx";
import { CargoForm } from "./components/CargoForm.tsx";
import { PackController } from "./components/PackController.tsx";
import { usePacking, PackingProvider } from "./context/PackingContext.tsx";
import { ResultsDisplay } from "./components/ResultsDisplay.tsx";

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
    <main className="cargo-loader">
      <header className="container-configurator">
        {isEditing ? <ContainerForm /> : <PackController />}
      </header>
      <section className="cargo-configurator">
        <CargoForm />
      </section>
      <section className="pack-renderer">
        <ResultsDisplay />
      </section>
    </main>
  );
}
