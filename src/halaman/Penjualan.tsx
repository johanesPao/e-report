import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";

const Penjualan = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>Penjualan</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default Penjualan;
