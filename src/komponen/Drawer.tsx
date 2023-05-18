import { useAppDispatch, useAppSelector } from "../state/hook";
import { Drawer } from "@mantine/core";

import {
  getHalaman,
  getDrawerTerbuka,
  setDrawerTerbuka,
} from "../fitur_state/event";

import InputPenjualan from "./kontenDrawer/InputPenjualan";
import InputPenerimaanBarang from "./kontenDrawer/InputPenerimaanBarang";
import InputStok from "./kontenDrawer/InputStok";
import InputKetersediaanStok from "./kontenDrawer/InputKetersediaanStok";
import InputBuyingProposal from "./kontenDrawer/InputBuyingProposal";
import InputLabaRugiToko from "./kontenDrawer/InputLabaRugiToko";

const DrawerInput = () => {
  const halaman = useAppSelector(getHalaman);
  const drawerTerbuka = useAppSelector(getDrawerTerbuka);
  const dispatch = useAppDispatch();
  const renderInput = () => {
    switch (halaman) {
      case "penjualan":
        return <InputPenjualan />;
      case "penerimaanBarang":
        return <InputPenerimaanBarang />;
      case "stok":
        return <InputStok />;
      case "ketersediaanStok":
        return <InputKetersediaanStok />;
      case "buyingProposal":
        return <InputBuyingProposal />;
      case "labaRugiToko":
        return <InputLabaRugiToko />;
      default:
        return;
    }
  };

  return (
    <Drawer
      opened={drawerTerbuka}
      onClose={() => dispatch(setDrawerTerbuka(false))}
      position="right"
      overlayProps={{ opacity: 0.5, blur: 2 }}
      size="560px"
      withCloseButton={false}
      closeOnEscape={false}
      transitionProps={{
        transition: "pop-bottom-right",
        duration: 250,
        timingFunction: "ease-out",
      }}
    >
      {renderInput()}
    </Drawer>
  );
};

export default DrawerInput;
