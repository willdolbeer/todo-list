import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { FaArrowLeft, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

import { ConfirmDeleteModal, RenameModal } from './modals.jsx';

export default function ListDetail(props) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [taskIndexToDelete, setTaskIndexToDelete] = useState(-1);
  const [taskIndexToEdit, setTaskIndexToEdit] = useState(-1);
  const params = useParams();
  const navigate = useNavigate();

  async function fetchList() {
    try {
      const listId = params.listId?.toString() || undefined;
      const response = await fetch(`http://localhost:5050/lists/${listId}`);
      const listResp = await response.json();
      if (!listResp) {
        console.warn(`ListDetail with id ${listId} not found`);
        navigate('/');
      } else {
        setList(listResp);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  function createTask(e) {
    e.preventDefault();
    const updatedList = { ...list };
    updatedList.tasks.push({
      name: newTaskInput,
      status: 'todo',
    });
    updateList(updatedList, true);
  }

  function updateTask(task, index) {
    const updatedList = { ...list };
    updatedList.tasks[index] = task;
    updateList(updatedList);
  }

  function deleteTask() {
    const updatedList = {
      ...list,
      tasks: list?.tasks.filter((_, index) => index !== taskIndexToDelete),
    };
    setTaskIndexToDelete(-1);
    updateList(updatedList);
  }

  async function updateList(updatedList, clearInput) {
    try {
      const response = await fetch(`http://localhost:5050/lists/${list._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedList),
      });
      if (clearInput) {
        setNewTaskInput('');
      }
      if (taskIndexToEdit > -1) {
        setTaskIndexToEdit(-1);
      }
      fetchList();
    } catch (error) {
      console.error(error);
    }
  }

  // This following section will display the form that takes the input from the user.
  return loading ? (
    <Center height='80vh'>
      <Spinner size='xl' />
    </Center>
  ) : (
    !!list && (
      <>
        <h3 className='text-lg font-semibold p-4'>
          <IconButton
            isRound
            m='0 0.5rem 0 -1rem'
            size='xs'
            variant='solid'
            colorScheme='teal'
            aria-label='Back to Lists'
            icon={<FaArrowLeft />}
            onClick={() => navigate('/')}
          />
          {list.name} Tasks
        </h3>
        {list.tasks.map((task, index) => (
          <Flex
            key={index}
            borderTop={index > 0 ? '1px solid rgb(237, 242, 247)' : 0}
            p='0.5rem'
          >
            <Box>
              <Checkbox
                isChecked={task.status === 'done'}
                onChange={(e) =>
                  updateTask(
                    {
                      ...task,
                      status: e.target.checked ? 'done' : 'todo',
                    },
                    index,
                  )
                }
              >
                {task.name}
              </Checkbox>
            </Box>
            <Spacer />
            <Box>
              <ButtonGroup size='sm'>
                <IconButton
                  aria-label='Edit Task'
                  icon={<FaRegEdit />}
                  onClick={() => setTaskIndexToEdit(index)}
                />
                <IconButton
                  aria-label='Delete Task'
                  icon={<FaRegTrashAlt />}
                  onClick={() => setTaskIndexToDelete(index)}
                />
              </ButtonGroup>
            </Box>
          </Flex>
        ))}
        <form onSubmit={createTask}>
          <InputGroup mt='1rem'>
            <Input
              placeholder='New Task'
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
            />
            <InputRightElement w='3rem'>
              <Button
                type='submit'
                mr='0.25rem'
                colorScheme='teal'
                size='sm'
                isDisabled={!newTaskInput}
              >
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
        {taskIndexToEdit > -1 && (
          <RenameModal
            resource='Task'
            initialValue={list.tasks[taskIndexToEdit]?.name}
            onClose={() => setTaskIndexToEdit(-1)}
            onSave={(newName) =>
              updateTask(
                {
                  ...list.tasks[taskIndexToEdit],
                  name: newName,
                },
                taskIndexToEdit,
              )
            }
            existingNames={list.tasks.map(({ name }) => name)}
          />
        )}
        {taskIndexToDelete > -1 && (
          <ConfirmDeleteModal
            name={list?.tasks[taskIndexToDelete]?.name}
            onClose={() => setTaskIndexToDelete(-1)}
            onDelete={() => deleteTask()}
          />
        )}
      </>
    )
  );
}
