import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import React, { Fragment, useCallback, useRef, useState } from "react"

const InputModal = (props: {
  buttonName: string
  defaultValue?: string
  handleConfirmChange: (result: string) => void
  confirmButtonName?: string
}) => {
  const {
    buttonName,
    defaultValue,
    handleConfirmChange,
    confirmButtonName = "Confirm",
  } = props

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { inputRef, highlightInput } = useInputRef()

  const { newValue, setNewValue, handleNewValueChange } = useNewValueInput()

  const handleOpen = useCallback(() => {
    onOpen()
    defaultValue && setNewValue(defaultValue)
    setTimeout(highlightInput, 10)
  }, [defaultValue, highlightInput])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      handleConfirmChange(newValue)
      onClose()
    },
    [newValue, handleConfirmChange, onClose],
  )

  return (
    <Fragment>
      <Button onClick={handleOpen}>{buttonName}</Button>
      <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Change Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding="0 2rem 2rem 2rem">
            <form onSubmit={handleSubmit}>
              <HStack>
                <Input
                  value={newValue}
                  onChange={handleNewValueChange}
                  placeholder="Name"
                  color="black"
                  borderColor="black"
                  _placeholder={{ color: "black" }}
                  ref={inputRef}
                />
                <Button type="submit" colorScheme="green">
                  {confirmButtonName}
                </Button>
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  )
}

export default InputModal

const useNewValueInput = () => {
  const [newValue, setNewValue] = useState("")
  const handleNewValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewValue(e.target.value)
    },
    [],
  )

  return { newValue, setNewValue, handleNewValueChange }
}

const useInputRef = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const highlightInput = useCallback(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [inputRef])

  return { inputRef, highlightInput }
}
