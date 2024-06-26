import { useEffect, useState } from 'react';
import Navbar from './ui/Navbar';
import useLocalStorage from './hooks/useLocalStorage';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react';
import { toast } from 'sonner';
import { LS_PREFIX, getUser } from './constants/CONSTANTS';
import Chat from './ui/Chat';

function App() {
  const { setItem } = useLocalStorage();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('Enter your details');

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (!user) {
      onOpen();
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://converse-talkwithprivacy.onrender.com'
        );

        setIsLive(true);

        console.log(response.status);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Sorry for the inconvenience', {
          description:
            "This site has reached it's monthly spend limit. Please try again later.",
          duration: 69000
        });
      }
    }

    fetchData();
  }, []);

  function handleOpen() {
    setModalTitle('Change your username');
    onOpen();
  }

  function setUser(e: any) {
    e.preventDefault();

    const inputValue = e.target[0].value;

    if (inputValue) {
      let username = inputValue.trim();
      setItem(`${LS_PREFIX}-user`, username);

      onClose();

      toast.success(
        <p className="font-heading text-sm lg:text-base">
          Welcome To Converse, {username.split(' ')[0]}
        </p>
      );
    } else {
      toast.error(
        <p className="font-heading text-sm lg:text-base">
          Please enter your username
        </p>
      );
    }
  }

  return (
    <>
      <Navbar handleOpen={handleOpen} />
      <Chat isLive={isLive} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
      >
        <ModalContent className="font-body rounded-sm">
          <>
            <ModalHeader className="text-3xl font-heading">
              {modalTitle}
            </ModalHeader>
            <form onSubmit={setUser}>
              <ModalBody>
                <Input
                  type="text"
                  color="success"
                  label="Enter Your Name"
                  className="text-black"
                  radius="none"
                  defaultValue={getUser() || ''}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  type="submit"
                  className="rounded-sm text-white font-semibold text-base"
                >
                  Start Chatting
                </Button>
              </ModalFooter>
            </form>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
