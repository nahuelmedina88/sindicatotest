// components/redux/utils/normalizeFirestore.js

/**
 * Normaliza datos de Firestore para que sean serializables por Redux:
 * - Timestamp  -> string ISO (o null)
 * - DocumentReference -> objeto plano con id y path
 * - GeoPoint   -> objeto { lat, lng }
 * - Anida de forma recursiva en arrays/objetos
 */

function isPlainObject(value) {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    (value.constructor === Object || value.constructor == null)
  );
}

function normalizeValue(v) {
  if (v == null) return v;

  // Firestore Timestamp (tiene toDate y seconds)
  if (typeof v?.toDate === "function" && typeof v?.seconds === "number") {
    try {
      const d = v.toDate();
      return d instanceof Date && !isNaN(d) ? d.toISOString() : null;
    } catch {
      return null;
    }
  }

  // Date nativa
  if (v instanceof Date) return isNaN(v) ? null : v.toISOString();

  // GeoPoint (heurística: tiene latitude/longitude numéricos)
  if (
    typeof v?.latitude === "number" &&
    typeof v?.longitude === "number" &&
    Object.keys(v).length <= 3 // latitude, longitude, possibly _methodName
  ) {
    return { lat: v.latitude, lng: v.longitude };
  }

  // DocumentReference (heurística: id y path string)
  if (typeof v?.id === "string" && typeof v?.path === "string") {
    return { _refId: v.id, _refPath: v.path };
  }

  // Array
  if (Array.isArray(v)) return v.map(normalizeValue);

  // Objeto plano
  if (isPlainObject(v)) {
    const out = {};
    for (const k of Object.keys(v)) out[k] = normalizeValue(v[k]);
    return out;
  }

  // Otro tipo (string, number, boolean, etc.)
  return v;
}

export function normalizeFirestore(data) {
  return normalizeValue(data);
}

export default normalizeFirestore;