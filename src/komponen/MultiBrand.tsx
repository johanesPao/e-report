import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";
import { StateInputDrawerPenerimaanBarang } from "../fungsi/halaman/penerimaanBarang";
import { StateInputDrawerStok } from "../fungsi/halaman/stok";
import { StateInputDrawerKetersediaanStok } from "../fungsi/halaman/ketersediaanStok";

interface MultiBrandProps {
  arrayBrandLabel: DataMultiSelect[];
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
