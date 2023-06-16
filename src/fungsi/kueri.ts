export interface Kueri {
  judul: string;
  kueri: string;
}

export const kueriBrandLabel = (parameterBc: any, comp: string) => {
  return `
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
};

export const kueriMCLabel = (parameterBc: any, comp: string) => {
  return [
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
};

export const kueriLokasiLabel = (parameterBc: any, comp: string) => {
  return `
  SELECT DISTINCT
    ${parameterBc.kolom_bc.loc_code} AS [Kode Lokasi]
  FROM [${comp}${parameterBc.tabel_bc.jurnal_item_437}]
  WHERE
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
`;
};

export const kueriKlasifikasiLabel = (parameterBc: any, comp: string) => {
  return `
  SELECT DISTINCT
    ${parameterBc.kolom_bc.code} AS [Kode Klasifikasi],
    ${parameterBc.kolom_bc.name} AS [Deskripsi Klasifikasi]
  FROM [${comp}${parameterBc.tabel_bc.dim_val_437}]
  WHERE
    ${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.classification}'
`;
};

export const kueriRegionLabel = (parameterBc: any, comp: string) => {
  return `
  SELECT DISTINCT
    ${parameterBc.kolom_bc.code} AS [Kode Region],
    ${parameterBc.kolom_bc.name} AS [Deskripsi Region]
  FROM [${comp}${parameterBc.tabel_bc.dim_val_437}]
  WHERE
    ${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.region}'
`;
};

export const ILEByPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  const eksklusi: string =
    compKueri === parameterBc.tabel_bc[`${parameterBc.comp.pnt.toLowerCase()}`]
      ? `
  AND 
  ${parameterBc.kolom_bc.source_no} != '${parameterBc.argumen_bc.cust_sample}' AND
  ${parameterBc.kolom_bc.source_no} != '${parameterBc.argumen_bc.cust_marketing}'
  `
      : ``;

  let setKueri: Kueri = {
    judul: "ILEByPostDate",
    kueri: `
    SELECT DISTINCT
    ${parameterBc.kolom_bc.no_entry} [No. Entri],
    ${parameterBc.kolom_bc.post_date} [Tanggal],
    ${parameterBc.kolom_bc.system_created_at} [Waktu],
    ${parameterBc.kolom_bc.store_dim} [Dimensi Toko],
    ${parameterBc.kolom_bc.loc_code} [Kode Toko],
    ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
    ${parameterBc.kolom_bc.source_no} [Customer],
    ${parameterBc.kolom_bc.brand_dim} [Brand],
    ${parameterBc.kolom_bc.oricode} [OriCode],
    ${parameterBc.kolom_bc.size} [Ukuran]
    FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}' ${eksklusi}
    `,
  };
  return setKueri;
};

export const salespersonAndRegionByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "salespersonAndRegionByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_entry} [No. Entri],
        ${parameterBc.kolom_bc.dim_set_id} [ID Set Dimensi]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
      ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
      ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
      ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
      ${parameterBc.kolom_bc.brand_dim} != '' AND
      ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    ), dim_set_entry_slsperson AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.dim_set_id} [ID Set Dimensi],
        ${parameterBc.kolom_bc.dim_val_code} [Nilai Dimensi]
      FROM [${compKueri}${parameterBc.tabel_bc.dim_set_entry_437}]
    WHERE
      ${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.salesperson}'
    ), dim_set_entry_region AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.dim_set_id} [ID Set Dimensi],
        ${parameterBc.kolom_bc.dim_val_code} [Nilai Dimensi]
      FROM [${compKueri}${parameterBc.tabel_bc.dim_set_entry_437}]
      WHERE
        ${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.region}'
    )
    SELECT DISTINCT
      ile.[No. Entri] [No. Entri],
      dim_set_entry_slsperson.[Nilai Dimensi] [Salesperson],
      dim_set_entry_region.[Nilai Dimensi] [Region]
    FROM ile
    LEFT JOIN dim_set_entry_slsperson
      ON (
        ile.[ID Set Dimensi] = dim_set_entry_slsperson.[ID Set Dimensi]
      )
    LEFT JOIN dim_set_entry_region
      ON (
        ile.[ID Set Dimensi] = dim_set_entry_region.[ID Set Dimensi]
      )
      `,
  };
  return setKueri;
};

