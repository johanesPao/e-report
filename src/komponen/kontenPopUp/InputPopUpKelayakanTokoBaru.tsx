import {
  ActionIcon,
  Button,
  Center,
  Chip,
  Flex,
  Grid,
  Group,
  NumberInput,
  NumberInputHandlers,
  Rating,
  ScrollArea,
  SegmentedControl,
  Select,
  Slider,
  Text,
  TextInput,
  Title,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  StateKelayakanTokoBaru,
  ambilInputItemKelayakanTokoBaru,
} from "../../fungsi/halaman/kelayakanTokoBaru";
import { Formulir, IInputItemKelayakanTokoBaru } from "../../fungsi/basic";
import {
  IconBriefcase,
  IconBuilding,
  IconBuildingBank,
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconBulldozer,
  IconCalculator,
  IconCalendar,
  IconCalendarTime,
  IconFriends,
  IconHomeBolt,
  IconMapPin,
  IconMapSearch,
  IconMoodTongueWink2,
  IconNumber,
  IconPigMoney,
  IconSortDescendingNumbers,
  IconUsers,
  IconWallet,
  IconZoomInArea,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export const InputPopUpKelayakanTokoBaru = ({
  props,
  setProps,
}: {
  props: StateKelayakanTokoBaru;
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>;
}) => {
  const theme = useMantineTheme();
  // Ambil beberapa parameter input item dari mongodb pada first render
  // const [inputItem, setInputItem] = useState<
  //   IInputItemKelayakanTokoBaru | undefined
  // >(undefined);
  // useEffect(() => {
  //   const ambil_input_item = async () => {
  //     await ambilInputItemKelayakanTokoBaru(setInputItem);
  //   };
  //   ambil_input_item();
  // }, []);
  // Initial Value Formulir sebagai blanket kosong
  // Nilai Initial Value Formulir pada dasarnya akan bergantung kepada EModePopUpKelayakanTokoBaru
  // co: EModePopUpKelayakanTokoBaru.PENAMBAHAN, EModePopUpKelayakanTokoBaru.PERSETUJUAN,
  // EModePopUpKelayakanTokoBaru.SUNTING atau EModePopUpKelayakanTokoBaru.HAPUS
  const initialValueFormulir: Formulir = {
    log: [],
    proposal_id: "",
    versi_proposal: 1,
    input: {
      versi_model: "",
      nama_model: "",
      sbu: "",
      kota_kabupaten: "",
      rentang_populasi: "",
      kelas_mall: "",
      luas_toko: 0,
      prediksi_penjualan_user: 0,
      margin_penjualan: 0.35,
      ppn: 0.11,
      tahun_umr: 2023,
      provinsi_umr: "",
      jumlah_staff: 0,
      biaya_oau: 0.06,
      biaya_sewa: 0,
      lama_sewa: 0,
      biaya_fitout: 0,
    },
    output: {
      user_generated: {
        sales: 0,
        ppn: 0,
        net_sales: 0,
        cogs: 0,
        gross_profit: 0,
        staff_expense: 0,
        oau_expense: 0,
        rental_expense: 0,
        fitout_expense: 0,
        store_income: 0,
      },
      model_generated: {
        sales: 0,
        ppn: 0,
        net_sales: 0,
        cogs: 0,
        gross_profit: 0,
        staff_expense: 0,
        oau_expense: 0,
        rental_expense: 0,
        fitout_expense: 0,
        store_income: 0,
      },
    },
    remark: "",
  };

  const formulir = useForm<Formulir>({
    initialValues: initialValueFormulir,
    validate: {},
  });

  const [versiTerpilih, setVersiTerpilih] = useState("");
  const RENTANG_POPULASI = [
    { value: 0, label: "0 - 500.000" },
    { value: 20, label: "500.001 - 1.000.000" },
    { value: 40, label: "1.000.001 - 1.500.000" },
    { value: 60, label: "1.500.001 - 2.000.000" },
    { value: 80, label: "2.000.001 - 2.500.000" },
    { value: 100, label: "> 2.500.000" },
  ];
  const [rentangPopulasi, setRentangPopulasi] = useState(0);
  const [kelasMall, setKelasMall] = useState(0);
  const mallIconKosong = (nilai: number) => {
    const defaultProps = { size: rem(30), color: "gray" };
    switch (nilai) {
      case 1:
        return <IconBuildingSkyscraper {...defaultProps} />;
      case 2:
        return <IconBuilding {...defaultProps} />;
      case 3:
        return <IconBuildingEstate {...defaultProps} />;
      case 4:
        return <IconBuildingStore {...defaultProps} />;
    }
  };
  const mallIconTerpilih = (nilai: number) => {
    const defaultProps = { size: rem(30) };

    switch (nilai) {
      case 1:
        return (
          <IconBuildingSkyscraper
            color={theme.colors.lime[7]}
            {...defaultProps}
          />
        );
      case 2:
        return (
          <IconBuilding color={theme.colors.yellow[7]} {...defaultProps} />
        );
      case 3:
        return (
          <IconBuildingEstate
            color={theme.colors.orange[7]}
            {...defaultProps}
          />
        );
      case 4:
        return (
          <IconBuildingStore color={theme.colors.red[7]} {...defaultProps} />
        );
    }
  };
  const [luasToko, setLuasToko] = useState<number | "">("");
  const [penjualanUser, setPenjualanUser] = useState<number | "">("");
  const [marginPenjualan, setMarginPenjualan] = useState<number | "">(0.33);
  const [ppn, setPPN] = useState<number | "">(0.11);
  const TAHUN_UMR = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];
  const [tahunUMR, setTahunUMR] = useState("2023");
  const PROVINSI_UMR = [
    { value: "Aceh", label: "Aceh" },
    { value: "Sumatera Utara", label: "Sumatera Utara" },
    { value: "Sumatera Barat", label: "Sumatera Barat" },
    { value: "Riau", label: "Riau" },
    { value: "Jambi", label: "Jambi" },
    { value: "Sumatera Selatan", label: "Sumatera Selatan" },
    { value: "Bengkulu", label: "Bengkulu" },
    { value: "Lampung", label: "Lampung" },
    { value: "Bangka Belitung", label: "Bangka Belitung" },
    { value: "Kepulauan Riau", label: "Kepulauan Riau" },
    { value: "DKI Jakarta", label: "DKI Jakarta" },
    { value: "Jawa Barat", label: "Jawa Barat" },
    { value: "Jawa Tengah", label: "Jawa Tengah" },
    { value: "DI. Yogyakarta", label: "DI. Yogyakarta" },
    { value: "Jawa Timur", label: "Jawa Timur" },
    { value: "Banten", label: "Banten" },
    { value: "Bali", label: "Bali" },
    { value: "Nusa Tenggara Barat", label: "Nusa Tenggara Barat" },
    { value: "Nusa Tenggara Timur", label: "Nusa Tenggara Timur" },
    { value: "Kalimantan Barat", label: "Kalimantan Barat" },
    { value: "Kalimantan Tengah", label: "Kalimantan Tengah" },
    { value: "Kalimantan Selatan", label: "Kalimantan Selatan" },
    { value: "Kalimantan Timur", label: "Kalimantan Timur" },
    { value: "Kalimantan Utara", label: "Kalimantan Utara" },
    { value: "Sulawesi Utara", label: "Sulawesi Utara" },
    { value: "Sulawesi Tengah", label: "Sulawesi Tengah" },
    { value: "Sulawesi Selatan", label: "Sulawesi Selatan" },
    { value: "Sulawesi Tenggara", label: "Sulawesi Tenggara" },
    { value: "Gorontalo", label: "Gorontalo" },
    { value: "Sulawesi Barat", label: "Sulawesi Barat" },
    { value: "Maluku", label: "Maluku" },
    { value: "Maluku Utara", label: "Maluku Utara" },
    { value: "Papua Barat", label: "Papua Barat" },
    { value: "Papua", label: "Papua" },
  ];
  const [provinsiUMR, setProvinsiUMR] = useState("DKI Jakarta");
  const [jumlahStaff, setJumlahStaff] = useState<number | "">(1);
  const handlerJumlahStaff = useRef<NumberInputHandlers>();
  const [biayaAtkUtilitas, setBiayaAtkUtilitas] = useState<number | "">(0.06);
  const [biayaSewa, setBiayaSewa] = useState<number | "">("");
  const [lamaSewa, setLamaSewa] = useState<number | "">(1);
  const handlerJumlahTahunSewa = useRef<NumberInputHandlers>();
  const [biayaFitOut, setBiayaFitOut] = useState<number | "">("");

  return (
    <>
      <Grid grow justify="space-around">
        <Grid.Col span={6}>
          <Grid grow justify="space-around">
            <Grid.Col span={5}>
              <Flex justify="flex-start" align="flex-start" direction="column">
                <Text>Proposal ID</Text>
                <Text>Versi Proposal</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={7}>
              <Flex justify="flex-end" align="flex-end" direction="column">
                <Group spacing="xs">
                  <IconNumber />
                  <Text>{formulir.getInputProps("proposal_id").value}</Text>
                </Group>
                <Chip.Group value={versiTerpilih}>
                  <Group spacing="xs" align="flex-end" position="right">
                    <Chip
                      value="1"
                      size="xs"
                      onClick={() => setVersiTerpilih("1")}
                      color="teal"
                      variant="filled"
                      radius="sm"
                    >
                      1
                    </Chip>
                    <Chip
                      value="2"
                      size="xs"
                      onClick={() => setVersiTerpilih("2")}
                      color="teal"
                      variant="filled"
                      radius="sm"
                    >
                      2
                    </Chip>
                    <Chip
                      value="3"
                      size="xs"
                      onClick={() => setVersiTerpilih("3")}
                      color="teal"
                      variant="filled"
                      radius="sm"
                    >
                      3
                    </Chip>
                  </Group>
                </Chip.Group>
              </Flex>
            </Grid.Col>
            <Grid.Col span={12} pt={5} pb={0}>
              <Center>
                <Text>model v1:</Text>
              </Center>
            </Grid.Col>
            <Grid.Col span={12} pt={5} pb={0}>
              <Center>
                <Text>leaveoneout_n_30_Model_DNN_3_Layer_RELU_128_128</Text>
              </Center>
            </Grid.Col>
          </Grid>
          <Grid grow h={650} justify="space-around" mt={30}>
            <ScrollArea.Autosize
              type="hover"
              offsetScrollbars
              scrollbarSize={10}
              h={650}
              w="100%"
              styles={{
                root: {
                  border: "solid 2px",
                  borderColor: theme.colors.blue[5],
                },
                scrollbar: {
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: theme.colors.blue[5],
                  },
                  '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb':
                    {
                      display: "none",
                    },
                },
              }}
            >
              <Grid.Col span={12} pt={5} pb={0}>
                <Center>
                  <Title>Input Data Sales</Title>
                </Center>
              </Grid.Col>
              <Grid.Col span={12} pt={5} pb={0}>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconBriefcase size="1.2rem" />
                    <Text>Jenis SBU</Text>
                  </Group>
                  <SegmentedControl
                    fullWidth
                    transitionDuration={75}
                    transitionTimingFunction="ease"
                    radius="xs"
                    size="xs"
                    // color={theme.colors.blue[5]}
                    pl={0}
                    pr={0}
                    sx={{ width: "100%" }}
                    data={["Our Daily Dose", "Fisik Football", "Fisik Sport"]}
                    styles={{
                      indicator: {
                        backgroundColor: theme.colors.blue[9],
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconMapSearch size="1.2rem" />
                    <Text>Kota Kabupaten</Text>
                  </Group>
                  <TextInput
                    placeholder="Lokasi Kota atau Kabupaten Toko"
                    description="Evaluasi akan dilakukan pada input Kota atau Kabupaten menggunakan ChatGPT untuk mengatur nilai Rentang Populasi dan juga Provinsi UMR"
                    variant="unstyled"
                    size="sm"
                    sx={{ width: "100%", borderBottom: "dashed 1px" }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconFriends size="1.2rem" />
                    <Text>Rentang Populasi</Text>
                  </Group>
                  <Slider
                    value={rentangPopulasi}
                    onChange={setRentangPopulasi}
                    step={20}
                    marks={RENTANG_POPULASI}
                    thumbSize={32}
                    size={2}
                    sx={{ width: "100%" }}
                    styles={{
                      bar: {
                        backgroundColor: theme.colors.blue[5],
                      },
                      thumb: {
                        borderWidth: rem(2),
                        padding: rem(1),
                        backgroundColor: theme.colors.blue[5],
                        borderColor: theme.colors.blue[5],
                      },
                      mark: {
                        width: rem(6),
                        height: rem(6),
                        borderRadius: rem(6),
                        transform: `translateX(-${rem(3)}) translateY(-${rem(
                          2
                        )})`,
                        borderColor: theme.colors.dark[2],
                      },
                      markFilled: {
                        borderColor: theme.colors.blue[5],
                        backgroundColor: theme.colors.blue[5],
                      },
                      label: {
                        display: "none",
                      },
                      markLabel: {
                        fontSize: "xs",
                        paddingTop: rem(10),
                      },
                    }}
                    thumbChildren={<IconMoodTongueWink2 size="2rem" />}
                    pt={20}
                    pb={35}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconSortDescendingNumbers size="1.2rem" />
                    <Text>Kelas Mall</Text>
                  </Group>
                  <Rating
                    emptySymbol={mallIconKosong}
                    fullSymbol={mallIconTerpilih}
                    highlightSelectedOnly
                    value={kelasMall}
                    onChange={setKelasMall}
                    count={4}
                    styles={{
                      label: {},
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconZoomInArea size="1.2rem" />
                    <Text>Luas Toko</Text>
                  </Group>
                  <NumberInput
                    description="Luas toko hanya perlu dituliskan dalam format koma menggunakan dot seperti 2000.56"
                    hideControls
                    placeholder="contoh: 2000.56"
                    defaultValue={luasToko}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `${nilai} m2`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={2}
                    onChange={setLuasToko}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconPigMoney size="1.2rem" />
                    <Text>Prediksi Penjualan per Bulan</Text>
                  </Group>
                  <NumberInput
                    description="Prediksi penjualan kotor (Sales) toko per bulan menurut input user"
                    hideControls
                    placeholder="contoh: 30100200"
                    defaultValue={penjualanUser}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `Rp ${nilai}`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={0}
                    onChange={setPenjualanUser}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconCalculator size="1.2rem" />
                    <Text>Margin Penjualan</Text>
                  </Group>
                  <NumberInput
                    description="Pengaturan nilai rata - rata margin penjualan per bulan untuk toko yang diinput oleh user, dituliskan dalam format koma menggunakan dot seperti 0.33745"
                    placeholder="contoh: 0.33745"
                    defaultValue={marginPenjualan}
                    max={1}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `${parseFloat(nilai) * 100}%`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={4}
                    onChange={setMarginPenjualan}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconBuildingBank size="1.2rem" />
                    <Text>PPN</Text>
                  </Group>
                  <NumberInput
                    description="Nilai Pajak Pertambahan Nilai yang berlaku saat ini, ditulis dengan format koma menggunakan dot seperti 0.11"
                    hideControls
                    placeholder="contoh: 0.11"
                    defaultValue={ppn}
                    max={1}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `${parseFloat(nilai) * 100}%`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={4}
                    onChange={setPPN}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
              </Grid.Col>
              <Grid.Col span={12} pt={15} pb={15}>
                <Center>
                  <Title>Input Data Expense</Title>
                </Center>
              </Grid.Col>
              <Grid.Col span={12} pt={5} pb={0}>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconCalendar size="1.2rem" />
                    <Text>Tahun UMR</Text>
                  </Group>
                  <Select
                    placeholder="Pilih Tahun UMR"
                    data={TAHUN_UMR}
                    value={tahunUMR}
                    onChange={(nilai) => nilai !== null && setTahunUMR(nilai)}
                    variant="unstyled"
                    sx={{ width: "100%", borderBottom: "dashed 1px" }}
                    styles={{
                      item: {
                        "&[data-selected]": {
                          backgroundColor: theme.colors.blue[5],
                          ...theme.fn.hover({
                            backgroundColor: theme.colors.blue[5],
                          }),
                        },
                      },
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconMapPin size="1.2rem" />
                    <Text>Provinsi UMR</Text>
                  </Group>
                  <Select
                    placeholder="Pilih Provinsi UMR"
                    data={PROVINSI_UMR}
                    value={provinsiUMR}
                    onChange={(nilai) =>
                      nilai !== null && setProvinsiUMR(nilai)
                    }
                    variant="unstyled"
                    sx={{ width: "100%", borderBottom: "dashed 1px" }}
                    styles={{
                      item: {
                        "&[data-selected]": {
                          backgroundColor: theme.colors.blue[5],
                          ...theme.fn.hover({
                            backgroundColor: theme.colors.blue[5],
                          }),
                        },
                      },
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconUsers size="1.2rem" />
                    <Text>Jumlah Staff</Text>
                  </Group>
                  <Group grow spacing={5} py={0} w="100%">
                    <ActionIcon
                      size={15}
                      variant="transparent"
                      onClick={() =>
                        handlerJumlahStaff.current !== undefined &&
                        handlerJumlahStaff.current.decrement()
                      }
                      maw="4%"
                    >
                      -
                    </ActionIcon>
                    <NumberInput
                      hideControls
                      placeholder="contoh: 1"
                      defaultValue={jumlahStaff}
                      handlersRef={handlerJumlahStaff}
                      onChange={(nilai) => setJumlahStaff(nilai)}
                      min={1}
                      max={10}
                      step={1}
                      variant="unstyled"
                      sx={{
                        width: "100%",
                        borderBottom: "dashed 1px",
                      }}
                      styles={{
                        input: {
                          fontSize: "20px",
                          color: theme.colors.blue[5],
                          textAlign: "center",
                        },
                      }}
                      miw="92%"
                    />
                    <ActionIcon
                      size={15}
                      variant="transparent"
                      onClick={() =>
                        handlerJumlahStaff.current !== undefined &&
                        handlerJumlahStaff.current.increment()
                      }
                      maw="4%"
                    >
                      +
                    </ActionIcon>
                  </Group>
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconHomeBolt size="1.2rem" />
                    <Text>Biaya ATK dan Utilitas</Text>
                  </Group>
                  <NumberInput
                    description="Biaya ATK dan utilitas dengan asumsi persentase dari Sales, ditulis dengan format koma menggunakan dot seperti 0.06"
                    hideControls
                    placeholder="contoh: 0.06"
                    defaultValue={biayaAtkUtilitas}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `${parseFloat(nilai) * 100}%`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={4}
                    onChange={setBiayaAtkUtilitas}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconWallet size="1.2rem" />
                    <Text>Biaya Sewa</Text>
                  </Group>
                  <NumberInput
                    description="Nilai total biaya sewa dalam kontrak kerjasama atau offering"
                    hideControls
                    placeholder="contoh: 30100200.56"
                    defaultValue={biayaSewa}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `Rp ${nilai}`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={0}
                    onChange={setBiayaSewa}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconCalendarTime size="1.2rem" />
                    <Text>Lama Sewa (Tahun)</Text>
                  </Group>
                  <Group grow spacing={5} py={0} w="100%">
                    <ActionIcon
                      size={15}
                      variant="transparent"
                      onClick={() =>
                        handlerJumlahTahunSewa.current !== undefined &&
                        handlerJumlahTahunSewa.current.decrement()
                      }
                      maw="4%"
                    >
                      -
                    </ActionIcon>
                    <NumberInput
                      hideControls
                      placeholder="contoh: 1"
                      defaultValue={lamaSewa}
                      handlersRef={handlerJumlahTahunSewa}
                      onChange={(nilai) => setLamaSewa(nilai)}
                      min={1}
                      max={10}
                      step={1}
                      variant="unstyled"
                      sx={{
                        width: "100%",
                        borderBottom: "dashed 1px",
                      }}
                      styles={{
                        input: {
                          fontSize: "20px",
                          color: theme.colors.blue[5],
                          textAlign: "center",
                        },
                      }}
                      miw="92%"
                    />
                    <ActionIcon
                      size={15}
                      variant="transparent"
                      onClick={() =>
                        handlerJumlahTahunSewa.current !== undefined &&
                        handlerJumlahTahunSewa.current.increment()
                      }
                      maw="4%"
                    >
                      +
                    </ActionIcon>
                  </Group>
                </Flex>
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  p={15}
                >
                  <Group spacing={5}>
                    <IconBulldozer size="1.2rem" />
                    <Text>Biaya Fitout</Text>
                  </Group>
                  <NumberInput
                    description="Nilai total biaya untuk proses fitting out interior pada toko baru"
                    hideControls
                    placeholder="contoh: 500100200"
                    defaultValue={biayaFitOut}
                    parser={(nilai) => nilai.replace(/\s?|(,*)/g, "")}
                    formatter={(nilai) =>
                      !Number.isNaN(parseFloat(nilai))
                        ? `Rp ${nilai}`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={0}
                    onChange={setBiayaFitOut}
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: theme.colors.blue[5],
                        textAlign: "center",
                      },
                    }}
                  />
                </Flex>
              </Grid.Col>
            </ScrollArea.Autosize>
          </Grid>
        </Grid.Col>
        <Grid.Col span={6}>
          <Grid justify="space-around">
            <Grid.Col span={12}>
              <Center>
                <Title>Output</Title>
              </Center>
            </Grid.Col>
          </Grid>
          <Grid justify="space-around">
            <Grid.Col span="content">
              <Text>Chart of Account</Text>
              <Text>Sales</Text>
              <Text>VAT 11%</Text>
              <Text>Net Sales</Text>
              <Text>Cost of Goods Sold</Text>
              <Text>Gross Profit</Text>
              <Text>Staff Expense</Text>
              <Text>Office and Utilities Expense</Text>
              <Text>Rental Expense</Text>
              <Text>Fitout Expense</Text>
              <Text>Store Income</Text>
            </Grid.Col>
            <Grid.Col span={2}>User Output</Grid.Col>
            <Grid.Col span={2}>Model Output</Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <Grid grow justify="space-around" mt={20}>
        <Grid.Col span={12} px={0}>
          <Group grow spacing="lg">
            <Button
              variant="outline"
              onClick={() =>
                setProps((stateSebelumnya) => ({
                  ...stateSebelumnya,
                  popUp: {
                    togglePopUp: false,
                    judulPopUp: "",
                    dataPopUp: undefined,
                  },
                }))
              }
              styles={{
                root: {
                  color: theme.colors.red[8],
                  borderColor: theme.colors.red[8],
                  ...theme.fn.hover({
                    backgroundColor: theme.colors.red[8],
                    color: theme.colors.dark[9],
                  }),
                },
                label: {
                  fontSize: "20px",
                },
              }}
            >
              Batal
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setProps((stateSebelumnya) => ({
                  ...stateSebelumnya,
                  popUp: {
                    togglePopUp: false,
                    judulPopUp: "",
                    dataPopUp: undefined,
                  },
                }))
              }
              styles={{
                root: {
                  color: theme.colors.blue[8],
                  borderColor: theme.colors.blue[8],
                  ...theme.fn.hover({
                    backgroundColor: theme.colors.blue[8],
                    color: theme.colors.dark[9],
                  }),
                },
                label: {
                  fontSize: "20px",
                },
              }}
            >
              Simpan
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setProps((stateSebelumnya) => ({
                  ...stateSebelumnya,
                  popUp: {
                    togglePopUp: false,
                    judulPopUp: "",
                    dataPopUp: undefined,
                  },
                }))
              }
              styles={{
                root: {
                  color: theme.colors.green[8],
                  borderColor: theme.colors.green[8],
                  ...theme.fn.hover({
                    backgroundColor: theme.colors.green[8],
                    color: theme.colors.dark[9],
                  }),
                },
                label: {
                  fontSize: "20px",
                },
              }}
            >
              Kirim
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
};
