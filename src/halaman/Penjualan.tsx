import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { getKonekKeBC } from "../fitur_state/event";

const Penjualan = () => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  return (
    <>
      <div>Penjualan</div>
      <Button
        disabled={!konekKeBc}
        onClick={() => dispatch(setDrawerTerbuka(true))}
      >
        Open
      </Button>
    </>
  );
};

export default Penjualan;
