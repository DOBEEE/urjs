import { createElement, FC, useState, useEffect, useCallback } from "rax";
import { useStore } from "@/utils";
import { Icon, Form } from "@alifd/meet";
import View from "rax-view";
import Text from "rax-text";
import UploadItem from "./Item/UploadItem";
import InputItem from "./Item/InputItem";
import CustomizeItem from "./Item/CustomizeItem";
import DatePickerItem from "./Item/DatePickerItem";
import SelectItem from "./Item/SelectItem";
import SwitchItem from "./Item/SwitchItem";
import TapItem from "@components/Form/Item/TapItem";

import "./index.less";

const Items = {
  upload: UploadItem,
  input: InputItem,
  customize: CustomizeItem,
  datePicker: DatePickerItem,
  select: SelectItem,
  switch: SwitchItem,
  tap: TapItem,
};
const Index: FC<any> = function ({
  confList,
  data,
  // onChange,
  formInstance,
  readOnly = false,
  // setFormValues,
  setConfList,
  // title,
  checkSign,
  ...rest
}) {
  const changeValue = useCallback(
    (values) => {
      // setFormValues({ ...values });
      Object.entries(values).forEach(([key, item]) => {
        formInstance.setItemValueRefresh(key, item);
      });
    },
    [formInstance]
  );
  // const data = formInstance?.getValues() || {};
  // console.log("...data", data);
  // useEffect(() => {
  //   console.log(formInstance?.getItems());
  // }, [data]);
  return (
    <View
      style={{ backgroundColor: "#fff", marginTop: 24 }}
      x-if={confList && confList.length > 0}
    >
      {confList
        .filter((i) => {
          return (
            i.type === "slot" ||
            formInstance.getItem(i.valueId).status !== "hidden"
          );
        })
        .map((conf, idx) => {
          if (conf.type === "slot") {
            return (
              <conf.component key={idx} data={data[conf.valueId]} conf={conf} />
            );
          }
          const Component = Items[conf.type];
          return (
            <Component
              {...rest}
              key={conf.valueId + idx}
              x-if={
                ((conf.readOnly || readOnly) && data[conf.valueId]) ||
                !(conf.readOnly || readOnly)
              }
              setConf={(id, val) =>
                setConfList(
                  confList.map((item) => {
                    if (item.id === id) {
                      formInstance.setItemByConf(
                        id,
                        data[conf.valueId],
                        {
                          ...item,
                          ...val,
                        },
                        true
                      );
                      // formInstance.forceRootUpdate();
                      return {
                        ...item,
                        ...val,
                      };
                    }
                    return item;
                  })
                )
              }
              formInstance={formInstance}
              setCheckStatus={formInstance.setItemCheck}
              checkSign={checkSign}
              conf={conf}
              readOnly={readOnly}
              data={data[conf.valueId]}
              formValues={data}
              setFormValues={changeValue}
            />
          );
        })}
    </View>
  );
};
export default Index;
