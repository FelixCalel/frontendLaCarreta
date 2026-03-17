import React, { Suspense } from "react";
import { Box, Heading, Center, Spinner } from "@chakra-ui/react";

const ChartCore = React.lazy(() => import("./graficasCore"));

export default function BarChartComponent(props) {
  return (
    <Suspense
      fallback={
        <Box boxShadow="md" p="6" rounded="md" bg="white" minH="300px">
          <Heading size="md" mb="4">
            Grafica 01
          </Heading>
          <Center h="100%">
            <Spinner size="xl" />
          </Center>
        </Box>
      }
    >
      <ChartCore {...props} />
    </Suspense>
  );
}
