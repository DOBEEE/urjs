import { createElement, FC, useState, useEffect } from "rax";
import { List } from "@alifd/meet";
import Switch from "@/Agro-Mobile/switch/src";
import { checkCb, submitCheckCb } from "../../hooks";

const SwitchItem: FC<any> = (props) => {
  const { conf, data, formValues, setFormValues, checkRequired } = props;
  const readOnly = conf.readOnly || props.readOnly;
  const [errorText, setErrorText] = useState("");
  checkCb(props, setErrorText);
  submitCheckCb(props, setErrorText);
  return (
    <List>
      <List.Item
        required={conf.required}
        errorText={!readOnly ? errorText : ""}
        onClick={() => {
          if (readOnly || !conf.clickHandler) return;
          conf.clickHandler(conf, data);
        }}
      >
        <List.ItemLabel>
          {conf.label + (conf.required ? "*" : "")}
        </List.ItemLabel>
        <List.ItemAction>
          <Switch
            checked={data}
            onChange={(v) => {
              setFormValues({
                [conf.valueId]: v,
              });
              // conf.onChange && conf.onChange({ value: v, ...props });
            }}
            disabled={readOnly}
          />
        </List.ItemAction>
      </List.Item>
    </List>
  );
};
export default SwitchItem;
