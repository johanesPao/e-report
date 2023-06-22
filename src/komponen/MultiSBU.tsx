import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";

interface MultiSBUProps {
  arraySBULabel: DataMultiSelect[];
  props: StateInputDrawerPenjualan;
  setProps: React.Dispatch<React.SetStateAction<StateInputDrawerPenjualan>>;
}

const MultiSBU = ({ arraySBULabel, props, setProps }: MultiSBUProps) => {
  return (
    <MultiSelect
      data={arraySBULabel}
      limit={10}
      searchable
      nothingFound="Tidak ada SBU ditemukan"
      value={props.nilaiSBU}
      onChange={(nilai) =>
        setProps((stateSebelumnya) => ({
          ...stateSebelumnya,
          nilaiSBU: nilai,
        }))
      }
      placeholder="Pilih SBU"
      label="SBU"
      clearable
      transitionProps={{
        duration: 150,
        transition: "scale-y",
        timingFunction: "ease-out",
      }}
      dropdownPosition="bottom"
    />
  );
};

export default MultiSBU;
