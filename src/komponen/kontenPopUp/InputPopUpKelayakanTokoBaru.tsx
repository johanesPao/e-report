import {
  ActionIcon,
  Button,
  Center,
  Chip,
  Flex,
  Grid,
  Group,
  Loader,
  NumberInput,
  NumberInputHandlers,
  Rating,
  ScrollArea,
  SegmentedControl,
  Select,
  Slider,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  kalkulasiStoreIncome,
  StateKelayakanTokoBaru,
  generateProposalID,
  handleKotaKabupatenHilangFokus,
  handlePerubahanKotaKabupaten,
  monitorInputPrediksiModel,
  renderOutput,
  KonfirmasiProposal,
  cekFormValid,
} from "../../fungsi/halaman/kelayakanTokoBaru";
import {
  EModePopUpKelayakanTokoBaru,
  EModeTeksOutputNewStore,
  ETindakanProposalTokoBaru,
  Formulir,
  IAksenWarnaPopUp,
  IChatGPT,
  IDataInputItemKelayakanTokoBaru,
  IDisabilitasInputKelayakanTokoBaru,
  IRentangPopulasiInputItem,
  IUMRInputItem,
} from "../../fungsi/basic";
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
import { useAppSelector } from "../../state/hook";
import { getParameterBc } from "../../fitur_state/dataParam";
import { getNamaPengguna } from "../../fitur_state/pengguna";
import { StatePopUp } from "../PopUp";

