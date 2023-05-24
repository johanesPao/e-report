import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { Dispatch, SetStateAction } from "react";

interface MultiSBUProps {
  arraySBULabel: DataMultiSelect[];
  stateNilai: string[];
  setNilai: Dispatch<SetStateAction<string[]>>;
}

const MultiSBU = ({ arraySBULabel, stateNilai, setNilai }: MultiSBUProps) => {
  return (
    <MultiSelect
      data={arraySBULabel}
      limit={10}
      searchable
      nothingFound="Tidak ada SBU ditemukan"
      value={stateNilai}
      onChange={setNilai}
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
