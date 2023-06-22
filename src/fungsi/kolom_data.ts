import { MRT_ColumnDef } from "mantine-react-table";
import { DataPenerimaanBarang, DataPenjualan } from "./basic";
import { StatePenjualan } from "./halaman/penjualan";
import { StatePenerimaanBarang } from "./halaman/penerimaanBarang";

export const definisiKolomPenjualan = (props: StatePenjualan) => {
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
        data: props.SBUListTabel as any,
      },
    },
    {
      accessorKey: "loc_code",
      header: "Kode Toko",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.kodeTokoListTabel as any,
      },
    },
    {
      accessorKey: "toko",
      header: "Toko",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.tokoListTabel as any,
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
        data: props.customerListTabel as any,
      },
    },
    {
      accessorKey: "classification",
      header: "Klasifikasi",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.klasifikasiListTabel as any,
      },
    },
    {
      accessorKey: "salesperson",
      header: "Salesperson",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.salespersonListTabel as any,
      },
    },
    {
      accessorKey: "region",
      header: "Region",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.regionListTabel as any,
      },
    },
    {
      accessorKey: "brand_dim",
      header: "Brand",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.brandListTabel as any,
      },
    },
    {
      accessorKey: "oricode",
      header: "OriCode",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.oricodeListTabel as any,
      },
    },
    {
      accessorKey: "ukuran",
      header: "Ukuran",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.ukuranListTabel as any,
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
        data: props.prodDivListTabel as any,
      },
    },
    {
      accessorKey: "prod_grp",
      header: "Grup Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.prodGrpListTabel as any,
      },
    },
    {
      accessorKey: "prod_cat",
      header: "Kategori Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.prodCatListTabel as any,
      },
    },
    {
      accessorKey: "period",
      header: "Period",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.periodListTabel as any,
      },
    },
    {
      accessorKey: "season",
      header: "Season",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.seasonListTabel as any,
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
        data: props.promoListTabel as any,
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

export const definisiKolomPenerimaanBarang = (props: StatePenerimaanBarang) => {
  const kolomDef: MRT_ColumnDef<DataPenerimaanBarang>[] = [
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
      accessorKey: "no_dokumen_pr",
      header: "No. Dokumen PR",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "no_dokumen_wr",
      header: "No. Dokumen WR",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "no_dokumen_po",
      header: "No. Dokumen PO",
      filterFn: "fuzzy",
    },
    {
      accessorKey: "loc_code",
      header: "Kode Lokasi",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.lokasiListTabel as any,
      },
    },
    {
      accessorKey: "brand_dim",
      header: "Brand",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.brandListTabel as any,
      },
    },
    {
      accessorKey: "oricode",
      header: "OriCode",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.oricodeListTabel as any,
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
      accessorKey: "ukuran",
      header: "Ukuran",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.ukuranListTabel as any,
      },
    },
    {
      accessorKey: "prod_div",
      header: "Divisi Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.prodDivListTabel as any,
      },
    },
    {
      accessorKey: "prod_grp",
      header: "Grup Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.prodGrpListTabel as any,
      },
    },
    {
      accessorKey: "prod_cat",
      header: "Kategori Produk",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.prodCatListTabel as any,
      },
    },
    {
      accessorKey: "retail_price_per_unit",
      header: "Retail Price per Unit",
      filterFn: "between",
    },
    {
      accessorKey: "goods_received_quantity",
      header: "Goods Received Qty",
      filterFn: "between",
    },
    {
      accessorKey: "goods_received_cost",
      header: "Goods Received Cost",
      filterFn: "between",
    },
  ];
  return kolomDef;
};
