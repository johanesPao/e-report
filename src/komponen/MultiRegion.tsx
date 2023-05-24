import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { Dispatch, SetStateAction } from "react";

interface MultiRegionProps {
  arrayRegionLabel: DataMultiSelect[];
  stateNilai: string[];
  setNilai: Dispatch<SetStateAction<string[]>>;
}

const MultiRegion = ({
  arrayRegionLabel,
  stateNilai,
  setNilai,
}: MultiRegionProps) => {
  return (
    <MultiSelect
      data={arrayRegionLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada region ditemukan"
      value={stateNilai}
      onChange={setNilai}
      placeholder="Pilih Region"
      label="Region"
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

export default MultiRegion;
