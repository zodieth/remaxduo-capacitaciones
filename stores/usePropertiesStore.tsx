// stores/usePropertiesStore.js

import { PropertydApi } from "@/types/next-auth";
import create from "zustand";

interface PropertiesState {
  propiedades: PropertydApi[];
  setPropiedades: (propiedades: PropertydApi[]) => void;
  getPropiedadById: (id: string) => PropertydApi | undefined;
}

const usePropertiesStore = create<PropertiesState>(
  (set, get) => ({
    propiedades: [],
    setPropiedades: propiedades => set({ propiedades }),
    getPropiedadById: id =>
      get().propiedades.find(p => p.id === id),
  })
);

export default usePropertiesStore;

// stores/usePropertiesStore.js
// import create from "zustand";
// import { PropertydApi } from "@/types/next-auth";

// interface PropertiesState {
//   propiedades: PropertydApi[];
//   setPropiedades: (propiedades: PropertydApi[]) => void;
//   getPropiedadById: (id: string) => PropertydApi | undefined;
// }

// const usePropertiesStore = create<PropertiesState>(
//   (set, get) => ({
//     propiedades: [],
//     setPropiedades: propiedades => {
//       set({ propiedades });
//       // Persiste las propiedades en localStorage cuando se actualizan
//       localStorage.setItem(
//         "propiedades",
//         JSON.stringify(propiedades)
//       );
//     },
//     getPropiedadById: id =>
//       get().propiedades.find(p => p.id === id),
//   })
// );

// // Función para inicializar el estado del store desde localStorage
// const initializePropertiesStore = () => {
//   const storedProperties = localStorage.getItem("propiedades");
//   if (storedProperties) {
//     usePropertiesStore
//       .getState()
//       .setPropiedades(JSON.parse(storedProperties));
//   }
// };

// // Llama a esta función en algún lugar de tu aplicación donde se asegure
// // que se ejecute una vez al cargar la app, por ejemplo, en _app.js o index.js
// initializePropertiesStore();

// export default usePropertiesStore;

// const usePropertiesStore = create(set => ({
//   propiedades: [] as Propiedad[],
//   setPropiedades: (propiedades: Propiedad[]) =>
//     set(() => ({ propiedades })),
//   // Usa una función de callback para acceder al estado actual
//   getPropiedadById: (id: string) => (state: any) =>
//     state.propiedades.find(
//       (propiedad: Propiedad) => propiedad.id === id
//     ),
// }));
