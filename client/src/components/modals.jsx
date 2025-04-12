import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

export const RenameModal = (props) => {
  const [editingInput, setEditingInput] = useState(props.initialValue ?? '');

  function submitRename(e) {
    e.preventDefault();
    props.onSave(editingInput.trim());
  }

  return (
    <Modal isOpen={true} onClose={() => props.onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {!!props.initialValue ? 'Rename' : 'New'} {props.resource}
        </ModalHeader>
        <form onSubmit={submitRename}>
          <ModalBody>
            <Input
              placeholder={`${props.resource} Name`}
              value={editingInput}
              onChange={(e) => setEditingInput(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='teal'
              size='sm'
              variant='ghost'
              onClick={() => props.onClose()}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              ml='0.5rem'
              colorScheme='teal'
              size='sm'
              isDisabled={
                !editingInput.trim() ||
                props.existingNames.includes(editingInput.trim())
              }
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const ConfirmDeleteModal = (props) => {
  return (
    <Modal size='sm' onClose={() => props.onClose()} isOpen={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {props.name}?</ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <Button
            colorScheme='teal'
            size='sm'
            variant='ghost'
            onClick={() => props.onClose()}
          >
            Cancel
          </Button>
          <Button
            ml='0.5rem'
            colorScheme='teal'
            size='sm'
            onClick={() => props.onDelete()}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
