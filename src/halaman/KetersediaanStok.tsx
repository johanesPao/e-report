import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";
import { StateKetersediaanStok } from "../fungsi/halaman/ketersediaanStok";

const KetersediaanStok = ({
  props,
  setProps,
}: {
  props: StateKetersediaanStok;
  setProps: React.Dispatch<React.SetStateAction<StateKetersediaanStok>>;
}) => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>KetersediaanStok</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default KetersediaanStok;
