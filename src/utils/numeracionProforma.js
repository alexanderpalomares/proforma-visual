// src/utils/numeracionProforma.js
const STORAGE_KEY = "proformaNumeracion:v1";
const PREFIX = "PF";

const getYear = () => new Date().getFullYear();

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { year: getYear(), counter: 0 };
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.year !== "number" ||
      typeof parsed.counter !== "number"
    ) {
      return { year: getYear(), counter: 0 };
    }
    return parsed;
  } catch {
    return { year: getYear(), counter: 0 };
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const formatNum = (year, counter, pad = 4) =>
  `${PREFIX}-${year}-${String(counter).padStart(pad, "0")}`;

/** Muestra el próximo número SIN consumir (para previsualización). */
export function peekNextProformaNumber({ pad = 4 } = {}) {
  const { year, counter } = loadState();
  const currentYear = getYear();
  const next = year === currentYear ? counter + 1 : 1;
  return formatNum(currentYear, next, pad);
}

/** Obtiene y PERSISTE el siguiente número (úsalo al confirmar/exportar). */
export function getNextProformaNumber({ pad = 4 } = {}) {
  const currentYear = getYear();
  let { year, counter } = loadState();

  if (year !== currentYear) {
    year = currentYear;
    counter = 0; // reset anual
  }

  counter += 1;
  saveState({ year, counter });
  return formatNum(year, counter, pad);
}

/** (Opcional) Setear contador manual (para migraciones). */
export function setProformaCounter(n) {
  const counter = Math.max(0, parseInt(n, 10) || 0);
  saveState({ year: getYear(), counter });
}

/** (Opcional) Leer estado actual. */
export function getProformaState() {
  return loadState();
}
