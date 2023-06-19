import { MRT_ColumnDef } from "mantine-react-table";
import { DataPenjualan } from "./basic";

export const definisiKolomPenjualan = (
  SBUList: string[],
  kodeTokoList: string[],
  tokoList: string[],
  customerList: string[],
  klasifikasiList: string[],
  salespersonList: string[],
  regionList: string[],
  brandList: string[],
  oricodeList: string[],
  ukuranList: string[],
  prodDivList: string[],
  prodGrpList: string[],
  prodCatList: string[],
  periodList: string[],
  seasonList: string[],
  promoList: string[]
) => {
  const kolomDef: MRT_ColumnDef<DataPenjualan>[] = [
    {
      accessorKey: "no_entry",
      header: "No. Entri ILE",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "post_date",
      header: "Tanggal",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "system_created_at",
      header: "Waktu",
      filterFn: "fuzzy",
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
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: kodeTokoList as any,
      },
    },
    {
      accessorKey: "toko",
      header: "Toko",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: tokoList as any,
      },
    },
    {
      accessorKey: "no_dokumen",
      header: "No. Dokumen",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "no_dokumen_oth",
      header: "No. Dokumen 2",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "source_no",
      header: "Customer",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: customerList as any,
      },
    },
    {
      accessorKey: "classification",
      header: "Klasifikasi",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: klasifikasiList as any,
      },
    },
    {
      accessorKey: "salesperson",
      header: "Salesperson",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: salespersonList as any,
      },
    },
    {
      accessorKey: "region",
      header: "Region",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: regionList as any,
      },
    },
    {
      accessorKey: "brand_dim",
      header: "Brand",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: brandList as any,
      },
    },
    {
      accessorKey: "oricode",
      header: "OriCode",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: oricodeList as any,
      },
    },
    {
      accessorKey: "ukuran",
      header: "Ukuran",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: ukuranList as any,
      },
    },
    {
      accessorKey: "deskripsi_produk",
      header: "Deskripsi Produk",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "warna",
      header: "Deskripsi Warna",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "prod_div",
      header: "Divisi Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: prodDivList as any,
      },
    },
    {
      accessorKey: "prod_grp",
      header: "Grup Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: prodGrpList as any,
      },
    },
    {
      accessorKey: "prod_cat",
      header: "Kategori Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: prodCatList as any,
      },
    },
    {
      accessorKey: "period",
      header: "Period",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: periodList as any,
      },
    },
    {
      accessorKey: "season",
      header: "Season",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: seasonList as any,
      },
    },
    {
      accessorKey: "ppn",
      header: "PPN",
      filterFn: "between",
    },
    {
      accessorKey: "promo",
      header: "Nama Promo",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: promoList as any,
      },
    },
    {
      accessorKey: "diskon",
      header: "Diskon",
      filterFn: "between",
    },
    {
      accessorKey: "kuantitas",
      header: "Kuantitas",
      filterFn: "between",
    },
    {
      accessorKey: "cost_price_per_unit",
      header: "Cost per Unit",
      filterFn: "between",
    },
    {
      accessorKey: "retail_price_per_unit",
      header: "Retail Price per Unit",
      filterFn: "between",
    },
    {
      accessorKey: "retail_price_per_unit_aft_disc",
      header: "Retail Price per Unit Aft. Disc",
      filterFn: "between",
    },
    {
      accessorKey: "retail_price_per_unit_aft_vat",
      header: "Retail Price per Unit Aft. VAT",
      filterFn: "between",
    },
    {
      accessorKey: "total_sales_at_retail",
      header: "Total Sales at Retail",
      filterFn: "between",
    },
    {
      accessorKey: "total_sales_at_retail_aft_disc",
      header: "Total Sales at Retail Aft. Disc",
      filterFn: "between",
    },
    {
      accessorKey: "total_sales_at_retail_aft_vat",
      header: "Total Sales at Retail Aft. VAT",
      filterFn: "between",
    },
    {
      accessorKey: "total_sales_at_cost",
      header: "Total Sales at Cost",
      filterFn: "between",
    },
    {
      accessorKey: "total_margin_aft_vat_rp",
      header: "Total Margin Aft. VAT (Rp)",
      filterFn: "between",
    },
    {
      accessorKey: "total_margin_aft_vat_persen",
      header: "Total Margin Aft. VAT (%)",
      filterFn: "between",
    },
  ];
  return kolomDef;
};
