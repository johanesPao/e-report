import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";
import { useAppDispatch } from "../state/hook";

const BuyingProposal = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>BuyingProposal</div>
      <Button onClick={() => dispatch(setDrawerTerbuka(true))}>Open</Button>
    </>
  );
};

export default BuyingProposal;
