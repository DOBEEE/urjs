import { createElement, FC, useState, useEffect } from "rax";
import Upload from "@/Agro-Mobile/Upload";
import { Icon, Form } from "@alifd/meet";
import { checkCb, submitCheckCb } from "../../hooks";
import FormItem from "../FormItem";

const UploadItem = (props) => {
  const { conf, data, formValues, setFormValues, checkRequired } = props;
  const readOnly = conf.readOnly || props.readOnly;
  // const [errorText, setErrorText] = useState("");
  // checkCb(props, setErrorText);
  // submitCheckCb(props, setErrorText);
  return (
    <FormItem
      {...props}
      label={conf.label}
      readOnly={readOnly}
      required={!readOnly && conf.required}
      // errorText={!readOnly ? errorText : ""}
    >
      <Upload
        disabled={readOnly}
        limit={conf.limit || 10}
        count={(conf.maxCount || 10) - (data || []).length}
        message={conf.placeholder}
        demo={conf.demo}
        onChange={(list) => {
          setFormValues({
            [conf.valueId]: list.map((item) => item.url),
          });
          // conf.onChange && conf.onChange({ value: list, ...props });
        }}
        value={
          (data || []).map((item) => ({
            url: item,
          })) || []
        }
      />
    </FormItem>
  );
};
export default UploadItem;
