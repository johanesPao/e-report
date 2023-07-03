import { StateKelayakanTokoBaru } from "../../fungsi/halaman/kelayakanTokoBaru";

export const InputPopUpKelayakanTokoBaru = ({
  props,
}: {
  props: StateKelayakanTokoBaru;
}) => {
  return <>{props.idPopUp}</>;
};
