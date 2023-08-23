import {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import {
  DataKetersediaanStok,
  DataLabaRugiToko,
  DataPenerimaanBarang,
  DataPenjualan,
  DataStok,
  DataTabelKelayakanTokoBaru,
  EModePopUpKelayakanTokoBaru,
  EStatusProposalTokoBaru,
  unduhTabelKeExcel,
} from "./basic";
import { StatePenjualan } from "./halaman/penjualan";
import { StatePenerimaanBarang } from "./halaman/penerimaanBarang";
import { StateStok } from "./halaman/stok";
import { StateKetersediaanStok } from "./halaman/ketersediaanStok";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDownload,
  IconHomeCheck,
  IconHomeQuestion,
  IconHomeX,
  IconPlus,
} from "@tabler/icons-react";
import { StatePopUp } from "../komponen/PopUp";

export interface TableProps {
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnDragging?: boolean;
  enablePinning?: boolean;
  enableGrouping?: boolean;
  enableColumnActions?: boolean;
  enableFilterMatchHighlighting?: boolean;
  enableDensityToggle?: boolean;
  enableStickyHeader?: boolean;
  enableStickyFooter?: boolean;
  enablePagination?: boolean;
  enableRowActions?: boolean;
  memoMode?: "cells" | "rows" | "table-body" | undefined;
  mantineTableContainerProps?: { [key: string]: any };
  initialState?: { [key: string]: any };
  renderTopToolbarCustomActions?: () => React.ReactNode | void;
  renderToolbarInternalActions?: (table: any) => React.ReactNode | void;
  renderRowActions?: ({
    cell,
    row,
    table,
  }: {
    cell: any;
    row: any;
    table: any;
  }) => React.ReactNode | void;
  state?: { [key: string]: any };
}

