import { invoke } from "@tauri-apps/api/tauri";
import { toTitle } from "./basic";
import { DataMultiSelect } from "../fitur_state/dataParam";

export const brandLabel = async (parameterBc: any, comp: string) => {
  const kueri: string = `
    SELECT DISTINCT
      a.${parameterBc.kolom_bc.brand_dim} AS [Brand],
      b.${parameterBc.kolom_bc.name} AS [Label]
    FROM [${comp}${parameterBc.tabel_bc.jurnal_item_437}] AS a
    LEFT JOIN [${comp}${parameterBc.tabel_bc.dim_val_437}] AS b
    ON
      a.${parameterBc.kolom_bc.brand_dim} = b.${parameterBc.kolom_bc.code} AND
      b.${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.brand}'
    WHERE
      a.${parameterBc.kolom_bc.brand_dim} != '' AND
      a.${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
  `;

  // tarik data brand
  try {
    console.log(kueri);
    const respon: string = await invoke("kueri_sederhana", {
      kueri,
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrBrandLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrBrandLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      return arrBrandLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

export const mcLabel = async (parameterBc: any, comp: string) => {
  const kueri: string[] = [
    `
  SELECT DISTINCT
      a.${parameterBc.kolom_bc.prod_div} AS [Division Code],
      b.${parameterBc.kolom_bc.name} AS [Division Desc]
    FROM [${comp}${parameterBc.tabel_bc.jurnal_item_a21}] AS a
    LEFT JOIN [${comp}${parameterBc.tabel_bc.dim_val_437}] AS b
    ON
      a.${parameterBc.kolom_bc.prod_div} = b.${parameterBc.kolom_bc.code} AND
      b.${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.prod_div}'
    WHERE
      a.${parameterBc.kolom_bc.prod_div} != ''
  `,
    `
  SELECT DISTINCT
      a.${parameterBc.kolom_bc.prod_group} AS [Group Code],
      b.${parameterBc.kolom_bc.name} AS [Group Desc]
    FROM [${comp}${parameterBc.tabel_bc.jurnal_item_a21}] AS a
    LEFT JOIN [${comp}${parameterBc.tabel_bc.dim_val_437}] AS b
    ON
      a.${parameterBc.kolom_bc.prod_group} = b.${parameterBc.kolom_bc.code} AND
      b.${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.prod_group}'
    WHERE
      a.${parameterBc.kolom_bc.prod_group} != ''
  `,
    `
  SELECT DISTINCT
      a.${parameterBc.kolom_bc.prod_cat} AS [Category Code],
      b.${parameterBc.kolom_bc.name} AS [Category Desc]
    FROM [${comp}${parameterBc.tabel_bc.jurnal_item_a21}] AS a
    LEFT JOIN [${comp}${parameterBc.tabel_bc.dim_val_437}] AS b
    ON
      a.${parameterBc.kolom_bc.prod_cat} = b.${parameterBc.kolom_bc.code} AND
      b.${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.prod_cat}'
    WHERE
      a.${parameterBc.kolom_bc.prod_cat} != ''
  `,
  ];

  // tarik data MC
  try {
    let arrMcLabel: DataMultiSelect[][][] = [];
    const mcLabelPromises = kueri.map(async (kueriItem) => {
      console.log(kueriItem);
      const respon: string = await invoke("kueri_sederhana", {
        kueri: kueriItem,
      });
      const hasil = JSON.parse(respon);
      if (hasil !== undefined && hasil.length !== 0) {
        // destrukturisasi dan labeling
        let arrMc: DataMultiSelect[] = [];
        hasil["konten"].map((mcItem: string) => {
          arrMc.push({ label: toTitle(mcItem[1]), value: mcItem[0] });
        });
        return arrMc;
      }
    });

    const mcLabelJamak = await Promise.all(mcLabelPromises);
    const mcLabelValid = mcLabelJamak.filter(
      (hasil): hasil is DataMultiSelect[] => hasil !== undefined
    );
    arrMcLabel.push(mcLabelValid);
    return arrMcLabel;
  } catch (e) {
    console.log(e);
  }
};

export const lokasiLabel = async (parameterBc: any, comp: string) => {
  const kueri: string = `
    SELECT DISTINCT
      ${parameterBc.kolom_bc.loc_code} AS [Kode Lokasi]
    FROM [${comp}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
      ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
      ${parameterBc.kolom_bc.brand_dim} != '' AND
      ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
  `;

  // tarik data lokasi
  try {
    console.log(kueri);
    const respon: string = await invoke("kueri_sederhana", {
      kueri,
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrLokasiLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrLokasiLabel.push({ label: data[0], value: data[0] })
      );
      return arrLokasiLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

export const klasifikasiLabel = async (parameterBc: any, comp: string) => {
  const kueri: string = `
    SELECT DISTINCT
      ${parameterBc.kolom_bc.code} AS [Kode Klasifikasi],
      ${parameterBc.kolom_bc.name} AS [Deskripsi Klasifikasi]
    FROM [${comp}${parameterBc.tabel_bc.dim_val_437}]
    WHERE
      ${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.classification}'
  `;

  // tarik data klasifikasi
  try {
    console.log(kueri);
    const respon: string = await invoke("kueri_sederhana", {
      kueri,
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrKlasifikasiLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrKlasifikasiLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      return arrKlasifikasiLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

export const regionLabel = async (parameterBc: any, comp: string) => {
  const kueri: string = `
    SELECT DISTINCT
      ${parameterBc.kolom_bc.code} AS [Kode Region],
      ${parameterBc.kolom_bc.name} AS [Deskripsi Region]
    FROM [${comp}${parameterBc.tabel_bc.dim_val_437}]
    WHERE
      ${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.region}'
  `;

  // tarik data region
  try {
    console.log(kueri);
    const respon: string = await invoke("kueri_sederhana", {
      kueri,
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrRegionLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrRegionLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      return arrRegionLabel;
    }
  } catch (e) {
    console.log(e);
  }
};
