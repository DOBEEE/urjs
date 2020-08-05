import { createElement, FC, useRef, useEffect, useCallback } from "rax";

export const submitCheckCb = (props, setErrorText) => {
  const { data, conf, formInstance, checkSign, readOnly } = props;
  useEffect(() => {
    if (readOnly || checkSign === 0) {
      return;
    }
    setErrorText(formInstance.getItem(conf.id || conf.valueId)?.errorText);
  }, [checkSign, formInstance]);
};
export const checkCb = (props, setErrorText) => {
  const { data, conf, formInstance, checkSign, readOnly } = props;
  const dataRef = useRef(data);

  useEffect(() => {
    if (readOnly) {
      return;
    }

    if (JSON.stringify(dataRef.current) == JSON.stringify(data)) {
      return;
    }
    dataRef.current = data;
    conf.onChange &&
      conf.onChange({
        value: data,
        ...props,
      });
    // formInstance.setItemValue(conf.id || conf.valueId, data, conf);
    formInstance.startCheckItem(conf.id || conf.valueId);
    setErrorText(formInstance.getItem(conf.id || conf.valueId).errorText);
  }, [data, formInstance]);
};
