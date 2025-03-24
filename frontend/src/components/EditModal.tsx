import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
  import { useState, ChangeEvent, FormEvent } from "react";
  import { BiEditAlt } from "react-icons/bi";
  import React from "react";
  // Type for the user prop
  interface User {
    id: string;
    name: string;
    role: string;
    description: string;
  }
  
  // Props for the EditModal component
  interface EditModalProps {
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    user: User;
  }
  
  const EditModal: React.FC<EditModalProps> = ({ setUsers, user }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
      name: user.name,
      role: user.role,
      description: user.description,
    });
    const toast = useToast();
  
    const handleEditUser = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const res = await fetch(BASE_URL + "/friends/" + user.id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? data : u)));
        toast({
          status: "success",
          title: "Yayy! 🎉",
          description: "Friend updated successfully.",
          duration: 2000,
          position: "top-center",
        });
        onClose();
      } catch (error) {
        toast({
          status: "error",
          title: "An error occurred.",
          description: error.message,
          duration: 4000,
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    return (
      <>
        <IconButton
          onClick={onOpen}
          variant="ghost"
          colorScheme="blue"
          aria-label="See menu"
          size={"sm"}
          icon={<BiEditAlt size={20} />}
        />
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <form onSubmit={handleEditUser}>
            <ModalContent>
              <ModalHeader>My new BFF 😍</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Flex alignItems={"center"} gap={4}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      placeholder="John Doe"
                      value={inputs.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
  
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Input
                      name="role"
                      placeholder="Software Engineer"
                      value={inputs.role}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Flex>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    resize={"none"}
                    overflowY={"hidden"}
                    placeholder="He's a software engineer who loves to code and build things."
                    value={inputs.description}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </ModalBody>
  
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
                  Update
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </>
    );
  };
  
  export default EditModal;
  