import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { Dispatch, SetStateAction } from "react";

interface MultiMCProps {
  arrayDivLabel: DataMultiSelect[];
  arrayGroupLabel: DataMultiSelect[];
  arrayCatLabel: DataMultiSelect[];
  stateDiv: string[];
  stateGroup: string[];
  stateCat: string[];
  setDiv: Dispatch<SetStateAction<string[]>>;
  setGroup: Dispatch<SetStateAction<string[]>>;
  setCat: Dispatch<SetStateAction<string[]>>;
}

const MultiMC = ({
  arrayDivLabel,
  arrayGroupLabel,
  arrayCatLabel,
  stateDiv,
  stateGroup,
  stateCat,
  setDiv,
  setGroup,
  setCat,
}: MultiMCProps) => {
  return (
    <>
      <MultiSelect
        data={arrayDivLabel}
        limit={10}
        searchable
        nothingFound="Tidak ada product division ditemukan"
        value={stateDiv}
        onChange={setDiv}
        placeholder="Pilih Product Division"
        label="Prod. Division"
        clearable
        transitionProps={{
          duration: 150,
          transition: "scale-y",
          timingFunction: "ease-out",
        }}
        mt={15}
      />
      <MultiSelect
        data={arrayGroupLabel}
        limit={10}
        searchable
        nothingFound="Tidak ada product group ditemukan"
        value={stateGroup}
        onChange={setGroup}
        placeholder="Pilih Product Group"
        label="Prod. Group"
        clearable
        transitionProps={{
          duration: 150,
          transition: "scale-y",
          timingFunction: "ease-out",
        }}
        mt={15}
      />
      <MultiSelect
        data={arrayCatLabel}
        limit={10}
        searchable
        nothingFound="Tidak ada product category ditemukan"
        value={stateCat}
        onChange={setCat}
        placeholder="Pilih Product Category"
        label="Prod. Category"
        clearable
        transitionProps={{
          duration: 150,
          transition: "scale-y",
          timingFunction: "ease-out",
        }}
        mt={15}
      />
    </>
  );
};

export default MultiMC;
