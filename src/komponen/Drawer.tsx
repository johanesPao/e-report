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
import { useEffect, useState } from "react";

const DrawerInput = () => {
  const halaman = useAppSelector(getHalaman);
  const drawerTerbuka = useAppSelector(getDrawerTerbuka);
  const dispatch = useAppDispatch();
  const [judulDrawer, setJudulDrawer] = useState("");

  useEffect(() => {
    switch (halaman) {
      case "penjualan":
        setJudulDrawer("Input Parameter Penjualan");
        break;
      case "penerimaanBarang":
        setJudulDrawer("Input Parameter Penerimaan Barang");
        break;
      case "stok":
        setJudulDrawer("Input Parameter Stok");
        break;
      case "ketersediaanStok":
        setJudulDrawer("Input Parameter Ketersediaan Stok");
        break;
      case "buyingProposal":
        setJudulDrawer("Input Parameter Buying Proposal");
        break;
      case "labaRugiToko":
        setJudulDrawer("Input Parameter Laba Rugi Toko");
        break;
      default:
        setJudulDrawer("");
        break;
    }
  }, [halaman]);

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
      title={judulDrawer}
      onClose={() => dispatch(setDrawerTerbuka(false))}
      position="top"
      overlayProps={{ opacity: 0.5, blur: 2 }}
      size="560px"
      withCloseButton={false}
      closeOnEscape={false}
      transitionProps={{
        transition: "scale-y",
        duration: 250,
        timingFunction: "ease-in",
      }}
      trapFocus={false}
    >
      {renderInput()}
    </Drawer>
  );
};

export default DrawerInput;