export const tokoByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "tokoByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
      ${parameterBc.kolom_bc.store_dim} [Dimensi Toko]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
      WHERE
      ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
      ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
      ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
      ${parameterBc.kolom_bc.brand_dim} != '' AND
      ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
      ), toko AS (
        SELECT DISTINCT
          ${parameterBc.kolom_bc.code} [Kode Toko],
          ${parameterBc.kolom_bc.name} [Toko]
        FROM [${compKueri}${parameterBc.tabel_bc.dim_val_437}]
      )
      SELECT DISTINCT
        ile.[Dimensi Toko] [Kode Toko],
        toko.[Toko] [Toko]
      FROM ile
      LEFT JOIN toko
        ON ile.[Dimensi Toko] = toko.[Kode Toko]
    `,
  };
  return setKueri;
};

export const produkByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "produkByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.oricode} [OriCode]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    ), deskripsi AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no} [OriCode],
        ${parameterBc.kolom_bc.desc} [Deskripsi Produk],
        ${parameterBc.kolom_bc.color_desc} [Deskripsi Warna]
      FROM [${compKueri}${parameterBc.tabel_bc.master_item_437}]
    ), mc AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no} [OriCode],
        ${parameterBc.kolom_bc.prod_div} [Divisi Produk],
        ${parameterBc.kolom_bc.prod_group} [Grup Produk],
        ${parameterBc.kolom_bc.prod_cat} [Kategori Produk],
        ${parameterBc.kolom_bc.period} [Period],
        ${parameterBc.kolom_bc.season} [Season]
      FROM [${compKueri}${parameterBc.tabel_bc.master_item_a21}]
    )
    SELECT DISTINCT
      ile.[OriCode],
      deskripsi.[Deskripsi Produk],
      deskripsi.[Deskripsi Warna],
      mc.[Divisi Produk],
      mc.[Grup Produk],
      mc.[Kategori Produk],
      mc.[Period],
      mc.[Season]
    FROM ile
    LEFT JOIN deskripsi
      ON ile.[OriCode] = deskripsi.[OriCode]
    LEFT JOIN mc
      ON ile.[OriCode] = mc.[OriCode]
      `,
  };
  return setKueri;
};

export const vatByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "vatByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.oricode} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    ), vat_entry AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.vat_bus_post_group} [BPG PPN],
        ${parameterBc.kolom_bc.vat_prod_post_group} [PPG PPN]
      FROM [${compKueri}${parameterBc.tabel_bc.vat_entry_437}]
      WHERE
        ${parameterBc.kolom_bc.gen_prod_post_group} = '${parameterBc.argumen_bc.direct}' OR
        ${parameterBc.kolom_bc.gen_prod_post_group} = '${parameterBc.argumen_bc.consign}'
    ), vat_posting AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.vat_bus_post_group} [BPG PPN],
        ${parameterBc.kolom_bc.vat_prod_post_group} [PPG PPN],
        ${parameterBc.kolom_bc.vat} [PPN]
      FROM [${compKueri}${parameterBc.tabel_bc.vat_post_setup_437}]
    ), shipment_doc_vat AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.no} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran],
        ${parameterBc.kolom_bc.vat} [PPN]
      FROM [${compKueri}${parameterBc.tabel_bc.sales_shipment_437}]
    ), retur_doc_vat AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.no} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran],
        ${parameterBc.kolom_bc.vat} [PPN]
      FROM [${compKueri}${parameterBc.tabel_bc.ret_receipt_437}]
    )
    SELECT DISTINCT
      ile.[No. Dokumen],
      COALESCE(vat_posting.[PPN], shipment_doc_vat.[PPN], retur_doc_vat.[PPN]) / 100 [PPN]
    FROM ile
    LEFT JOIN vat_entry
      ON ile.[No. Dokumen] = vat_entry.[No. Dokumen]
    LEFT JOIN vat_posting
      ON (
        vat_entry.[BPG PPN] = vat_posting.[BPG PPN] AND
        vat_entry.[PPG PPN] = vat_posting.[PPG PPN]
      )
    LEFT JOIN shipment_doc_vat
      ON (
        ile.[No. Dokumen] = shipment_doc_vat.[No. Dokumen] AND
        ile.[OriCode] = shipment_doc_vat.[OriCode] AND
        ile.[Ukuran] = shipment_doc_vat.[Ukuran]
      )
    LEFT JOIN retur_doc_vat
      ON (
        ile.[No. Dokumen] = retur_doc_vat.[No. Dokumen] AND
        ile.[OriCode] = retur_doc_vat.[OriCode] AND
        ile.[Ukuran] = retur_doc_vat.[Ukuran]
      )
    `,
  };
  return setKueri;
};

export const promoByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "promoByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_entry} [No. Entri]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    ), ile5ec AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_entry} [No. Entri],
        ${parameterBc.kolom_bc.lsc_offer_no} [Kode Promo]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_5ec}]
    ), promo AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no} [Kode Promo],
        ${parameterBc.kolom_bc.desc} [Nama Promo]
      FROM [${compKueri}${parameterBc.tabel_bc.disc_map_5ec}]
    )
    SELECT DISTINCT
      ile.[No. Entri],
      promo.[Nama Promo]
    FROM ile
    LEFT JOIN ile5ec
      ON ile.[No. Entri] = ile5ec.[No. Entri]
    LEFT JOIN promo
      ON ile5ec.[Kode Promo] = promo.[Kode Promo]
    `,
  };
  return setKueri;
};

