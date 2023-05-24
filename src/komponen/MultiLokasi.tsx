import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { Dispatch, SetStateAction } from "react";

interface MultiLokasiProps {
  arrayLokasiLabel: DataMultiSelect[];
  stateNilai: string[];
  setNilai: Dispatch<SetStateAction<string[]>>;
}

const MultiLokasi = ({
  arrayLokasiLabel,
  stateNilai,
  setNilai,
}: MultiLokasiProps) => {
  return (
    <MultiSelect
      data={arrayLokasiLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada lokasi ditemukan"
      value={stateNilai}
      onChange={setNilai}
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
