import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { Dispatch, SetStateAction } from "react";

interface MultiKlasifikasiProps {
  arrayKlasifikasiLabel: DataMultiSelect[];
  stateNilai: string[];
  setNilai: Dispatch<SetStateAction<string[]>>;
}

const MultiKlasifikasi = ({
  arrayKlasifikasiLabel,
  stateNilai,
  setNilai,
}: MultiKlasifikasiProps) => {
  return (
    <MultiSelect
      data={arrayKlasifikasiLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada klasifikasi ditemukan"
      value={stateNilai}
      onChange={setNilai}
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
