// stores/usePropertiesStore.js

import create from "zustand";
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
      // Guarda las propiedades en localStorage cada vez que se actualizan
      localStorage.setItem(
        "propiedades",
        JSON.stringify(propiedades)
      );
    },
    getPropiedadById: id =>
      get().propiedades.find(p => p.id === id),
  })
);

// Inicializa la tienda con propiedades guardadas en localStorage si existen
const initializeStore = () => {
  const savedPropiedades = localStorage.getItem("propiedades");
  if (savedPropiedades) {
    usePropertiesStore
      .getState()
      .setPropiedades(JSON.parse(savedPropiedades));
  }
};

initializeStore();

export default usePropertiesStore;
