import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Heading } from '@chakra-ui/react';

const BarChartComponent = ({ data }) => {
  return (
    <Box boxShadow="md" p="6" rounded="md" bg="white">
       <Heading size="md" mb="4">Grafica 01</Heading>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </Box>
  );
};

export default BarChartComponent;
