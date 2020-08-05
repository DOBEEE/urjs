import { createElement, FC, useRef, useState, useEffect } from "rax";
import { isNone } from "@/utils";

interface ItemStore {
  value: any;
  checkStatus: boolean;
  rules: any[];
  errorText: string;
  status: "hidden" | "readOnly" | "normal";
}
interface Store {
  [index: string]: ItemStore;
}
interface FormInstance {
  getAllCheckRes: () => boolean;
  getItems: () => Store;
  getItem: (id) => ItemStore;
  setItem: (id, value) => void;
  getItemValue: (id) => any;
  setItemValue: (id, value, conf) => void;
  getItemCheck: (id) => boolean;
  setItemCheck: (id, value, conf) => void;
  getValues: () => any;
  setValues: (values: any) => void;
  startCheckItem: (id) => void;
  startCheckAll: () => void;
  setItemByConf: (id, value, conf) => void;
  setStoreByConf: (conf, data) => void;
  forceRootUpdate: () => void;
  setItemStatus: (id, value) => void;
  setItemValueRefresh: (id, value) => void;
}
class FormStore {
  private forceRootUpdate: () => void;
  private confList: any;
  private initialValues: Store = {};
  private store: Store = {};
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(forceRootUpdate: () => void) {
    // this.confList = confList;
    this.forceRootUpdate = forceRootUpdate;
  }
  public getForm = (): FormInstance => ({
    forceRootUpdate: this.forceRootUpdate,
    getAllCheckRes: this.getAllCheckRes,
    getItems: this.getItems,
    getItem: this.getItem,
    setItem: this.setItem,
    getItemValue: this.getItemValue,
    setItemValue: this.setItemValue,
    getItemCheck: this.getItemCheck,
    setItemCheck: this.setItemCheck,
    getValues: this.getValues,
    setValues: this.setValues,
    startCheckItem: this.startCheckItem,
    startCheckAll: this.startCheckAll,
    setItemByConf: this.setItemByConf,
    setStoreByConf: this.setStoreByConf,
    setItemStatus: this.setItemStatus,
    setItemValueRefresh: this.setItemValueRefresh,
    // setFields: this.setFields,
    // setFieldsValue: this.setFieldsValue,
    // validateFields: this.validateFields,

    // getInternalHooks: this.getInternalHooks,
  });
  // private notifyObservers = (
  //   prevStore: Store,
  //   namePathList: InternalNamePath[] | null,
  //   info: NotifyInfo,
  // ) => {
  //   if (this.subscribable) {
  //     const mergedInfo: ValuedNotifyInfo = {
  //       ...info,
  //       store: this.getItems(),
  //     };
  //     this.getFieldEntities().forEach(({ onStoreChange }) => {
  //       onStoreChange(prevStore, namePathList, mergedInfo);
  //     });
  //   } else {
  //     this.forceRootUpdate();
  //   }
  // };
  private startCheckItem = (id) => {
    if (!this.store[id]) {
      return;
    }
    if (this.store[id].rules && this.store[id].rules.length > 0) {
      this.store[id].rules.some((rule) => {
        if (!rule.handle(this.store[id].value)) {
          this.store[id].checkStatus = false;
          this.store[id].errorText = rule.message;
          return true;
        } else {
          this.store[id].checkStatus = true;
          this.store[id].errorText = "";
        }
      });
    }
  };
  private startCheckAll = () => {
    Object.entries(this.store).forEach(([key, value]) => {
      if (value.status !== "normal") {
        return;
      }
      if (value.rules && value.rules.length > 0) {
        value.rules.some((rule) => {
          if (!rule.handle(value.value)) {
            this.store[key].checkStatus = false;
            this.store[key].errorText = rule.message;
            return true;
          } else {
            this.store[key].checkStatus = true;
            this.store[key].errorText = "";
          }
        });
      }
    });
  };
  private getAllCheckRes = () => {
    let res = true;
    Object.entries(this.store).forEach(([key, value]) => {
      if (value.status !== "normal") {
        return;
      }
      if (!value.checkStatus) {
        res = false;
      }
    });
    return res;
  };
  private getValues = () => {
    let res = {};
    Object.entries(this.store).forEach(([key, value]: [string, ItemStore]) => {
      if (value.status == "hidden") {
        return;
      }
      res[key] = value ? value.value : value;
    });
    return res;
  };
  private getItems = () => {
    return this.store;
  };
  private getItem = (id) => {
    return this.store[id];
  };
  private setItem = (id, value) => {
    // const prevStore = this.store;
    this.store[id] = value;
    // this.notifyObservers(prevStore, null, {
    //   type: 'valueUpdate',
    //   source: 'external',
    // });
  };
  private setStoreByConf = (confList, data) => {
    let store = {};
    // console.log("--store", store);
    confList
      // .filter((i) => i.type !== "slot")
      .forEach((item, index) => {
        if (Array.isArray(item)) {
          item
            // .filter((i) => i.type !== "slot")
            .forEach((it, idx) => {
              store[it.id || it.valueId] = this.setItemByConf(
                it.id || it.valueId,
                data[it.id || it.valueId] || "",
                it
              );
            });
        } else {
          store[item.id || item.valueId] = this.setItemByConf(
            item.id || item.valueId,
            data[item.id || item.valueId] || "",
            item
          );
        }
      });
    this.store = store;
  };
  private setItemStatus = (id, status) => {
    if (!this.store[id]) {
      return;
    }
    this.store[id].status = status;
  };
  private setItemByConf = (id, value, conf, hard?) => {
    let res = {
      value: "",
      checkStatus: true,
      rules: [],
      errorText: "",
      status: "normal",
    };
    let rules = conf.rules || [];
    if (conf.required) {
      rules = [
        {
          message: conf.requiredMessage || "这里不能为空",
          handle: (value) => {
            return !isNone(value);
          },
        },
        ...rules,
      ];
    }
    if (this.store[id]) {
      res = {
        ...this.store[id],
        status: "",
        // status:
        //   !hard && this.store[id].status && this.store[id].status !== "normal"
        //     ? ""
        //     : conf.hidden
        //       ? "hidden"
        //       : conf.readOnly
        //         ? "readOnly"
        //         : "normal",
        rules: rules,
      };
      // hidden目前设计
      if (!hard) {
        if (this.store[id].status) {
          res.status = this.store[id].status;
        } else {
          res.status = conf.hidden
            ? "hidden"
            : conf.readOnly || conf.type == "slot"
            ? "readOnly"
            : "normal";
        }
        // res.status = conf.hidden
        // ? "hidden"
        // : conf.readOnly
        //   ? "readOnly"
        //   : "normal";
      } else {
        // 对于setConf触发的conf改变，需要覆盖原有状态
        res.status = conf.hidden
          ? "hidden"
          : conf.readOnly || conf.type == "slot"
          ? "readOnly"
          : "normal";
      }
    } else {
      res = {
        value,
        checkStatus: true,
        rules: rules,
        errorText: "",
        status: conf.hidden
          ? "hidden"
          : conf.readOnly || conf.type == "slot"
          ? "readOnly"
          : "normal",
      };
    }

    if (hard) {
      this.store[id] = res;
    } else {
      return res;
    }
  };
  private getItemValue = (id) => {
    return this.store[id]?.value;
  };
  private setItemValueRefresh = (id, value) => {
    if (this.store[id]) {
      this.store[id].value = value;
      this.forceRootUpdate();
    }
  };
  private setItemValue = (id, value, conf?) => {
    if (this.store[id]) {
      this.store[id].value = value;
    } else {
      this.store[id] = {
        value: value,
        checkStatus: true,
        rules: conf.rules || [],
        errorText: "",
        status: conf.hidden ? "hidden" : conf.readOnly ? "readOnly" : "normal",
      };
    }
  };
  private getItemCheck = (id) => {
    return this.store[id].checkStatus;
  };
  private setItemCheck = (id, value, conf) => {
    if (this.store[id]) {
      this.store[id].checkStatus = value;
    }
  };
  private setValues = (values) => {
    Object.entries(values).forEach(([key, value]) => {
      this.setItemValue(key, value, {});
    });
    // this.store = { ...this.store, ...values };
    this.forceRootUpdate();
  };
}
const useForm = (form?: FormInstance): [FormInstance] => {
  const [, forceUpdate] = useState();
  const forceReRender = () => {
    forceUpdate({});
  };
  const ref = useRef<FormInstance>(new FormStore(forceReRender).getForm());

  if (form) {
    ref.current = form;
  } else {
    // const forceReRender = () => {
    //   forceUpdate({});
    // };
    // const formStore: FormStore = new FormStore(forceReRender);
    // ref.current = formStore.getForm();
  }
  return [ref.current];
};

export default useForm;
