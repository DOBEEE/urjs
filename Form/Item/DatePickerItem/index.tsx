import { createElement, FC, useState, useEffect } from "rax";
import { Form, TextField } from "@alifd/meet";
import Text from "rax-text";
import universal from "@/utils/universal";
import moment from "moment";
import { checkCb, submitCheckCb } from "../../hooks";
import FormItem from "../FormItem";

const DatePickerItem: FC<any> = (props) => {
  const { conf, data, formValues, setFormValues } = props;
  const readOnly = conf.readOnly || props.readOnly;
  // const [errorText, setErrorText] = useState("");

  // checkCb(props, setErrorText);
  // submitCheckCb(props, setErrorText);
  return (
    <FormItem
      {...props}
      label={conf.label}
      required={!readOnly && conf.required}
      readOnly={readOnly}
      tapable={conf.showArrow && !readOnly}
      onClick={() => {
        universal.datePicker({
          format: "yyyy-MM-dd",
          currentDate: moment().format("YYYY-MM-DD"),
          success: (res) => {
            setFormValues({
              [conf.valueId]: new Date(res.date).getTime(),
            });
            // conf.onChange &&
            //   conf.onChange({
            //     value: new Date(res.date).getTime(),
            //     ...props,
            //   });
          },
        });
      }}
    >
      <Text key="data" x-if={data} style={{ color: "#212121", fontSize: 28 }}>
        {data ? moment(Number(data)).format("YYYY-MM-DD") : ""}
      </Text>
      <Text
        key="placeholder"
        style={{ color: "#999", fontSize: 28 }}
        x-if={!readOnly && !data}
      >
        {conf.placeholder}
      </Text>
      {/* <TextField
        key={`name-${editable}`}
        type={conf.inputType || "text"}
        multiline={conf.rows && conf.rows > 1}
        rows={conf.rows || 1}
        styles={commonTextFieldStyles}
        readOnly={true}
        value={data ? moment(data).format("YYYY-MM-DD") : ""}
        placeholder={editable ? conf.placeholder : ""}
        controlled
      /> */}
    </FormItem>
  );
};
export default DatePickerItem;
