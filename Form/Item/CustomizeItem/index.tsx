import { createElement, FC, useState, useEffect } from "rax";
import { List } from "@alifd/meet";
import Text from "rax-text";
import View from "rax-view";
import { checkCb, submitCheckCb } from "../../hooks";
import { isNone } from "@/utils";
import FormItem from "../FormItem";

const CustomizeItem: FC<any> = (props) => {
  const { conf, data, formValues, setFormValues } = props;
  const readOnly = conf.readOnly || props.readOnly;

  return (
    <View>
      <FormItem
        {...props}
        needContainer={isNone(data)}
        readOnly={readOnly}
        label={conf.label}
        required={conf.required}
        tapable={!readOnly && conf.showArrow}
        onClick={() => {
          if (readOnly || !conf.clickHandler) return;
          conf.clickHandler({ ...props });
        }}
      />
      <List x-if={!isNone(data)}>
        <List.Item
          onClick={() => {
            if (readOnly || !conf.clickHandler) return;
            conf.clickHandler({ ...props });
          }}
        >
          <List.ItemContent>
            <List.ItemLabel>{data.label}</List.ItemLabel>
            <List.ItemCaption>{data.caption}</List.ItemCaption>
          </List.ItemContent>
          <List.ItemAction
            x-if={!readOnly && conf.showArrow}
            icon="arrow-right"
          />
        </List.Item>
      </List>
    </View>
  );
};
export default CustomizeItem;
