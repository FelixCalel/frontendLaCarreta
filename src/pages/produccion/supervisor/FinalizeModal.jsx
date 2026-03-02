// src/components/production/FinalizeModal.jsx
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Checkbox,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

const FinalizeModal = ({
  isOpen,
  onClose,
  comment,
  onChangeComment,
  noComment,
  onToggleNoComment,
  onAccept,
  isSending,
  isCommentRequired = false,
  label = "Comentario",
}) => {
  const overlayBg = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
  const modalBg = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.600");
  const inputBorder = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay bg={overlayBg} />

      <ModalContent bg={modalBg} borderRadius="lg" p={6}>
        <ModalHeader color={textColor}>{label}</ModalHeader>

        <ModalBody>
          <Textarea
            value={comment}
            onChange={(e) => onChangeComment(e.target.value)}
            placeholder={
              isCommentRequired
                ? "Este comentario es obligatorio"
                : "Escribe aquí tu comentario"
            }
            bg={inputBg}
            borderColor={
              isCommentRequired && !comment.trim() ? "red.500" : inputBorder
            }
            color={textColor}
            resize="vertical"
            minH="160px"
            isDisabled={noComment}
            _hover={{
              borderColor:
                isCommentRequired && !comment.trim() ? "red.600" : undefined,
            }}
          />

          {!isCommentRequired && (
            <Checkbox
              mt={4}
              isChecked={noComment}
              onChange={onToggleNoComment}
              color={textColor}
            >
              Ningún comentario
            </Checkbox>
          )}
        </ModalBody>

        <ModalFooter>
          <Stack direction="row" spacing={3}>
            <Button variant="outline" colorScheme="red" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={onAccept}
              isLoading={isSending}
            >
              Aceptar
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

FinalizeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired,
  onChangeComment: PropTypes.func.isRequired,
  noComment: PropTypes.bool.isRequired,
  onToggleNoComment: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
};

export default FinalizeModal;
