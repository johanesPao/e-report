import { invoke } from "@tauri-apps/api/tauri";
import { toTitle } from "./basic";
import { BrandLabel } from "../fitur_state/dataParam";

export const brandLabel = async (parameterBc: any, comp: string) => {
  const kueri: string = `
    SELECT DISTINCT
      a.${parameterBc.kolom_bc.brand_dim} AS [Brand],
      b.${parameterBc.kolom_bc.name} AS [Label]
    FROM [${comp}${parameterBc.tabel_bc.jurnal_item_437}] AS a
    LEFT JOIN [${comp}${parameterBc.tabel_bc.dim_val_437}] AS b
      ON
      a.${parameterBc.kolom_bc.brand_dim} = b.${parameterBc.kolom_bc.kode} AND
      b.${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.brand}'
    WHERE
      a.${parameterBc.kolom_bc.brand_dim} != '' AND
      a.${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
  `;

  // tarik data brand
  try {
    const respon: string = await invoke("brand_ile", {
      kueri,
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrBrandLabel: BrandLabel[] = [];
      hasil["konten"].map((data: string) =>
        arrBrandLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      console.log(arrBrandLabel);
      return arrBrandLabel;
    }
  } catch (e) {
    console.log(e);
  }
};
