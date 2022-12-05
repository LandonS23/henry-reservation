import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

export const DatePickerCustom = forwardRef(function DatePickerCustom(
  props,
  ref
) {
  const { onChange, value, placeholder, ...other } = props;

  return (
    <DatePicker
      {...other}
      onChange={(date) => props.onChange(date)}
      selected={value}
      minDate={addDays(new Date(), 1)}
      placeholderText={placeholder}
    />
  );
});
