import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ChakraProvider } from '@chakra-ui/react'

const App = () => {
  return (
      <ChakraProvider>
        <div className="w-full p-6">
          <Navbar />
          <Outlet />
        </div>
      </ChakraProvider>
  );
};
export default App