export const diskonByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "diskonByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_entry} [No. Entri],
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.doc_line_no} [Baris Dokumen]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    ), va_entry AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.ile_entry_no} [No. Entri],
        ABS(SUM(${parameterBc.kolom_bc.disc_amount})) /
        ${parameterBc.argumen_bc.null}IF(
          ABS(SUM(${parameterBc.kolom_bc.disc_amount})) +
          ABS(SUM(${parameterBc.kolom_bc.sales_amount_actual})),
          0
        ) [Diskon]
      FROM [${compKueri}${parameterBc.tabel_bc.va_entry_437}]
      WHERE
        ${parameterBc.kolom_bc.no_doc} NOT LIKE '${parameterBc.argumen_bc.sales_ship_series_prefix}' AND
        ${parameterBc.kolom_bc.no_doc} NOT LIKE '${parameterBc.argumen_bc.sales_ret_series_prefix}'
      GROUP BY
        ${parameterBc.kolom_bc.ile_entry_no}
    ), shipment_doc AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.line_no} [Nomor Baris],
        ${parameterBc.kolom_bc.line_disc} / 100 [Diskon]
      FROM [${compKueri}${parameterBc.tabel_bc.sales_shipment_437}]
    ), retur_doc AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.line_no} [Nomor Baris],
        ${parameterBc.kolom_bc.line_disc} / 100 [Diskon]
      FROM [${compKueri}${parameterBc.tabel_bc.ret_receipt_437}]
    )
    SELECT DISTINCT
      ile.[No. Entri] [No. Entri],
      COALESCE(va_entry.[Diskon], shipment_doc.[Diskon], retur_doc.[Diskon]) [Diskon]
    FROM ile
    LEFT JOIN va_entry
      ON (
        ile.[No. Entri] = va_entry.[No. Entri]
      )
    LEFT JOIN shipment_doc
      ON (
        ile.[No. Dokumen] LIKE '${parameterBc.argumen_bc.sales_ship_series_prefix}' AND
        ile.[No. Dokumen] = shipment_doc.[No. Dokumen] AND
        ile.[Baris Dokumen] = shipment_doc.[Nomor Baris]
      )
    LEFT JOIN retur_doc
      ON (
        ile.[No. Dokumen] LIKE '${parameterBc.argumen_bc.sales_ret_series_prefix}' AND
        ile.[No. Dokumen] = retur_doc.[No. Dokumen] AND
        ile.[Baris Dokumen] = retur_doc.[Nomor Baris]
      )
    GROUP BY
        ile.[No. Entri],
        va_entry.[Diskon],
        shipment_doc.[Diskon],
        retur_doc.[Diskon]
    `,
  };
  return setKueri;
};

export const dokumenLainnyaByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "dokumenLainnyaByILEPostDate",
    kueri: `
    SELECT DISTINCT
        ile.${parameterBc.kolom_bc.no_entry} [No. Entri],
        va_entry.${parameterBc.kolom_bc.no_doc} [No. Dokumen 2]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}] AS ile
      LEFT JOIN [${compKueri}${parameterBc.tabel_bc.va_entry_437}] AS va_entry
        ON va_entry.${parameterBc.kolom_bc.no_entry} = (
          SELECT TOP 1
            ${parameterBc.kolom_bc.no_entry}
          FROM [${compKueri}${parameterBc.tabel_bc.va_entry_437}]
          WHERE
            ${parameterBc.kolom_bc.ile_entry_no} = ile.${parameterBc.kolom_bc.no_entry}
          ORDER BY
            ${parameterBc.kolom_bc.no_doc}
        )
      WHERE
        ile.${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
        ile.${parameterBc.kolom_bc.post_date} <= '${tglAkhir}'
      ORDER BY va_entry.${parameterBc.kolom_bc.no_doc}
    `,
  };
  console.log(setKueri.kueri);
  return setKueri;
};

export const quantityByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "quantityByILEPostDate",
    kueri: `
    SELECT DISTINCT
        ${parameterBc.kolom_bc.no_entry} [No. Entri],
        SUM(${parameterBc.kolom_bc.quantity}) [Kuantitas]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
      WHERE
        ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
        ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
        ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
        ${parameterBc.kolom_bc.brand_dim} != '' AND
        ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
      GROUP BY
        ${parameterBc.kolom_bc.no_entry}
    `,
  };
  return setKueri;
};

export const cppuByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "cppuByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_entry} [No. Entri]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    GROUP BY
    ${parameterBc.kolom_bc.no_entry}
    ), va_entry AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.ile_entry_no} [No. Entri],
        SUM(${parameterBc.kolom_bc.cost_amount_actual} + ${parameterBc.kolom_bc.cost_amount_exp}) /
        SUM(${parameterBc.kolom_bc.ile_quantity}) [Cost per Unit],
        SUM(${parameterBc.kolom_bc.sales_amount_actual}) [Total Sales at Retail Aft. VAT]
      FROM [${compKueri}${parameterBc.tabel_bc.va_entry_437}]
      GROUP BY
        ${parameterBc.kolom_bc.ile_entry_no}
    )
    SELECT DISTINCT
      ile.[No. Entri] [No. Entri],
      SUM(va_entry.[Cost per Unit]) [Cost per Unit],
      SUM(va_entry.[Total Sales at Retail Aft. VAT]) [Total Sales at Retail Aft. VAT]
    FROM ile
    LEFT JOIN va_entry
      ON ile.[No. Entri] = va_entry.[No. Entri]
    GROUP BY
      ile.[No. Entri]
    `,
  };
  return setKueri;
};

