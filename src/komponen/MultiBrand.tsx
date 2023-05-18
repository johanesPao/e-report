import { MultiSelect } from "@mantine/core";

const MultiBrand = () => {
  const brandData = [
    { label: "Adidas", value: "ADI" },
    { label: "Nike", value: "NIK" },
  ];

  const defaultBrand = ["ADI", "NIK"];

  return (
    <MultiSelect
      data={brandData}
      limit={10}
      // valueComponent={renderPilihan}
      // itemComponent={renderItem}
      searchable
      defaultValue={defaultBrand}
      placeholder="Pilih Brand"
      label="Brand"
    />
  );
};

export default MultiBrand;
