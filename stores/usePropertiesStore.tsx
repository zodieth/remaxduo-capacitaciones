import { create } from "zustand";
import { useEffect } from "react"; // Importa useEffect
import { PropertydApi } from "@/types/next-auth";

interface PropertiesState {
  propiedades: PropertydApi[];
  setPropiedades: (propiedades: PropertydApi[]) => void;
  getPropiedadById: (id: string) => PropertydApi | undefined;
}

const usePropertiesStore = create<PropertiesState>(
  (set, get) => ({
    propiedades: [],
    setPropiedades: propiedades => {
      set({ propiedades });
      // Verifica si está en el cliente antes de acceder a localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "propiedades",
          JSON.stringify(propiedades)
        );
      }
    },
    getPropiedadById: id =>
      get().propiedades.find(p => p.id === id),
  })
);

// Función para inicializar la tienda con propiedades guardadas, ahora como un hook para usar en componentes
export const useInitializeStore = () => {
  useEffect(() => {
    const savedPropiedades =
      typeof window !== "undefined"
        ? localStorage.getItem("propiedades")
        : null;
    if (savedPropiedades) {
      usePropertiesStore
        .getState()
        .setPropiedades(JSON.parse(savedPropiedades));
    }
  }, []); // Se ejecuta solo una vez al montar el componente
};

export default usePropertiesStore;
