import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";

const LabaRugiToko = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>LabaRugiToko</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default LabaRugiToko;
