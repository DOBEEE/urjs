import { createElement, FC, useState, useEffect } from "rax";
import { Form, TextField } from "@alifd/meet";
import { fomatFloat } from "@/utils";
import { checkCb, submitCheckCb } from "../../hooks";
import FormItem from "../FormItem";
import View from "rax-view";
import "./index.less";

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

const highLightTextFieldStyles = {
  "text-field__input-element": {
    color: "#FF7012",
  },
  "text-field__input": {
    width: 686,
  },
};

const InputItem: FC<any> = (props) => {
  const { conf, data, formValues, setFormValues, formInstance } = props;
  const readOnly = conf.readOnly || props.readOnly;
  return (
    <FormItem
      {...props}
      label={conf.label}
      required={!readOnly && conf.required}
      tapable={conf.showArrow && !readOnly}
      readOnly={readOnly}
      // errorText={!readOnly ? errorText : ""}
    >
      <View
        key={`name-${readOnly}`}
        className="read-only-form-input"
        x-if={readOnly}
      >
        <div style={conf.style} className="content">
          {data || ""}
        </div>
        <div className="append">
          {typeof conf.captionDesc === "function"
            ? conf.captionDesc(props)
            : conf.captionDesc}
        </div>
      </View>
      <TextField
        x-else
        key={`name-${readOnly}`}
        type={conf.inputType || "text"}
        multiline={conf.rows && conf.rows > 1}
        rows={conf.rows || 1}
        style={conf.style}
        styles={commonTextFieldStyles}
        disabled={conf.disabled}
        readOnly={readOnly}
        value={data || ""}
        limitHint={!readOnly && conf.showMaxLength}
        maxLength={!readOnly && conf.showMaxLength ? conf.maxLength : undefined}
        onChange={(value) => {
          let res = value;
          if (conf.inputType == "number") {
            res = fomatFloat({ src: value, pos: 2, maxLength: conf.maxLength });
          } else if (conf.maxLength) {
            res = value.toString().substr(0, conf.maxLength);
          }
          console.log("----", res);
          setFormValues({
            [conf.valueId]: res,
          });
          // conf.onChange &&
          //   conf.onChange({
          //     value: res,
          //     ...props,
          //   });
        }}
        append={
          typeof conf.captionDesc === "function"
            ? conf.captionDesc(props)
            : conf.captionDesc
        }
        placeholder={!readOnly ? conf.placeholder : ""}
        controlled
      />
    </FormItem>
  );
};
export default InputItem;
