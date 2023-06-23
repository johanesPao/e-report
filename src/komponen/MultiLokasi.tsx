import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";
import { StateInputDrawerPenerimaanBarang } from "../fungsi/halaman/penerimaanBarang";
import { StateInputDrawerStok } from "../fungsi/halaman/stok";
import { StateInputDrawerKetersediaanStok } from "../fungsi/halaman/ketersediaanStok";

interface MultiLokasiProps {
  arrayLokasiLabel: DataMultiSelect[];
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

const MultiLokasi = ({
  arrayLokasiLabel,
  props,
  setProps,
}: MultiLokasiProps) => {
  return (
    <MultiSelect
      data={arrayLokasiLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada lokasi ditemukan"
      value={props.nilaiLokasi}
      onChange={(nilai) =>
        setProps((stateSebelumnya: any) => ({
          ...stateSebelumnya,
          nilaiLokasi: nilai,
        }))
      }
      placeholder="Pilih Lokasi"
      label="Lokasi"
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

export default MultiLokasi;
