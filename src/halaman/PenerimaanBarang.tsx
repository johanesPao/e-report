import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";

const PenerimaanBarang = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>PenerimaanBarang</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default PenerimaanBarang;
