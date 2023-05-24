import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";

const KetersediaanStok = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>KetersediaanStok</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default KetersediaanStok;