export const rppuByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "rppuByILEPostDate",
    kueri: `
    WITH ile AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.post_date} [Tanggal],
        ${parameterBc.kolom_bc.loc_code} [Kode Toko],
        ${parameterBc.kolom_bc.no_entry} [No. Entri],
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.oricode} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran]
    FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
    ${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
    ${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
    ${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
    ${parameterBc.kolom_bc.brand_dim} != '' AND
    ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
    ), lsctse_stat AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.date} [Tanggal],
        ${parameterBc.kolom_bc.store_no} [Kode Toko],
        ${parameterBc.kolom_bc.trans_no} [No. Transaksi],
        ${parameterBc.kolom_bc.oricode} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran]
      FROM [${compKueri}${parameterBc.tabel_bc.store_sales_stat_5ec}]
    ), lsctse AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.store_no} [Kode Toko],
        ${parameterBc.kolom_bc.trans_no} [No. Transaksi],
        ${parameterBc.kolom_bc.oricode} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran],
        ${parameterBc.kolom_bc.price} [Retail Price per Unit]
      FROM [${compKueri}${parameterBc.tabel_bc.store_sales_entry_5ec}]
    ), shipment AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.no} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran],
        ${parameterBc.kolom_bc.unit_price} [Retail Price per Unit]
      FROM [${compKueri}${parameterBc.tabel_bc.sales_shipment_437}]
    ), retur AS (
      SELECT DISTINCT
        ${parameterBc.kolom_bc.no_doc} [No. Dokumen],
        ${parameterBc.kolom_bc.no} [OriCode],
        ${parameterBc.kolom_bc.size} [Ukuran],
        ${parameterBc.kolom_bc.unit_price} [Retail Price per Unit]
      FROM [${compKueri}${parameterBc.tabel_bc.ret_receipt_437}]
    )
    SELECT DISTINCT
      ile.[No. Entri],
      COALESCE(lsctse.[Retail Price per Unit], shipment.[Retail Price per Unit], retur.[Retail Price per Unit]) [Retail Price per Unit]
    FROM ile
    LEFT JOIN lsctse_stat
      ON  (
        ile.[No. Dokumen] NOT LIKE '${parameterBc.argumen_bc.sales_ret_series_prefix}' AND
        ile.[Tanggal] = lsctse_stat.[Tanggal] AND
        ile.[Kode Toko] = lsctse_stat.[Kode Toko] AND
        ile.[OriCode] = lsctse_stat.[OriCode] AND
        ile.[Ukuran] = lsctse_stat.[Ukuran]
      )
    LEFT JOIN lsctse
      ON (
        lsctse_stat.[Kode Toko] = lsctse.[Kode Toko] AND
        lsctse_stat.[No. Transaksi] = lsctse.[No. Transaksi] AND
        lsctse_stat.[OriCode] = lsctse.[OriCode] AND
        lsctse_stat.[Ukuran] = lsctse.[Ukuran]
      )
    LEFT JOIN shipment
      ON (
        ile.[No. Dokumen] NOT LIKE '${parameterBc.argumen_bc.sales_ret_series_prefix}' AND
        ile.[No. Dokumen] = shipment.[No. Dokumen] AND
        ile.[OriCode] = shipment.[OriCode] AND
        ile.[Ukuran] = shipment.[Ukuran]
      )
    LEFT JOIN retur
      ON (
        ile.[No. Dokumen] LIKE '${parameterBc.argumen_bc.sales_ret_series_prefix}' AND
        ile.[No. Dokumen] = retur.[No. Dokumen] AND
        ile.[OriCode] = retur.[OriCode] AND
        ile.[Ukuran] = retur.[Ukuran]
      )
    `,
  };
  return setKueri;
};

