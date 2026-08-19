export type Provincia = {
  slug: string;
  nombre: string;
  region: string;
};

export const PROVINCIAS: Provincia[] = [
  { slug: "buenos-aires", nombre: "Buenos Aires", region: "Centro" },
  { slug: "catamarca", nombre: "Catamarca", region: "Noroeste" },
  { slug: "chaco", nombre: "Chaco", region: "Noreste" },
  { slug: "chubut", nombre: "Chubut", region: "Patagonia" },
  { slug: "cordoba", nombre: "Córdoba", region: "Centro" },
  { slug: "corrientes", nombre: "Corrientes", region: "Noreste" },
  { slug: "entre-rios", nombre: "Entre Ríos", region: "Centro" },
  { slug: "formosa", nombre: "Formosa", region: "Noreste" },
  { slug: "jujuy", nombre: "Jujuy", region: "Noroeste" },
  { slug: "la-pampa", nombre: "La Pampa", region: "Centro" },
  { slug: "la-rioja", nombre: "La Rioja", region: "Noroeste" },
  { slug: "mendoza", nombre: "Mendoza", region: "Cuyo" },
  { slug: "misiones", nombre: "Misiones", region: "Noreste" },
  { slug: "neuquen", nombre: "Neuquén", region: "Patagonia" },
  { slug: "rio-negro", nombre: "Río Negro", region: "Patagonia" },
  { slug: "salta", nombre: "Salta", region: "Noroeste" },
  { slug: "san-juan", nombre: "San Juan", region: "Cuyo" },
  { slug: "san-luis", nombre: "San Luis", region: "Cuyo" },
  { slug: "santa-cruz", nombre: "Santa Cruz", region: "Patagonia" },
  { slug: "santa-fe", nombre: "Santa Fe", region: "Centro" },
  { slug: "santiago-del-estero", nombre: "Santiago del Estero", region: "Noroeste" },
  { slug: "tierra-del-fuego", nombre: "Tierra del Fuego", region: "Patagonia" },
  { slug: "tucuman", nombre: "Tucumán", region: "Noroeste" },
];
