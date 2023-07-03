import { Modal } from "@mantine/core";
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
  const halaman = useAppSelector(getHalaman);
  const renderInput = () => {
    switch (halaman) {
      case "kelayakanTokoBaru": {
        return <InputPopUpKelayakanTokoBaru props={props} />;
      }
      default: {
        return null;
      }
    }
  };
  return (
    <Modal
      opened={props.togglePopUp}
      onClose={() =>
        setProps((stateSebelumnya) => ({
          ...stateSebelumnya,
          togglePopUp: false,
          judulPopUp: "",
          modePopUp: undefined,
          idPopUp: undefined,
        }))
      }
      title={props.judulPopUp}
      centered
    >
      {renderInput()}
    </Modal>
  );
};
