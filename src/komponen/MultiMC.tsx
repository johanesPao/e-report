import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";
import { StateInputDrawerPenerimaanBarang } from "../fungsi/halaman/penerimaanBarang";
import { StateInputDrawerStok } from "../fungsi/halaman/stok";
import { StateInputDrawerKetersediaanStok } from "../fungsi/halaman/ketersediaanStok";

interface MultiMCProps {
  arrayDivLabel: DataMultiSelect[];
  arrayGroupLabel: DataMultiSelect[];
  arrayCatLabel: DataMultiSelect[];
  props:
    | StateInputDrawerPenjualan
    | StateInputDrawerPenerimaanBarang
    | StateInputDrawerStok
    | StateInputDrawerKetersediaanStok;
  setProps:
    | React.Dispatch<React.SetStateAction<StateInputDrawerPenjualan>>
    | React.Dispatch<React.SetStateAction<StateInputDrawerPenerimaanBarang>>
    | React.Dispatch<React.SetStateAction<StateInputDrawerStok>>
    | React.Dispatch<React.SetStateAction<StateInputDrawerKetersediaanStok>>;
}

const MultiMC = ({
  arrayDivLabel,
  arrayGroupLabel,
  arrayCatLabel,
  props,
  setProps,
}: MultiMCProps) => {
  return (
    <>
      <MultiSelect
        data={arrayDivLabel}
        limit={10}
        searchable
        nothingFound="Tidak ada product division ditemukan"
        value={props.nilaiDiv}
        onChange={(nilai) =>
          setProps((stateSebelumnya: any) => ({
            ...stateSebelumnya,
            nilaiDiv: nilai,
          }))
        }
        placeholder="Pilih Product Division"
        label="Prod. Division"
        clearable
        transitionProps={{
          duration: 150,
          transition: "scale-y",
          timingFunction: "ease-out",
        }}
        mt={15}
        dropdownPosition="bottom"
      />
      <MultiSelect
        data={arrayGroupLabel}
        limit={10}
        searchable
        nothingFound="Tidak ada product group ditemukan"
        value={props.nilaiGrp}
        onChange={(nilai) =>
          setProps((stateSebelumnya: any) => ({
            ...stateSebelumnya,
            nilaiGrp: nilai,
          }))
        }
        placeholder="Pilih Product Group"
        label="Prod. Group"
        clearable
        transitionProps={{
          duration: 150,
          transition: "scale-y",
          timingFunction: "ease-out",
        }}
        mt={15}
        dropdownPosition="bottom"
      />
      <MultiSelect
        data={arrayCatLabel}
        limit={10}
        searchable
        nothingFound="Tidak ada product category ditemukan"
        value={props.nilaiCat}
        onChange={(nilai) =>
          setProps((stateSebelumnya: any) => ({
            ...stateSebelumnya,
            nilaiCat: nilai,
          }))
        }
        placeholder="Pilih Product Category"
        label="Prod. Category"
        clearable
        transitionProps={{
          duration: 150,
          transition: "scale-y",
          timingFunction: "ease-out",
        }}
        mt={15}
        dropdownPosition="bottom"
      />
    </>
  );
};

export default MultiMC;
