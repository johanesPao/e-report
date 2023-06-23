import React from "react";
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
import { useEffect, useMemo, useState } from "react";
import { StatePenjualan } from "../fungsi/halaman/penjualan";
import { StatePenerimaanBarang } from "../fungsi/halaman/penerimaanBarang";
import { StateStok } from "../fungsi/halaman/stok";
import { StateKetersediaanStok } from "../fungsi/halaman/ketersediaanStok";

interface PropsDrawer {
  setPropsPenjualan?: React.Dispatch<React.SetStateAction<StatePenjualan>>;
  setPropsPenerimaanBarang?: React.Dispatch<
    React.SetStateAction<StatePenerimaanBarang>
  >;
  setPropsStok?: React.Dispatch<React.SetStateAction<StateStok>>;
  setPropsKetersediaanStok?: React.Dispatch<
    React.SetStateAction<StateKetersediaanStok>
  >;
}

const DrawerInput = ({
  setPropsPenjualan,
  setPropsPenerimaanBarang,
  setPropsStok,
  setPropsKetersediaanStok,
}: PropsDrawer) => {
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

  const renderInput = useMemo(() => {
    switch (halaman) {
      case "penjualan":
        if (setPropsPenjualan) {
          return () => <InputPenjualan setProps={setPropsPenjualan} />;
        }
        return () => null;
      case "penerimaanBarang":
        if (setPropsPenerimaanBarang) {
          return () => (
            <InputPenerimaanBarang setProps={setPropsPenerimaanBarang} />
          );
        }
        return () => null;
      case "stok":
        if (setPropsStok) {
          return () => <InputStok setProps={setPropsStok} />;
        }
        return () => null;
      case "ketersediaanStok":
        if (setPropsKetersediaanStok) {
          return () => (
            <InputKetersediaanStok setProps={setPropsKetersediaanStok} />
          );
        }
        return () => null;
      case "buyingProposal":
        return () => <InputBuyingProposal />;
      case "labaRugiToko":
        return () => <InputLabaRugiToko />;
      default:
        return () => null;
    }
  }, [halaman]);

  return (
    <Drawer
      opened={drawerTerbuka}
      title={judulDrawer}
      onClose={() => dispatch(setDrawerTerbuka(false))}
      position="top"
      overlayProps={{ opacity: 0.5, blur: 2 }}
      size="auto"
      withCloseButton={false}
      closeOnEscape={false}
      transitionProps={{
        transition: "scale-y",
        duration: 250,
        timingFunction: "ease-in",
      }}
      trapFocus={false}
      // scrollAreaComponent={ScrollArea}
    >
      {renderInput()}
    </Drawer>
  );
};

export default DrawerInput;
