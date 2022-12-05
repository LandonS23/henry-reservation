import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const TimePickerCustom = forwardRef(function TimePickerCustom(
  props,
  ref
) {
  const {
    onChange,
    value,
    placeholder,
    minminutes,
    minhours,
    maxminutes,
    maxhours,
    ...other
  } = props;

  return (
    <DatePicker
      {...other}
      onChange={(date) => props.onChange(date)}
      selected={value}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      placeholderText={placeholder}
      dateFormat="h:mm aa"
    />
  );
});
