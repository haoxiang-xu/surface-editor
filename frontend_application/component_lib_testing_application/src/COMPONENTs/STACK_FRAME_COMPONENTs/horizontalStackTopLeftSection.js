import HorizontalStackCloseButton from "./horizontalStackCloseButton";
import HorizontalStackLengthAdjustButton from "./horizontalStackLengthAdjustButton";

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
