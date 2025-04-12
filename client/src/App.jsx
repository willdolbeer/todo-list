import { ChakraProvider, Container } from '@chakra-ui/react';

import { AppRouter } from './router.jsx';

const App = () => {
  return (
    <ChakraProvider>
      <Container>
        <AppRouter />
      </Container>
    </ChakraProvider>
  );
};
export default App;
