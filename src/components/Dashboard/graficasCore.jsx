import React, { lazy, Suspense } from "react";
import { Box, Heading, Spinner } from "@chakra-ui/react";

// Lazy-load recharts for code splitting (heavy library)
const BarChartLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.BarChart }))
);
const BarLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Bar }))
);
const XAxisLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.XAxis }))
);
const YAxisLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.YAxis }))
);
const CartesianGridLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.CartesianGrid }))
);
const TooltipLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Tooltip }))
);
const LegendLazy = lazy(() =>
  import("recharts").then((m) => ({ default: m.Legend }))
);

const BarChartComponent = ({ data }) => {
  return (
    <Box boxShadow="md" p="6" rounded="md" bg="white">
      <Heading size="md" mb="4">
        Grafica 01
      </Heading>
      <Suspense fallback={<Spinner />}>
        <BarChartLazy
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGridLazy strokeDasharray="3 3" />
          <XAxisLazy dataKey="name" />
          <YAxisLazy />
          <TooltipLazy />
          <LegendLazy />
          <BarLazy dataKey="pv" fill="#8884d8" />
          <BarLazy dataKey="uv" fill="#82ca9d" />
        </BarChartLazy>
      </Suspense>
    </Box>
  );
};

export default BarChartComponent;
