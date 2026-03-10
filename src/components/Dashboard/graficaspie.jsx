import React, { Suspense } from "react";
import { Box, Heading, Center, Spinner } from "@chakra-ui/react";

const PieChartCore = React.lazy(() => import("./graficaspieCore"));

export default function PieChartComponent(props) {
  return (
    <Suspense
      fallback={
        <Box boxShadow="md" p="6" rounded="md" bg="white" minH="400px">
          <Heading size="md" mb="4">
            Grafica 02
          </Heading>
          <Center h="100%">
            <Spinner size="xl" />
          </Center>
        </Box>
      }
    >
      <PieChartCore {...props} />
    </Suspense>
  );
}
