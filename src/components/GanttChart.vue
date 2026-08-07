<template>
  <div class="gantt-wrapper">
    <div v-if="ganttData.length === 0" class="text-gray-500">
      Aucune donnée à afficher. Ajoutez des modifications de statut pour voir le
      Gantt.
    </div>
    <div v-else class="gantt-scroll">
      <div class="gantt-chart" :style="{ width: totalWidth + 'px' }">
        <!-- En-tête des dates -->
        <div class="gantt-header">
          <div class="gantt-label-header">Candidature</div>
          <div class="gantt-timeline-header">
            <div
              v-for="tick in dateTicks"
              :key="tick.label + '-' + tick.left"
              class="gantt-tick"
              :style="{ left: tick.left + 'px' }"
            >
              <span class="tick-label">{{ tick.label }}</span>
              <span class="tick-line"></span>
            </div>
          </div>
        </div>

        <!-- Lignes des candidatures -->
        <div v-for="item in ganttData" :key="item.id" class="gantt-row">
          <div class="gantt-label">{{ item.title }}</div>
          <div class="gantt-timeline">
            <div
              v-for="(segment, idx) in item.segments"
              :key="idx"
              class="gantt-segment"
              :style="{
                left: segment.left + 'px',
                width: segment.width + 'px',
                backgroundColor: segment.color,
              }"
              :title="`${segment.status} (${segment.start} → ${segment.end})`"
            >
              <span class="segment-label" v-if="segment.width > 40">
                {{ segment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApplicationStore } from "../store/application";

const appStore = useApplicationStore();

// Paramètres de mise à l'échelle
const MIN_CHART_WIDTH = 700; // largeur minimale du graphique en pixels
const MIN_DAY_WIDTH = 6; // pixels par jour minimum (7 jours d'écart = 42px → pas de chevauchement)

const statusColors: Record<string, string> = {
  pending: "#facc15",
  call: "#60a5fa",
  HRInterview: "#c084fc",
  technicalInterview: "#818cf8",
  accepted: "#4ade80",
  refused: "#f87171",
  abandoned: "#9ca3af",
};

// Plage de dates globale (en ms)
const globalRange = computed(() => {
  let min = Infinity;
  let max = -Infinity;
  appStore.applications.forEach((app) => {
    if (app.statusHistory && app.statusHistory.length > 0) {
      const start = new Date(app.statusHistory[0].date).getTime();
      const end = new Date(
        app.statusHistory[app.statusHistory.length - 1].date,
      ).getTime();
      if (start < min) min = start;
      if (end > max) max = end;
    }
  });
  if (min === Infinity) {
    const now = Date.now();
    return { min: now, max: now + 86400000 * 30 };
  }
  // Marge de 5 jours de chaque côté
  const pad = 5 * 86400000;
  return { min: min - pad, max: max + pad };
});

// Nombre total de jours
const totalDays = computed(
  () => (globalRange.value.max - globalRange.value.min) / 86400000,
);

// Largeur dynamique par jour (pixels/jour)
const dayWidth = computed(() => {
  if (totalDays.value * MIN_DAY_WIDTH >= MIN_CHART_WIDTH) {
    return MIN_DAY_WIDTH;
  } else {
    return MIN_CHART_WIDTH / totalDays.value;
  }
});

// Largeur totale du graphique (px)
const totalWidth = computed(() =>
  Math.max(totalDays.value * dayWidth.value, MIN_CHART_WIDTH),
);

// Repères de dates (tous les 7 jours)
const dateTicks = computed(() => {
  const ticks: { label: string; left: number }[] = [];
  const start = new Date(globalRange.value.min);
  const end = new Date(globalRange.value.max);
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);

  while (current <= end) {
    const time = current.getTime();
    const left = ((time - globalRange.value.min) / 86400000) * dayWidth.value;
    const isFirstOfMonth = current.getDate() === 1;
    const label = isFirstOfMonth
      ? current.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
      : current.getDate().toString();

    // Éviter d'empiler des labels trop proches (moins de 40px d'écart)
    const lastTick = ticks[ticks.length - 1];
    if (!lastTick || left - lastTick.left > 40) {
      ticks.push({ label, left });
    }
    current.setDate(current.getDate() + 7);
  }
  return ticks;
});

// Données transformées pour l'affichage
const ganttData = computed(() => {
  const min = globalRange.value.min;
  return appStore.applications
    .filter((app) => app.statusHistory && app.statusHistory.length > 0)
    .map((app) => {
      const segments = app.statusHistory!.map((entry, index, arr) => {
        const startMs = new Date(entry.date).getTime();
        const endMs =
          index < arr.length - 1
            ? new Date(arr[index + 1].date).getTime()
            : Date.now();
        const left = ((startMs - min) / 86400000) * dayWidth.value;
        const width = ((endMs - startMs) / 86400000) * dayWidth.value;
        return {
          status: entry.status,
          start: entry.date,
          end:
            index < arr.length - 1
              ? arr[index + 1].date
              : new Date().toISOString().slice(0, 10),
          color: statusColors[entry.status] || "#d1d5db",
          left,
          width: Math.max(width, 2), // largeur minimale visible
        };
      });
      return {
        id: app._id!,
        title: app.title,
        segments,
      };
    });
});
</script>

<style scoped>
/* (le même que précédemment) */
.gantt-wrapper {
  width: 100%;
}

.gantt-scroll {
  overflow-x: auto;
  padding-bottom: 8px;
}

.gantt-chart {
  min-width: 100%;
  position: relative;
}

.gantt-header {
  display: flex;
  align-items: flex-end;
  height: 50px;
  margin-bottom: 4px;
}

.gantt-label-header {
  width: 150px;
  flex-shrink: 0;
  font-weight: 600;
  align-self: center;
}

.gantt-timeline-header {
  flex: 1;
  position: relative;
  height: 100%;
  margin-left: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.gantt-tick {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tick-label {
  font-size: 0.7rem;
  color: #6b7280;
  white-space: nowrap;
  margin-bottom: 2px;
}

.tick-line {
  width: 1px;
  flex: 1;
  background-color: #e5e7eb;
}

.gantt-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.gantt-label {
  width: 150px;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}

.gantt-timeline {
  flex: 1;
  position: relative;
  height: 24px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-left: 8px;
}

.gantt-segment {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-size: 0.7rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  transition: opacity 0.2s;
}

.gantt-segment:hover {
  opacity: 0.85;
}

.segment-label {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
