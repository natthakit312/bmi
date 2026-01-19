export type UnitSystem = "metric" | "imperial";

export function calculateBMI(weight: number, height: number, unit: UnitSystem): number | null {
  if (weight <= 0 || height <= 0) return null;
  
  if (unit === "metric") {
    // weight in kg, height in cm
    const heightM = height / 100;
    return weight / (heightM * heightM);
  } else {
    // weight in lb, height in in
    return (703 * weight) / (height * height);
  }
}

export function classifyBMI(bmi: number) {
  const rounded = Math.round(bmi * 10) / 10;
  if (rounded < 18.5) {
    return { category: "Underweight", rangeText: "Below 18.5", color: "text-blue-600" };
  }
  if (rounded < 25) {
    return { category: "Normal weight", rangeText: "18.5 to 24.9", color: "text-green-600" };
  }
  if (rounded < 30) {
    return { category: "Overweight", rangeText: "25 to 29.9", color: "text-orange-600" };
  }
  return { category: "Obesity", rangeText: "30 or higher", color: "text-red-600" };
}
