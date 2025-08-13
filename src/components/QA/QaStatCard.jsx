import PropTypes from "prop-types";
import {
  Box,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function QaStatCard({ title, value }) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <MotionBox
      bg={bg}
      border="1px solid"
      borderColor={border}
      rounded="xl"
      p={5}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      textAlign="center"
      shadow="sm"
    >
      <Stat>
        <StatLabel opacity={0.7}>{title}</StatLabel>
        <StatNumber fontSize="3xl" lineHeight={1}>
          {value}
        </StatNumber>
      </Stat>
    </MotionBox>
  );
}
QaStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
