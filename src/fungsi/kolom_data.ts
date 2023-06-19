import { MRT_ColumnDef } from "mantine-react-table";
import { DataPenjualan } from "./basic";

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
