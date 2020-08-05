import { createElement, FC, useState, useEffect } from "rax";
import { Form, TextField } from "@alifd/meet";
import universal from "@/utils/universal";
import View from "rax-view";
import Text from "rax-text";
import NewPicker from "@/components/NewPicker";
import { checkCb, submitCheckCb } from "../../hooks";
import FormItem from "../FormItem";

const SelectItem: FC<any> = (props) => {
  const { conf, data, formValues, setFormValues } = props;
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [labelText, setLabelText] = useState("");
  const readOnly = conf.readOnly || props.readOnly;

  // checkCb(props, setErrorText);
  // submitCheckCb(props, setErrorText);

  useEffect(() => {
    async function init() {
      if (conf.getDataSource) {
        const res = await conf.getDataSource();
        setDataSource(res);
        setLabelText(() => NewPicker.getTextByVal(res, data));
      } else {
        setDataSource(conf.dataSource);
        setLabelText(() => NewPicker.getTextByVal(conf.dataSource, data));
      }
    }
    init();
  }, [data, conf]);
  return (
    <FormItem
      {...props}
      label={conf.label}
      required={!readOnly && conf.required}
      // errorText={!readOnly ? errorText : ""}
      tapable={conf.showArrow && !readOnly}
      readOnly={readOnly}
      onClick={() => {
        setVisible(true);
      }}
    >
      <Text
        key={"data" + labelText}
        x-if={data}
        style={{ color: "#212121", fontSize: 28 }}
      >
        {labelText}
      </Text>
      <Text
        x-else-if={!readOnly}
        key="placeholder"
        style={{ color: "#999", fontSize: 28 }}
        x-else={conf.placeholder}
      >
        {conf.placeholder}
      </Text>
      {/* <TextField
        key={`${conf.valueId}-${editable}`}
        type={conf.inputType || "text"}
        multiline={conf.rows && conf.rows > 1}
        rows={conf.rows || 1}
        styles={commonTextFieldStyles}
        readOnly={true}
        value={labelText}
        placeholder={editable ? conf.placeholder : ""}
        controlled
      /> */}
      <NewPicker
        visible={visible}
        value={data}
        onCancel={() => setVisible(false)}
        onOk={(v, labelText) => {
          setFormValues({
            [conf.valueId]: v,
          });
          setLabelText(labelText);
          // conf.onChange && conf.onChange({ dataSource, value: v, ...props });
          setTimeout(() => {
            setVisible(false);
          }, 10);
        }}
        data={dataSource}
        // onChange={(v) => conf.onChange({ value: v, ...props })}
      />
    </FormItem>
  );
};
export default SelectItem;
