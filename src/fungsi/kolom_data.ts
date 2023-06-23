import { MRT_ColumnDef } from "mantine-react-table";
import {
  DataKetersediaanStok,
  DataPenerimaanBarang,
  DataPenjualan,
  DataStok,
} from "./basic";
import { StatePenjualan } from "./halaman/penjualan";
import { StatePenerimaanBarang } from "./halaman/penerimaanBarang";
import { StateStok } from "./halaman/stok";
import { StateKetersediaanStok } from "./halaman/ketersediaanStok";

export const definisiKolomPenjualan = (props: StatePenjualan) => {
  const kolomDef: MRT_ColumnDef<DataPenjualan>[] = [
    {
      accessorKey: "no_entry",
      header: "No. Entri ILE",
      filterFn: "fuzzy",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
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
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "percent",
          maximumFractionDigits: 0,
        }),
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
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "percent",
          maximumFractionDigits: 2,
        }),
    },
    {
      accessorKey: "kuantitas",
      header: "Kuantitas",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "cost_price_per_unit",
      header: "Cost per Unit",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 2,
        }),
    },
    {
      accessorKey: "retail_price_per_unit",
      header: "Retail Price per Unit",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "retail_price_per_unit_aft_disc",
      header: "Retail Price per Unit Aft. Disc",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "retail_price_per_unit_aft_vat",
      header: "Retail Price per Unit Aft. VAT",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_sales_at_retail",
      header: "Total Sales at Retail",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_sales_at_retail_aft_disc",
      header: "Total Sales at Retail Aft. Disc",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_sales_at_retail_aft_vat",
      header: "Total Sales at Retail Aft. VAT",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_sales_at_cost",
      header: "Total Sales at Cost",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_margin_aft_vat_rp",
      header: "Total Margin Aft. VAT (Rp)",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_margin_aft_vat_persen",
      header: "Total Margin Aft. VAT (%)",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "percent",
          maximumFractionDigits: 2,
        }),
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
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
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
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "goods_received_quantity",
      header: "Goods Received Qty",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "goods_received_cost",
      header: "Goods Received Cost",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
  ];
  return kolomDef;
};

export const definisiKolomStok = (props: StateStok) => {
  const kolomDef: MRT_ColumnDef<DataStok>[] = [
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
      accessorKey: "season",
      header: "Season",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.seasonListTabel as any,
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
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock Qty",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "stock_cost",
      header: "Stock Cost",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
  ];
  return kolomDef;
};

export const definisiKolomKetersediaanStok = (props: StateKetersediaanStok) => {
  const kolomDef: MRT_ColumnDef<DataKetersediaanStok>[] = [
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
      accessorKey: "ukuran",
      header: "Ukuran",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.ukuranListTabel as any,
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
      accessorKey: "period",
      header: "Period",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.periodListTabel as any,
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
      accessorKey: "item_disc_group",
      header: "Item Disc. Group",
      enableColumnActions: true,
      filterVariant: "multi-select",
      mantineFilterMultiSelectProps: {
        data: props.itemDiscGroupListTabel as any,
      },
    },
    {
      accessorKey: "retail_price_per_unit",
      header: "Retail Price per Unit",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "stock_on_hand",
      header: "Stock on Hand",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "total_cost",
      header: "Total Cost",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "po_outstanding_qty",
      header: "Outstanding PO Qty",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "so_outstanding_qty",
      header: "Outstanding SO Qty",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "proj_stock_intake",
      header: "Projected Stock Intake",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "proj_stock_aft_so",
      header: "Projected Stock Aft. SO",
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }),
    },
  ];
  return kolomDef;
};
