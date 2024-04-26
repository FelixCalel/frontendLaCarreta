import { AddIcon } from "@chakra-ui/icons"
import { IconButton, Box } from "@chakra-ui/react"
import { CompModal } from "./CompModal"
import { useState } from "react";


export const BotonAgregar = ({ onOpen }) => {
 
  return (
    <><Box position="relative">
          <IconButton
              size="lg"
              aria-label="+"
              icon={<AddIcon />}
              colorScheme="teal"
              position="absolute"
              top="-15px"
              right="0px"
              boxShadow="lg"
              borderRadius="full"
              border="2px solid white"
              onClick={onOpen} />
      </Box><CompModal /></>
  )
}
