import { MultiSelect } from "@mantine/core";
import { BrandLabel } from "../fitur_state/dataParam";
import { Dispatch, SetStateAction } from "react";

interface MultiBrandProps {
  arrayBrandLabel: BrandLabel[];
  stateNilai: string[];
  setNilai: Dispatch<SetStateAction<string[]>>;
}

const MultiBrand = ({
  arrayBrandLabel,
  stateNilai,
  setNilai,
}: MultiBrandProps) => {
  return (
    <MultiSelect
      data={arrayBrandLabel}
      limit={10}
      // valueComponent={renderPilihan}
      // itemComponent={renderItem}
      searchable
      nothingFound="Tidak ada brand ditemukan"
      value={stateNilai}
      onChange={setNilai}
      placeholder="Pilih Brand"
      label="Brand"
      clearable
      transitionProps={{
        duration: 150,
        transition: "scale-y",
        timingFunction: "ease-out",
      }}
    />
  );
};

export default MultiBrand;
