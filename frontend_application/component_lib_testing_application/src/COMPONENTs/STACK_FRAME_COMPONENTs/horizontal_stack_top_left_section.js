import HorizontalStackCloseButton from "./horizontal_stack_close_button";
import HorizontalStackLengthAdjustButton from "./horizontal_stack_length_adjust_button";

const HorizontalStackTopLeftSection = ({
  mode,
  //Maximize and Minimize Container
  onMaximizeOnClick,
  onMinimizeOnClick,
}) => {
  return (
    <>
      <HorizontalStackLengthAdjustButton
        mode={mode}
        onMaximizeOnClick={onMaximizeOnClick}
        onMinimizeOnClick={onMinimizeOnClick}
      />
      <HorizontalStackCloseButton />
    </>
  );
};

export default HorizontalStackTopLeftSection;
