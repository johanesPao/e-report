import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";

interface MultiKlasifikasiProps {
  arrayKlasifikasiLabel: DataMultiSelect[];
  props: StateInputDrawerPenjualan;
  setProps: React.Dispatch<React.SetStateAction<StateInputDrawerPenjualan>>;
}

const MultiKlasifikasi = ({
  arrayKlasifikasiLabel,
  props,
  setProps,
}: MultiKlasifikasiProps) => {
  return (
    <MultiSelect
      data={arrayKlasifikasiLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada klasifikasi ditemukan"
      value={props.nilaiKlasifikasi}
      onChange={(nilai) =>
        setProps((stateSebelumnya) => ({
          ...stateSebelumnya,
          nilaiKlasifikasi: nilai,
        }))
      }
      placeholder="Pilih Klasifikasi"
      label="Klasifikasi"
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

export default MultiKlasifikasi;
