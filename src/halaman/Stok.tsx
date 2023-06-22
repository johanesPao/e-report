import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";
import { StateStok } from "../fungsi/halaman/stok";

const Stok = ({
  props,
  setProps,
}: {
  props: StateStok;
  setProps: React.Dispatch<React.SetStateAction<StateStok>>;
}) => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>Stok</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default Stok;
