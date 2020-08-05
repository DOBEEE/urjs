import { createElement, FC, useState, useEffect } from "rax";
import { Form, TextField } from "@alifd/meet";
import { fomatFloat } from "@/utils";
import universal from "@/utils/universal";
import { checkCb, submitCheckCb } from "../../hooks";
import FormItem from "../FormItem";

const commonTextFieldStyles = {
  "text-field__input-element": {
    height: 44,
    minHeight: 44,
    color: "#212121",
  },
  "text-field__input": {
    width: 686,
    padding: 0,
  },
  "text-field__input-element--placeholder": {
    color: "#999",
  },
  "text-field__helper": {
    paddingRight: 0,
    paddingBottom: 0,
  },
};
const TapItem: FC<any> = (props) => {
  const { conf, data, readOnly = false, formValues, helpText } = props;
  // const [errorText, setErrorText] = useState("");
  // checkCb(props, setErrorText);
  // submitCheckCb(props, setErrorText);
  const value = data || "";
  return (
    <FormItem
      {...props}
      label={conf.label}
      required={conf.required}
      tapable={conf.showArrow && !readOnly}
      readOnly={readOnly}
      helpText={typeof conf.helpText === 'function' ? conf.helpText(props) : conf.helpText}
      // errorText={!readOnly ? errorText : ""}
      onClick={() => {
        conf.clickHandler && conf.clickHandler(props);
      }}
    >
      <TextField
        key={`name-${!readOnly}`}
        type={conf.inputType || "text"}
        multiline={conf.rows && conf.rows > 1}
        rows={conf.rows || 1}
        styles={commonTextFieldStyles}
        readOnly={!value || readOnly}
        prepend={readOnly ? null : value}
        value={readOnly ? value : ""}
        placeholder={!readOnly && !value ? conf.placeholder : ""}
        controlled
      />
    </FormItem>
  );
};
export default TapItem;
