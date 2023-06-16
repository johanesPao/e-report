import { MRT_ColumnDef } from "mantine-react-table";
import { DataPenjualan } from "./basic";
import { setDataPenjualan } from "../fitur_state/dataBank";

export const definisiKolomPenjualan = (SBUList: string[]) => {
  const kolomDef: MRT_ColumnDef<DataPenjualan>[] = [
    {
      accessorKey: "no_entry",
      header: "No. Entri ILE",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "post_date",
      header: "Tanggal",
    },
    {
      accessorKey: "system_created_at",
      header: "Waktu",
    },
    {
      accessorKey: "sbu",
      header: "SBU",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: SBUList as any,
      },
    },
    {
      accessorKey: "loc_code",
      header: "Kode Toko",
      enableColumnActions: true,
    },
    {
      accessorKey: "toko",
      header: "Toko",
      enableColumnActions: true,
    },
    {
      accessorKey: "no_dokumen",
      header: "No. Dokumen",
    },
    {
      accessorKey: "no_dokumen_oth",
      header: "No. Dokumen 2",
    },
    {
      accessorKey: "source_no",
      header: "Customer",
      enableColumnActions: true,
    },
    {
      accessorKey: "classification",
      header: "Klasifikasi",
      enableColumnActions: true,
    },
    {
      accessorKey: "salesperson",
      header: "Salesperson",
      enableColumnActions: true,
    },
    {
      accessorKey: "region",
      header: "Region",
      enableColumnActions: true,
    },
    {
      accessorKey: "brand_dim",
      header: "Brand",
      enableColumnActions: true,
    },
    {
      accessorKey: "oricode",
      header: "OriCode",
      enableColumnActions: true,
    },
    {
      accessorKey: "ukuran",
      header: "Ukuran",
      enableColumnActions: true,
    },
    {
      accessorKey: "deskripsi_produk",
      header: "Deskripsi Produk",
    },
    {
      accessorKey: "warna",
      header: "Deskripsi Warna",
    },
    {
      accessorKey: "prod_div",
      header: "Divisi Produk",
      enableColumnActions: true,
    },
    {
      accessorKey: "prod_grp",
      header: "Grup Produk",
      enableColumnActions: true,
    },
    {
      accessorKey: "prod_cat",
      header: "Kategori Produk",
      enableColumnActions: true,
    },
    {
      accessorKey: "period",
      header: "Period",
      enableColumnActions: true,
    },
    {
      accessorKey: "season",
      header: "Season",
      enableColumnActions: true,
    },
    {
      accessorKey: "ppn",
      header: "PPN",
    },
    {
      accessorKey: "promo",
      header: "Nama Promo",
      enableColumnActions: true,
    },
    {
      accessorKey: "diskon",
      header: "Diskon",
    },
    {
      accessorKey: "kuantitas",
      header: "Kuantitas",
      filterFn: "between",
    },
    {
      accessorKey: "cost_price_per_unit",
      header: "Cost per Unit",
    },
    {
      accessorKey: "retail_price_per_unit",
      header: "Retail Price per Unit",
    },
    {
      accessorKey: "retail_price_per_unit_aft_disc",
      header: "Retail Price per Unit Aft. Disc",
    },
    {
      accessorKey: "retail_price_per_unit_aft_vat",
      header: "Retail Price per Unit Aft. VAT",
    },
    {
      accessorKey: "total_sales_at_retail",
      header: "Total Sales at Retail",
    },
    {
      accessorKey: "total_sales_at_retail_aft_disc",
      header: "Total Sales at Retail Aft. Disc",
    },
    {
      accessorKey: "total_sales_at_retail_aft_vat",
      header: "Total Sales at Retail Aft. VAT",
    },
    {
      accessorKey: "total_sales_at_cost",
      header: "Total Sales at Cost",
    },
    {
      accessorKey: "total_margin_aft_vat_rp",
      header: "Total Margin Aft. VAT (Rp)",
    },
    {
      accessorKey: "total_margin_aft_vat_persen",
      header: "Total Margin Aft. VAT (%)",
    },
  ];
  return kolomDef;
};

export const bacaDataPenjualan = (dispatch: any, data: any[]) => {
  let arrDataPenjualan: DataPenjualan[] = [];
  let panjangArray = data[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    let postDate = new Date(data[1]["values"][hitung]);
    let systemCreatedAt = new Date(data[2]["values"][hitung]);
    console.log(data[22]["values"][hitung]);
    arrDataPenjualan.push({
      no_entry: data[0]["values"][hitung],
      post_date: postDate.toISOString().split("T")[0],
      system_created_at: systemCreatedAt.toISOString().split("T")[1],
      sbu: data[3]["values"][hitung],
      loc_code: data[4]["values"][hitung],
      toko: data[5]["values"][hitung],
      no_dokumen: data[6]["values"][hitung],
      no_dokumen_oth: data[7]["values"][hitung],
      source_no: data[8]["values"][hitung],
      classification: data[9]["values"][hitung],
      salesperson: data[10]["values"][hitung],
      region: data[11]["values"][hitung],
      brand_dim: data[12]["values"][hitung],
      oricode: data[13]["values"][hitung],
      ukuran: data[14]["values"][hitung],
      deskripsi_produk: data[15]["values"][hitung],
      warna: data[16]["values"][hitung],
      prod_div: data[17]["values"][hitung],
      prod_grp: data[18]["values"][hitung],
      prod_cat: data[19]["values"][hitung],
      period: data[20]["values"][hitung],
      season: data[21]["values"][hitung],
      ppn:
        data[22]["values"][hitung] !== null
          ? data[22]["values"][hitung].toLocaleString("id-ID", {
              style: "percent",
              minimumFractionDigits: 2,
            })
          : "0.00%",
      promo: data[23]["values"][hitung],
      diskon: data[24]["values"][hitung],
      kuantitas: data[25]["values"][hitung],
      cost_price_per_unit: data[26]["values"][hitung],
      retail_price_per_unit: data[27]["values"][hitung],
      retail_price_per_unit_aft_disc: data[28]["values"][hitung],
      retail_price_per_unit_aft_vat: data[29]["values"][hitung],
      total_sales_at_retail: data[30]["values"][hitung],
      total_sales_at_retail_aft_disc: data[31]["values"][hitung],
      total_sales_at_retail_aft_vat: data[32]["values"][hitung],
      total_sales_at_cost: data[33]["values"][hitung],
      total_margin_aft_vat_rp: data[34]["values"][hitung],
      total_margin_aft_vat_persen: data[35]["values"][hitung],
    });
  }
  dispatch(setDataPenjualan(arrDataPenjualan));
};
