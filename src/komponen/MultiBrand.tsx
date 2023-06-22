import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";
import { StateInputDrawerPenerimaanBarang } from "../fungsi/halaman/penerimaanBarang";

interface MultiBrandProps {
  arrayBrandLabel: DataMultiSelect[];
  props: StateInputDrawerPenjualan | StateInputDrawerPenerimaanBarang;
  setProps:
    | React.Dispatch<React.SetStateAction<StateInputDrawerPenjualan>>
    | React.Dispatch<React.SetStateAction<StateInputDrawerPenerimaanBarang>>;
}

const MultiBrand = ({ arrayBrandLabel, props, setProps }: MultiBrandProps) => {
  return (
    <MultiSelect
      data={arrayBrandLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada brand ditemukan"
      value={props.nilaiBrand}
      onChange={(nilai) =>
        setProps((stateSebelumnya: any) => ({
          ...stateSebelumnya,
          nilaiBrand: nilai,
        }))
      }
      placeholder="Pilih Brand"
      label="Brand"
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

export default MultiBrand;
