import StackDivCloseButton from "./stackDivCloseButton";
import StackDivLengthAdjustButton from "./stackDivLengthAdjustButton";

const StackDivTopLeftSection = ({
  mode,
  //Maximize and Minimize Container
  onMaximizeOnClick,
  onMinimizeOnClick,
}) => {
  return (
    <>
      <StackDivLengthAdjustButton
        mode={mode}
        onMaximizeOnClick={onMaximizeOnClick}
        onMinimizeOnClick={onMinimizeOnClick}
      />
      <StackDivCloseButton />
    </>
  );
};

export default StackDivTopLeftSection;