export const buatPropsTabel = (
  halaman: string,
  data: any[],
  memuat: boolean,
  setPopUp?: React.Dispatch<React.SetStateAction<StatePopUp>>
) => {
  let props: TableProps;
  // Default props
  props = {
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnDragging: false,
    enablePinning: true,
    enableGrouping: true,
    enableColumnActions: false,
    enableFilterMatchHighlighting: false,
    enableDensityToggle: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enablePagination: true,
    memoMode: "cells",
    mantineTableContainerProps: {
      sx: { maxHeight: "65vh" },
    },
    initialState: {
      pagination: {
        pageSize: 15,
        pageIndex: 0,
      },
      showColumnFilters: false,
      density: "xs",
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          color="green"
          onClick={() => unduhTabelKeExcel(data, halaman)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Unduh ke Excel
        </Button>
      </Box>
    ),
    // @ts-ignore
    renderToolbarInternalActions: ({ table }: MantineReactTableProps) => {
      return (
        <>
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
        </>
      );
    },
    state: {
      isLoading: memuat,
    },
  };
  switch (halaman) {
    case "penjualan":
      {
        props = {
          ...props,
        };
      }
      break;
    case "penerimaanBarang": {
      props = {
        ...props,
      };
      break;
    }
    case "stok": {
      props = {
        ...props,
      };
      break;
    }
    case "ketersediaanStok": {
      props = {
        ...props,
      };
      break;
    }
    case "labaRugiToko": {
      props = {
        ...props,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enablePagination: false,
        // @ts-ignore
        renderToolbarInternalActions: ({ table }: MantineReactTableProps) => {
          return (
            <>
              <MRT_ShowHideColumnsButton table={table} />
            </>
          );
        },
      };
      break;
    }
    case "kelayakanTokoBaru": {
      props = {
        ...props,
        enableRowActions: true,
        enablePagination: true,
        mantineTableContainerProps: {
          sx: { maxHeight: "80vh" },
        },
        renderTopToolbarCustomActions: () => {
          const popUpPenambahanProposal = () => {
            if (setPopUp !== undefined) {
              setPopUp((stateSebelumnya) => ({
                ...stateSebelumnya,
                togglePopUp: true,
                judulPopUp: "Proposal Toko Baru",
                modeProposal: EModePopUpKelayakanTokoBaru.PENAMBAHAN,
              }));
            }
          };
          return (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "15px" }}>
              <Title order={2}>Studi Kelayakan Toko Baru</Title>
              <Tooltip
                label="Buat Proposal Toko Baru"
                withArrow
                transitionProps={{ transition: "rotate-left", duration: 300 }}
                position="right"
                pos="fixed"
                color="blue"
              >
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => popUpPenambahanProposal()}
                  size="2em"
                >
                  <IconPlus size="1em" />
                </ActionIcon>
              </Tooltip>
            </Box>
          );
        },
        //@ts-ignore
        renderRowActions: ({ row }: MantineReactTableProps) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
              {/* Approval hanya ada jika status proposal 1 (SUBMIT) */}
              {row.original.status == EStatusProposalTokoBaru.SUBMIT ? (
                <Tooltip
                  label={`Approval atau Rejection untuk Proposal ${row.original.proposal_id}`}
                  withArrow
                  transitionProps={{ transition: "rotate-left", duration: 300 }}
                  position="left"
                  pos="fixed"
                  color="teal"
                >
                  <ActionIcon
                    variant="light"
                    color={"green"}
                    onClick={() => {
                      if (setPopUp !== undefined) {
                        setPopUp((stateSebelumnya) => ({
                          ...stateSebelumnya,
                          togglePopUp: true,
                          judulPopUp: `Persetujuan ${row.original.proposal_id}`,
                          modeProposal: EModePopUpKelayakanTokoBaru.PERSETUJUAN,
                          proposalID: row.original.proposal_id,
                        }));
                      }
                    }}
                  >
                    <IconHomeCheck />
                  </ActionIcon>
                </Tooltip>
              ) : null}
              {/* SUNTING atau HAPUS hanya ada jika status proposal 0 (DRAFT) */}
              {row.original.status == EStatusProposalTokoBaru.DRAFT ? (
                <>
                  <Tooltip
                    label={`Sunting Perubahan untuk Proposal ${row.original.proposal_id}`}
                    withArrow
                    transitionProps={{
                      transition: "rotate-left",
                      duration: 300,
                    }}
                    position="left"
                    pos="fixed"
                    color="orange"
                  >
                    <ActionIcon
                      variant="light"
                      color={"orange"}
                      onClick={() => {
                        if (setPopUp !== undefined) {
                          setPopUp((stateSebelumnya) => ({
                            ...stateSebelumnya,
                            togglePopUp: true,
                            judulPopUp: `Sunting ${row.original.proposal_id}`,
                            modeProposal: EModePopUpKelayakanTokoBaru.SUNTING,
                            proposalID: row.original.proposal_id,
                          }));
                        }
                      }}
                    >
                      <IconHomeQuestion />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip
                    label={`Hapus Proposal ${row.original.proposal_id}?`}
                    withArrow
                    transitionProps={{
                      transition: "rotate-left",
                      duration: 300,
                    }}
                    position="left"
                    pos="fixed"
                    color="red"
                  >
                    <ActionIcon
                      variant="light"
                      color={"red"}
                      onClick={() => {
                        if (setPopUp !== undefined) {
                          setPopUp((stateSebelumnya) => ({
                            ...stateSebelumnya,
                            togglePopUp: true,
                            judulPopUp: `Hapus ${row.original.proposal_id}`,
                            modeProposal: EModePopUpKelayakanTokoBaru.HAPUS,
                            proposalID: row.original.proposal_id,
                          }));
                        }
                      }}
                    >
                      <IconHomeX />
                    </ActionIcon>
                  </Tooltip>
                </>
              ) : null}
            </Box>
          );
        },
        initialState: {
          columnPinning: {
            left: ["proposal_id", "sbu", "kota_kabupaten"],
            right: ["mrt-row-actions"],
          },
          pagination: {
            pageSize: 15,
            pageIndex: 0,
          },
          sorting: [
            {
              id: "proposal_id",
              desc: true,
            },
          ],
          density: "xs",
        },
      };
      break;
    }
    default: {
      props = {};
      break;
    }
  }
  return props;
};

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
    {
      accessorKey: "total_bruto_aft_vat",
      header: "Total Bruto Aft. VAT (Rp)",
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

export const definisiKolomLabaRugiToko = (data: DataLabaRugiToko[]) => {
  let kolomDef: MRT_ColumnDef<any>[] = [];
  kolomDef = [
    {
      accessorKey: "coa",
      header: "Chart of Account",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "acc_name",
      header: "Acc. Name",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
  ];

  // buat kolom toko secara dinamis...
  let list_toko: string[] = [];
  for (let item of Object.keys(data[0])) {
    if (typeof data[0][item] === "number") {
      list_toko.push(item);
    }
  }
  const tokoUnik = [...new Set<string>(list_toko)];
  console.log(tokoUnik);
  for (var toko of tokoUnik) {
    let total = 0;
    for (let hitung = 0; hitung <= data.length - 1; hitung++) {
      total +=
        data[hitung][`${toko}`] !== undefined
          ? (data[hitung][`${toko}`] as number)
          : 0;
    }
    const kolomToko: MRT_ColumnDef<any> = {
      accessorKey: toko,
      header: toko,
      enableColumnActions: true,
      filterFn: "between",
      aggregationFn: "sum",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
      Footer: (
        <Stack>
          Profit/Loss:
          <Box
            sx={(theme) => ({
              color: total > 0 ? theme.colors.green[5] : theme.colors.red[5],
              fontWeight: "bolder",
            })}
          >
            {total?.toLocaleString?.("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </Box>
        </Stack>
      ),
    };
    kolomDef.push(kolomToko);
  }

  const kolomFinalDef: MRT_ColumnDef<any>[] = kolomDef;

  return kolomFinalDef;
};

export const definisiKolomKelayakanTokoBaru = () => {
  let kolomDef: MRT_ColumnDef<DataTabelKelayakanTokoBaru>[] = [];
  kolomDef = [
    {
      accessorKey: "proposal_id",
      header: "ID Proposal",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "versi",
      header: "Versi",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "status",
      accessorFn: (baris: any) => {
        // Template Badge
        const statusBadge = (
          statusTeks: string,
          warnaKiri: string,
          warnaKanan: string
        ) => {
          return (
            <Badge
              variant="gradient"
              gradient={{ from: warnaKiri, to: warnaKanan }}
            >
              {statusTeks}
            </Badge>
          );
        };
        let statusTeks: string;
        let warnaKiri: string;
        let warnaKanan: string;
        switch (baris.status) {
          case EStatusProposalTokoBaru.DRAFT:
            statusTeks = "DRAFT";
            warnaKiri = "orange";
            warnaKanan = "red";
            break;
          case EStatusProposalTokoBaru.SUBMIT:
            statusTeks = "SUBMITTED";
            warnaKiri = "indigo";
            warnaKanan = "cyan";
            break;
          case EStatusProposalTokoBaru.DITOLAK:
            statusTeks = "REJECTED";
            warnaKiri = "red";
            warnaKanan = "black";
            break;
          case EStatusProposalTokoBaru.DITERIMA:
            statusTeks = "APPROVED";
            warnaKiri = "lime";
            warnaKanan = "green";
            break;
          default:
            return;
        }
        return statusBadge(statusTeks, warnaKiri, warnaKanan);
      },
      header: "Status Proposal",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "sbu",
      header: "SBU",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "kota_kabupaten",
      header: "Kota / Kabupaten",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "kelas_mall",
      header: "Kelas Mall",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      // accessorKey: "luas_toko",
      accessorFn: (baris: any) => {
        const luas_toko = baris.luas_toko + " m²";
        return luas_toko;
      },
      header: "Luas Toko",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorKey: "user_generated_store_income",
      header: "Store Income (User Generated)",
      enableColumnActions: true,
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "model_generated_store_income",
      header: "Store Income (Model Generated)",
      enableColumnActions: true,
      filterFn: "between",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }),
    },
    {
      accessorKey: "submit_by",
      header: "Disubmit Oleh",
      enableColumnActions: true,
      filterFn: "fuzzy",
    },
    {
      accessorFn: (baris) => {
        const dibuat = baris.dibuat;
        dibuat.setHours(0, 0, 0, 0);
        return dibuat;
      },
      header: "Waktu Proposal Dibuat",
      enableColumnActions: true,
      enableColumnFilterModes: false,
      filterVariant: "date-range",
      sortingFn: "datetime",
      Cell: ({ cell }) => cell.getValue<Date>()?.toDateString(),
    },
    {
      accessorFn: (baris) => {
        const diedit = baris.diedit;
        diedit.setHours(0, 0, 0, 0);
        return diedit;
      },
      header: "Waktu Proposal Diedit",
      enableColumnActions: true,
      enableColumnFilterModes: false,
      filterVariant: "date-range",
      sortingFn: "datetime",
      Cell: ({ cell }) => cell.getValue<Date>()?.toDateString(),
    },
  ];

  return kolomDef;
};
