import { generateDemoReports, getDemoNarratives } from "../services.js";
import { demoNarratives } from "./mockData.js";

export async function loadDemoNarratives() {
  try {
    const narratives = await getDemoNarratives();
    return narratives?.length ? narratives : demoNarratives;
  } catch {
    return demoNarratives;
  }
}

export async function seedDemoReports() {
  return generateDemoReports();
}
