import React, { lazy, Suspense } from "react";
import { Box, Heading, Spinner } from "@chakra-ui/react";

// Lazy-load recharts for code splitting (heavy library)
const PieChartLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.PieChart }))
);
const PieLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Pie }))
);
const CellLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Cell }))
);
const TooltipLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Tooltip }))
);
const LegendLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Legend }))
);
const ResponsiveContainerLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.ResponsiveContainer }))
);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = ({ data }) => {
  return (
    <Box boxShadow="md" p="6" rounded="md" bg="white">
      <Heading size="md" mb="4">
        Grafica 02
      </Heading>
      <Suspense fallback={<Spinner />}>
        <ResponsiveContainerLazy width="100%" height={400}>
          <PieChartLazy>
            <PieLazy
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <CellLazy
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </PieLazy>
            <TooltipLazy />
            <LegendLazy />
          </PieChartLazy>
        </ResponsiveContainerLazy>
      </Suspense>
    </Box>
  );
};

export default PieChartComponent;
