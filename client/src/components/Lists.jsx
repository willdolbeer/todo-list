import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import {
  FaEllipsisV,
  FaPlus,
  FaRegEdit,
  FaRegListAlt,
  FaRegTrashAlt,
} from 'react-icons/fa';

import { ConfirmDeleteModal, RenameModal } from './modals.jsx';
function List(props) {
  return (
    <Flex align='center'>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Actions'
          size='sm'
          variant='ghost'
          icon={<FaEllipsisV />}
        />
        <MenuList>
          <MenuItem icon={<FaRegListAlt />} onClick={() => props.selectList()}>
            View
          </MenuItem>
          <MenuItem icon={<FaRegEdit />} onClick={() => props.editList()}>
            Rename
          </MenuItem>
          <MenuItem icon={<FaRegTrashAlt />} onClick={() => props.deleteList()}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <Spacer />
      <Box cursor='pointer' w='200px' onClick={() => props.selectList()}>
        {props.list.name}
      </Box>
    </Flex>
  );
}

export default function Lists() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [listToEdit, setListToEdit] = useState();
  const [listIndexToDelete, setListIndexToDelete] = useState(-1);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // This method fetches the lists from the database.
  async function getLists() {
    const response = await fetch(`http://localhost:5050/lists/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const lists = await response.json();
    setLists(lists);
    setLoading(false);
  }

  useEffect(() => {
    getLists();
  }, []);

  // This method will delete a list
  async function createList(name) {
    try {
      const response = await fetch('http://localhost:5050/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
      });
      getLists();
      const { insertedId } = await response.json();
      if (insertedId) {
        navigate(insertedId);
      }
      setCreating(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateList(updatedList) {
    try {
      await fetch(`http://localhost:5050/lists/${updatedList._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedList),
      });
      getLists();
      setListToEdit(null);
    } catch (error) {
      console.error(error);
    }
  }

  // This method will delete a list
  async function deleteList() {
    try {
      const listId = lists[listIndexToDelete]?._id;
      if (listId) {
        const response = await fetch(`http://localhost:5050/lists/${listId}`, {
          method: 'DELETE',
        });
        const { acknowledged, deletedCount } = await response.json();
        if (acknowledged && deletedCount === 1) {
          const newLists = lists.filter((el) => el._id !== listId);
          setLists(newLists);
          setListIndexToDelete(-1);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onClose() {
    setCreating(false);
    setListToEdit(null);
  }

  function onSave(newName) {
    if (creating) {
      createList(newName);
    } else {
      updateList({
        ...listToEdit,
        name: newName,
      });
    }
  }

  function existingNames() {
    return lists.map((list) => list.name);
  }

  // This following section will display the table with the todo lists.
  return (
    <>
      <Box>
        <Heading as='h2' size='xl' textAlign='center'>
          Todo Lists
        </Heading>
        {loading ? (
          <Center height='80vh'>
            <Spinner size='xl' />
          </Center>
        ) : (
          <>
            <VStack mt='1rem'>
              {lists.map((list, index) => (
                <List
                  list={list}
                  deleteList={() => setListIndexToDelete(index)}
                  editList={() => setListToEdit(list)}
                  selectList={() => navigate(list._id)}
                  key={list._id}
                />
              ))}
            </VStack>
            <Button
              colorScheme='teal'
              size='sm'
              leftIcon={<FaPlus />}
              onClick={() => setCreating(true)}
            >
              New List
            </Button>
          </>
        )}
      </Box>
      {(creating || !!listToEdit) && (
        <RenameModal
          resource='List'
          initialValue={listToEdit?.name}
          onClose={onClose}
          onSave={onSave}
          existingNames={existingNames()}
        />
      )}
      {listIndexToDelete > -1 && (
        <ConfirmDeleteModal
          name={lists[listIndexToDelete]?.name}
          onClose={() => setListIndexToDelete(-1)}
          onDelete={() => deleteList()}
        />
      )}
    </>
  );
}