export const klasifikasiByILEPostDate = (
  parameterBc: { [key: string]: any },
  tglAwal: string,
  tglAkhir: string,
  compKueri: string
) => {
  let setKueri: Kueri = {
    judul: "klasifikasiByILEPostDate",
    kueri: `
    SELECT DISTINCT
        ile.${parameterBc.kolom_bc.no_entry} [No. Entri],
        dim_set.${parameterBc.kolom_bc.dim_val_code} [Klasifikasi]
      FROM [${compKueri}${parameterBc.tabel_bc.jurnal_item_437}] ile
      LEFT JOIN [${compKueri}${parameterBc.tabel_bc.dim_set_entry_437}] dim_set
        ON (
          ile.${parameterBc.kolom_bc.dim_set_id} = dim_set.${parameterBc.kolom_bc.dim_set_id} AND
          dim_set.${parameterBc.kolom_bc.dim_code} = '${parameterBc.argumen_bc.classification}'
        )
      WHERE
        ile.${parameterBc.kolom_bc.post_date} >= '${tglAwal}' AND
        ile.${parameterBc.kolom_bc.post_date} <= '${tglAkhir}' AND
        ile.${parameterBc.kolom_bc.store_dim} LIKE '${parameterBc.argumen_bc.sales_prefix}' AND
        ile.${parameterBc.kolom_bc.brand_dim} != '' AND
        ile.${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
      GROUP BY
        ile.${parameterBc.kolom_bc.no_entry},
        dim_set.${parameterBc.kolom_bc.dim_val_code}
    `,
  };
  return setKueri;
};
