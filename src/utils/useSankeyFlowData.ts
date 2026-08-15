import { computed } from "vue";
import { useApplicationStore } from "../store/application";

/**
 * Composable pour construire les données du diagramme de Sankey (flux).
 * Les flux sont calculés à partir des transitions dans `statusHistory`.
 */
export function useSankeyFlowData() {
  const store = useApplicationStore();

  // Construit les liens au format attendu par chartjs-chart-sankey
  const sankeyLinks = computed(() => {
    const transitions: Record<string, number> = {};

    store.applications.forEach((app) => {
      const history = app.statusHistory || [];
      if (history.length < 2) return;

      for (let i = 0; i < history.length - 1; i++) {
        const from = history[i].status;
        const to = history[i + 1].status;
        const key = `${from}->${to}`;
        transitions[key] = (transitions[key] || 0) + 1;
      }
    });

    return Object.entries(transitions).map(([key, flow]) => {
      const [from, to] = key.split("->");
      return { from, to, flow };
    });
  });

  return { sankeyLinks };
}