export const InputPopUpKelayakanTokoBaru = ({
  props,
  aksenWarna,
  popUp,
  setPopUp,
}: {
  props: StateKelayakanTokoBaru;
  aksenWarna: IAksenWarnaPopUp;
  popUp: StatePopUp;
  setPopUp: React.Dispatch<React.SetStateAction<StatePopUp>>;
}) => {
  const theme = useMantineTheme();
  const parameterBc = useAppSelector(getParameterBc);
  const pengguna = useAppSelector(getNamaPengguna);
  const chatGPT: IChatGPT = {
    klien: {
      endpoint_api: parameterBc.chatgpt.endpoint_api,
      kunci_api: parameterBc.chatgpt.kunci_api,
      model_gpt: parameterBc.chatgpt.model_gpt,
      temperature: parameterBc.chatgpt.temperature,
      top_p: parameterBc.chatgpt.top_p,
      n: parameterBc.chatgpt.n,
    },
    kueri: {
      kota_eksis: {
        role: parameterBc.chatgpt.role_kota_eksis,
        prompt: parameterBc.chatgpt.prompt_kota_eksis,
      },
      populasi_kota_kabupaten: {
        role: parameterBc.chatgpt.role_populasi_kota_kabupaten,
        prompt: parameterBc.chatgpt.prompt_populasi_kota_kabupaten,
      },
      provinsi_kota_kabupaten: {
        role: parameterBc.chatgpt.role_provinsi_kota_kabupaten,
        prompt: parameterBc.chatgpt.prompt_provinsi_kota_kabupaten,
      },
    },
  };

  // konversi data rentang populasi
  let dataRentangPopulasi: IRentangPopulasiInputItem[] = [];
  for (
    let hitung = 0;
    hitung < props.inputItem.rentangPopulasiItem.length;
    hitung++
  ) {
    dataRentangPopulasi.push({
      value: hitung * 20,
      label: props.inputItem.rentangPopulasiItem[hitung].label,
    });
  }
  // konversi data tahun umr
  let dataTahunUMR: IUMRInputItem[] = [];
  let dataProvinsiUMR: IUMRInputItem[][] = [];
  for (let hitung = 0; hitung < props.inputItem.umrItem.length; hitung++) {
    dataTahunUMR.push({
      value: props.inputItem.umrItem[hitung].tahun_data.toString(),
      label: props.inputItem.umrItem[hitung].tahun_data.toString(),
    });
    let dataProvinsiTahun: IUMRInputItem[] = [];
    for (
      let hitungProvinsi = 0;
      hitungProvinsi < props.inputItem.umrItem[hitung].data.length;
      hitungProvinsi++
    ) {
      dataProvinsiTahun.push({
        value: props.inputItem.umrItem[hitung].data[hitungProvinsi].label,
        label: props.inputItem.umrItem[hitung].data[hitungProvinsi].label,
      });
    }
    dataProvinsiUMR.push(dataProvinsiTahun);
  }
  let dataInputItem: IDataInputItemKelayakanTokoBaru = {
    versiTerpilih: ["1"],
    sbuItem: props.inputItem.sbuItem,
    rentangPopulasi: dataRentangPopulasi,
    kelasMall: {
      iconSemua: (nilai: number) => {
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
      },
      iconTerpilih: (nilai: number) => {
        const defaultProps = { size: rem(30) };
        switch (nilai) {
          case 1:
            return (
              <Tooltip
                label="Mall Kelas 1"
                withArrow
                transitionProps={{ transition: "rotate-right", duration: 400 }}
                position="right"
                pos="fixed"
                color={aksenWarna.kelasMall.kelasSatu}
              >
                <IconBuildingSkyscraper
                  color={aksenWarna.kelasMall.kelasSatu}
                  {...defaultProps}
                />
              </Tooltip>
            );
          case 2:
            return (
              <Tooltip
                label="Mall Kelas 2"
                withArrow
                transitionProps={{ transition: "rotate-right", duration: 400 }}
                position="right"
                pos="fixed"
                color={aksenWarna.kelasMall.kelasDua}
              >
                <IconBuilding
                  color={aksenWarna.kelasMall.kelasDua}
                  {...defaultProps}
                />
              </Tooltip>
            );
          case 3:
            return (
              <Tooltip
                label="Mall Kelas 3"
                withArrow
                transitionProps={{ transition: "rotate-right", duration: 400 }}
                position="right"
                pos="fixed"
                color={aksenWarna.kelasMall.kelasTiga}
              >
                <IconBuildingEstate
                  color={aksenWarna.kelasMall.kelasTiga}
                  {...defaultProps}
                />
              </Tooltip>
            );
          case 4:
            return (
              <Tooltip
                label="Mall Kelas 4/Non Mall"
                withArrow
                transitionProps={{ transition: "rotate-right", duration: 400 }}
                position="right"
                pos="fixed"
                color={aksenWarna.kelasMall.kelasEmpat}
              >
                <IconBuildingStore
                  color={aksenWarna.kelasMall.kelasEmpat}
                  {...defaultProps}
                />
              </Tooltip>
            );
        }
      },
    },
    tahunUMR: dataTahunUMR,
    provinsiUMR: dataProvinsiUMR,
  };

  // Initial Value Formulir sebagai blanket kosong
  // Nilai Initial Value Formulir pada dasarnya akan bergantung kepada EModePopUpKelayakanTokoBaru
  // co: EModePopUpKelayakanTokoBaru.PENAMBAHAN, EModePopUpKelayakanTokoBaru.PERSETUJUAN,
  // EModePopUpKelayakanTokoBaru.SUNTING atau EModePopUpKelayakanTokoBaru.HAPUS
  let initialValueFormulir: Formulir = {
    log: [],
    proposal_id: "",
    versi_proposal: "",
    input: {
      versi_model: "",
      nama_model: "",
      sbu: "",
      kota_kabupaten: "",
      rentang_populasi: -1,
      kelas_mall: 0,
      luas_toko: undefined,
      margin_penjualan: 0.35,
      ppn: 0.11,
      tahun_umr: new Date().getFullYear().toString(),
      provinsi_umr: "DKI Jakarta",
      jumlah_staff: 1,
      biaya_oau: 0.06,
      biaya_sewa: undefined,
      lama_sewa: 1,
      biaya_fitout: undefined,
    },
    output: {
      user_generated: {
        sales: undefined,
        vat: 0,
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
        vat: 0,
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

  // Status disabilitas input default
  const statusAwalDisabilitasInput: IDisabilitasInputKelayakanTokoBaru = {
    versi_proposal: false,
    sbu: false,
    kota_kabupaten: false,
    rentang_populasi: false,
    kelas_mall: false,
    luas_toko: false,
    prediksi_penjualan_user: false,
    margin_penjualan: false,
    ppn: false,
    tahun_umr: false,
    provinsi_umr: false,
    jumlah_staff: false,
    biaya_oau: false,
    biaya_sewa: false,
    lama_sewa: false,
    biaya_fitout: false,
  };
  const [statusDisabilitasInput, setStatusDisabilitasInput] = useState(
    statusAwalDisabilitasInput
  );

  // Loader TextInput Kota Kabupaten
  const [memuatChatGPT, setMemuatChatGPT] = useState(false);

  // Loader PopUp konfirmasi
  const [konfirmasiPopUp, setKonfirmasiPopUp] = useState(false);

  // Tindakan PopUp
  const [tindakanPopUp, setTindakanPopUp] = useState(
    ETindakanProposalTokoBaru.KIRIM
  );

  // Validitas Formulir
  const [valid, setValid] = useState(false);

  // State Input Item berdasar mode pop up
  useEffect(() => {
    switch (popUp.modeProposal) {
      case EModePopUpKelayakanTokoBaru.PENAMBAHAN: {
        // set initialValueFormulir.proposal_id
        const proposalID = generateProposalID(props);
        formulir.setValues((stateSebelumnya) => ({
          ...stateSebelumnya,
          proposal_id: proposalID,
          versi_proposal: "1",
          input: {
            ...stateSebelumnya.input,
            nama_model: props.inputItem.model.namaModel,
            versi_model: props.inputItem.model.versi,
          },
        }));
        // set state disabilitas input pada saat mode penambahan
        setStatusDisabilitasInput((stateSebelumnya) => ({
          ...stateSebelumnya,
          rentang_populasi: true,
          tahun_umr: true,
          provinsi_umr: true,
        }));
        // reset touched dan dirty serta membuat snapshot baru dari formulir.values
        formulir.resetTouched();
        formulir.resetDirty();
        break;
      }
      default: {
        break;
      }
    }
  }, []);

  // Render Prediksi Sales
  useEffect(() => {
    monitorInputPrediksiModel(formulir, props);
  }, [
    formulir.values.input.sbu,
    formulir.values.input.rentang_populasi,
    formulir.values.input.kelas_mall,
    formulir.values.input.luas_toko,
  ]);

  // Render teks Output
  useEffect(() => {
    kalkulasiStoreIncome(formulir, props);
  }, [formulir.values.output]);

  const handlerJumlahStaff = useRef<NumberInputHandlers>();
  const handlerJumlahTahunSewa = useRef<NumberInputHandlers>();

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
                <Chip.Group
                  value={formulir.getInputProps("versi_proposal").value}
                >
                  <Group spacing="xs" align="flex-end" position="right">
                    {dataInputItem.versiTerpilih.map((versi) => (
                      <Chip
                        value={versi}
                        size="xs"
                        onClick={() => {
                          formulir.setFieldValue("versi_proposal", versi);
                        }}
                        variant="filled"
                        radius="sm"
                        key={versi}
                        styles={{
                          label: {
                            "&[data-checked]": {
                              "&:not([data-disabled])": {
                                backgroundColor: aksenWarna.mayor,
                                ...theme.fn.hover({
                                  backgroundColor: aksenWarna.mayor,
                                }),
                              },
                            },
                          },
                        }}
                        disabled={statusDisabilitasInput.versi_proposal}
                      >
                        {versi}
                      </Chip>
                    ))}
                  </Group>
                </Chip.Group>
              </Flex>
            </Grid.Col>
            <Grid.Col span={12} pt={5} pb={0}>
              <Center>
                <Text>
                  model {formulir.getInputProps("input.versi_model").value}:
                </Text>
              </Center>
            </Grid.Col>
            <Grid.Col span={12} pt={5} pb={0}>
              <Center>
                <Text>{formulir.getInputProps("input.nama_model").value}</Text>
              </Center>
            </Grid.Col>
          </Grid>
          <Grid grow h={630} justify="space-around" mt={30}>
            <ScrollArea.Autosize
              type="hover"
              offsetScrollbars
              scrollbarSize={10}
              h={615}
              w="100%"
              styles={{
                root: {
                  border: "solid 2px",
                  borderColor: aksenWarna.mayor,
                },
                scrollbar: {
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: aksenWarna.mayor,
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
                    pl={0}
                    pr={0}
                    sx={{ width: "100%" }}
                    {...formulir.getInputProps("input.sbu")}
                    value={formulir.getInputProps("input.sbu").value}
                    data={dataInputItem.sbuItem}
                    styles={{
                      indicator: {
                        backgroundColor: aksenWarna.mayor,
                      },
                    }}
                    // onClick={() => monitorInputPrediksiModel(formulir, props)}
                    disabled={statusDisabilitasInput.sbu}
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
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.kota_kabupaten")}
                    value={formulir.values.input.kota_kabupaten}
                    onChange={(e) =>
                      handlePerubahanKotaKabupaten(e.target.value, formulir)
                    }
                    onBlur={() =>
                      handleKotaKabupatenHilangFokus(
                        setMemuatChatGPT,
                        formulir,
                        chatGPT,
                        props,
                        statusDisabilitasInput,
                        setStatusDisabilitasInput,
                        initialValueFormulir
                      )
                    }
                    disabled={statusDisabilitasInput.kota_kabupaten}
                    rightSection={
                      memuatChatGPT ? (
                        <>
                          <Text pr={"0.5rem"} c={aksenWarna.teksLoading}>
                            memuat chat GPT {chatGPT.klien.model_gpt}
                            ...
                          </Text>
                          <Loader size="xs" color={aksenWarna.mayor} />
                        </>
                      ) : null
                    }
                    rightSectionWidth="lg"
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
                    step={20}
                    marks={dataInputItem.rentangPopulasi}
                    thumbSize={32}
                    size={2}
                    sx={{ width: "100%" }}
                    styles={{
                      bar: {
                        backgroundColor: statusDisabilitasInput.rentang_populasi
                          ? aksenWarna.disable.mid
                          : aksenWarna.mayor,
                        height: rem(3),
                      },
                      thumb: {
                        borderWidth: rem(2),
                        padding: rem(1),
                        backgroundColor: aksenWarna.mayor,
                        borderColor: aksenWarna.mayor,
                      },
                      mark: {
                        width: rem(20),
                        height: rem(20),
                        borderRadius: rem(20),
                        transform: `translateX(-${rem(10)}) translateY(-${rem(
                          9
                        )})`,
                        borderColor: statusDisabilitasInput.rentang_populasi
                          ? aksenWarna.disable.mid
                          : aksenWarna.mayor,
                        backgroundColor: statusDisabilitasInput.rentang_populasi
                          ? aksenWarna.disable.mayor
                          : aksenWarna.minor,
                      },
                      markFilled: {
                        borderColor: statusDisabilitasInput.rentang_populasi
                          ? aksenWarna.disable.mid
                          : aksenWarna.mayor,
                        backgroundColor: statusDisabilitasInput.rentang_populasi
                          ? aksenWarna.disable.minor
                          : aksenWarna.mayor,
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
                    {...formulir.getInputProps("input.rentang_populasi")}
                    // onChange={() => monitorInputPrediksiModel(formulir, props)}
                    disabled={statusDisabilitasInput.rentang_populasi}
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
                    emptySymbol={dataInputItem.kelasMall.iconSemua}
                    fullSymbol={dataInputItem.kelasMall.iconTerpilih}
                    highlightSelectedOnly
                    count={4}
                    styles={{
                      label: {},
                    }}
                    {...formulir.getInputProps("input.kelas_mall")}
                    // onClick={() => monitorInputPrediksiModel(formulir, props)}
                    readOnly={statusDisabilitasInput.kelas_mall}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.luas_toko")}
                    // onBlur={() => monitorInputPrediksiModel(formulir, props)}
                    disabled={statusDisabilitasInput.luas_toko}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("output.user_generated.sales")}
                    onChange={(nilai) =>
                      formulir.setFieldValue(
                        "output.user_generated.sales",
                        nilai
                      )
                    }
                    disabled={statusDisabilitasInput.prediksi_penjualan_user}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.margin_penjualan")}
                    disabled={statusDisabilitasInput.margin_penjualan}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.ppn")}
                    disabled={statusDisabilitasInput.ppn}
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
                    data={dataInputItem.tahunUMR}
                    variant="unstyled"
                    sx={{ width: "100%", borderBottom: "dashed 1px" }}
                    styles={{
                      item: {
                        "&[data-selected]": {
                          backgroundColor: aksenWarna.mayor,
                          ...theme.fn.hover({
                            backgroundColor: aksenWarna.mayor,
                          }),
                        },
                      },
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.tahun_umr")}
                    disabled={statusDisabilitasInput.tahun_umr}
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
                    data={dataInputItem.provinsiUMR[0]}
                    variant="unstyled"
                    sx={{ width: "100%", borderBottom: "dashed 1px" }}
                    styles={{
                      item: {
                        "&[data-selected]": {
                          backgroundColor: aksenWarna.mayor,
                          ...theme.fn.hover({
                            backgroundColor: aksenWarna.mayor,
                          }),
                        },
                      },
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.provinsi_umr")}
                    disabled={statusDisabilitasInput.provinsi_umr}
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
                      disabled={statusDisabilitasInput.jumlah_staff}
                    >
                      -
                    </ActionIcon>
                    <NumberInput
                      hideControls
                      placeholder="contoh: 1"
                      handlersRef={handlerJumlahStaff}
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
                          color: aksenWarna.mayor,
                          textAlign: "center",
                        },
                      }}
                      miw="92%"
                      {...formulir.getInputProps("input.jumlah_staff")}
                      disabled={statusDisabilitasInput.jumlah_staff}
                    />
                    <ActionIcon
                      size={15}
                      variant="transparent"
                      onClick={() =>
                        handlerJumlahStaff.current !== undefined &&
                        handlerJumlahStaff.current.increment()
                      }
                      maw="4%"
                      disabled={statusDisabilitasInput.jumlah_staff}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.biaya_oau")}
                    disabled={statusDisabilitasInput.biaya_oau}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.biaya_sewa")}
                    disabled={statusDisabilitasInput.biaya_sewa}
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
                      disabled={statusDisabilitasInput.lama_sewa}
                    >
                      -
                    </ActionIcon>
                    <NumberInput
                      hideControls
                      placeholder="contoh: 1"
                      handlersRef={handlerJumlahTahunSewa}
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
                          color: aksenWarna.mayor,
                          textAlign: "center",
                        },
                      }}
                      miw="92%"
                      {...formulir.getInputProps("input.lama_sewa")}
                      disabled={statusDisabilitasInput.lama_sewa}
                    />
                    <ActionIcon
                      size={15}
                      variant="transparent"
                      onClick={() =>
                        handlerJumlahTahunSewa.current !== undefined &&
                        handlerJumlahTahunSewa.current.increment()
                      }
                      maw="4%"
                      disabled={statusDisabilitasInput.lama_sewa}
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
                    variant="unstyled"
                    sx={{
                      width: "100%",
                      borderBottom: "dashed 1px",
                    }}
                    styles={{
                      input: {
                        fontSize: "20px",
                        color: aksenWarna.mayor,
                        textAlign: "center",
                      },
                    }}
                    {...formulir.getInputProps("input.biaya_fitout")}
                    disabled={statusDisabilitasInput.biaya_fitout}
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
            <Grid.Col span={2}>
              <Text>User Output</Text>
              {renderOutput(
                formulir.getInputProps("output.user_generated.sales").value !==
                  undefined
                  ? formulir.getInputProps("output.user_generated.sales").value
                  : 0,
                EModeTeksOutputNewStore.INCOME
              )}
              {renderOutput(
                formulir.getInputProps("output.user_generated.vat").value,
                EModeTeksOutputNewStore.EXPENSE
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.net_sales").value,
                EModeTeksOutputNewStore.INCOME
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.cogs").value,
                EModeTeksOutputNewStore.EXPENSE
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.gross_profit")
                  .value,
                EModeTeksOutputNewStore.INCOME
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.staff_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.oau_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.rental_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.fitout_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}

              {renderOutput(
                formulir.getInputProps("output.user_generated.store_income")
                  .value,
                EModeTeksOutputNewStore.INCOME
              )}
            </Grid.Col>
            <Grid.Col span={2}>
              Model Output
              {renderOutput(
                formulir.getInputProps("output.model_generated.sales").value,
                EModeTeksOutputNewStore.INCOME
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.vat").value,
                EModeTeksOutputNewStore.EXPENSE
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.net_sales")
                  .value,
                EModeTeksOutputNewStore.INCOME
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.cogs").value,
                EModeTeksOutputNewStore.EXPENSE
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.gross_profit")
                  .value,
                EModeTeksOutputNewStore.INCOME
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.staff_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.oau_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.rental_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.fitout_expense")
                  .value,
                EModeTeksOutputNewStore.EXPENSE
              )}
              {renderOutput(
                formulir.getInputProps("output.model_generated.store_income")
                  .value,
                EModeTeksOutputNewStore.INCOME
              )}
            </Grid.Col>
          </Grid>
          <Grid justify="space-around" mt={20}>
            <Grid.Col span={12}>
              <Center>
                <Title order={2}>Remark</Title>
              </Center>
            </Grid.Col>
            <Grid.Col span={12} px={65}>
              <Textarea
                autosize
                minRows={15}
                maxRows={15}
                {...formulir.getInputProps("remark")}
              ></Textarea>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <Grid grow justify="space-around" mt={20}>
        <Grid.Col span={12} px={0}>
          <Group grow spacing="lg">
            <Button
              variant="outline"
              onClick={() =>
                setPopUp((stateSebelumnya) => ({
                  ...stateSebelumnya,
                  togglePopUp: false,
                  judulPopUp: "",
                  // dataPopUp: undefined,
                }))
              }
              styles={{
                root: {
                  color: aksenWarna.tombolBatal.utama,
                  borderColor: aksenWarna.tombolBatal.utama,
                  ...theme.fn.hover({
                    backgroundColor: aksenWarna.tombolBatal.hover.background,
                    color: aksenWarna.tombolBatal.hover.teks,
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
              onClick={() => {
                setValid(cekFormValid(formulir));
                setTindakanPopUp(ETindakanProposalTokoBaru.SIMPAN);
                setKonfirmasiPopUp(true);
              }}
              styles={{
                root: {
                  color: aksenWarna.tombolSimpan.utama,
                  borderColor: aksenWarna.tombolSimpan.utama,
                  ...theme.fn.hover({
                    backgroundColor: aksenWarna.tombolSimpan.hover.background,
                    color: aksenWarna.tombolSimpan.hover.teks,
                  }),
                },
                label: {
                  fontSize: "20px",
                },
              }}
              type="submit"
            >
              Simpan
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setValid(cekFormValid(formulir));
                setTindakanPopUp(ETindakanProposalTokoBaru.KIRIM);
                setKonfirmasiPopUp(true);
              }}
              styles={{
                root: {
                  color: aksenWarna.tombolKirim.utama,
                  borderColor: aksenWarna.tombolKirim.utama,
                  ...theme.fn.hover({
                    backgroundColor: aksenWarna.tombolKirim.hover.background,
                    color: aksenWarna.tombolKirim.hover.teks,
                  }),
                },
                label: {
                  fontSize: "20px",
                },
              }}
              type="submit"
            >
              Kirim
            </Button>
          </Group>
          {KonfirmasiProposal(
            konfirmasiPopUp,
            setKonfirmasiPopUp,
            valid,
            formulir,
            aksenWarna,
            props,
            tindakanPopUp,
            pengguna,
            popUp,
            setPopUp
          )}
        </Grid.Col>
      </Grid>
    </>
  );
};
