import {
  Modal,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { StateKelayakanTokoBaru } from "../fungsi/halaman/kelayakanTokoBaru";
import { useAppSelector } from "../state/hook";
import { getHalaman } from "../fitur_state/event";
import { InputPopUpKelayakanTokoBaru } from "./kontenPopUp/InputPopUpKelayakanTokoBaru";

export const PopUp = ({
  props,
  setProps,
}: {
  props: StateKelayakanTokoBaru;
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>;
}) => {
  const theme = useMantineTheme();
  const halaman = useAppSelector(getHalaman);
  const renderInput = () => {
    switch (halaman) {
      case "kelayakanTokoBaru": {
        return (
          <InputPopUpKelayakanTokoBaru props={props} setProps={setProps} />
        );
      }
      default: {
        return null;
      }
    }
  };
  return (
    <Modal.Root
      opened={props.popUp.togglePopUp}
      onClose={() =>
        setProps((stateSebelumnya) => ({
          ...stateSebelumnya,
          popUp: {
            togglePopUp: false,
            judulPopUp: "",
            dataPopUp: undefined,
          },
        }))
      }
      size="100%"
      centered
      transitionProps={{ transition: "slide-down", duration: 500 }}
      radius="md"
    >
      <Modal.Overlay blur={1} />
      <Modal.Content>
        <Modal.Header sx={{ backgroundColor: theme.colors.blue[9] }} p={10}>
          <Modal.Title>
            <Title order={4} color="white">
              {props.popUp.judulPopUp}
            </Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body m={15}>{renderInput()}</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
