import {
  createElement,
  FC,
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "rax";
import { useStore, throttle } from "@/utils";
import { Icon, Form } from "@alifd/meet";
import View from "rax-view";
import Text from "rax-text";
import FormContent from "./FormContent";
import cloneElement from "rax-clone-element";
import Children from "rax-children";
import useForm from "./useForm";
import "./index.less";

const Index: FC<any> = function ({
  confList,
  // data = {},
  initialValues = {},
  // onChange = () => {},
  readOnly = false,
  title,
  checkRequired = false,
  children,
  // formInstance,
  form,
  ...rest
}) {
  // const [formValues, setFormValues] = useStore({
  //   ...initialValues,
  //   // ...formInstance.getValues(),
  // });
  const [formInstance] = useForm(form);
  const [confListPr, setConfListPr] = useState(confList);
  const [checkSign, setCheckSign] = useState(0);
  // useEffect(() => {
  //   console.log(555);
  //   setFormValues((state) => {
  //     return {
  //       ...state,
  //       ...formInstance.getValues(),
  //     };
  //   });
  // });
  // const formInstance = form;
  // console.log(formInstance?.getItems());
  useMemo(() => {
    formInstance.setStoreByConf(confListPr, { ...initialValues });
  }, [formInstance, confListPr]);
  // useEffect(() => {
  //   if (JSON.stringify(data) === JSON.stringify(formValues)) {
  //     return;
  //   }
  //   setFormValues(data);
  // }, [data]);
  useEffect(() => {
    console.log("confList", confList);
    setConfListPr(confList);
  }, [confList]);
  // setInitialStore();
  const styleChildren = useMemo(() => {
    const _run = (children) => {
      return Children.map(children, (child, idx) => {
        // console.log("-child", child);
        if (child?.props?.formType === "submit") {
          return cloneElement(child, {
            ...child.props,
            key: idx,
            onClick: throttle((e) => {
              formInstance.startCheckAll();
              setCheckSign((i) => i + 1);
              child.props.onClick && child.props.onClick(e);
            }, 1000),
          });
        }
        if (
          Array.isArray(child?.props?.children) ||
          child?.props?.children?.props
        ) {
          return cloneElement(child, {
            ...child.props,
            key: idx,
            children: _run(child.props.children),
          });
        } else {
          return child;
        }
      });
    };
    return _run(children);
  }, [children, formInstance]);

  return (
    <View>
      <Form
        styles={{
          "form__sub-header": {
            fontSize: "26rpx",
            color: "#888888",
            marginTop: 0,
            padding: "24rpx 0 13rpx 24rpx",
            marginBottom: "-24rpx",
            background: "#F8F8F8",
          },
          "form__item-label": {
            color: "#333",
          },
        }}
        labelType="upper"
      >
        {title ? <Form.SubHeader>{title}</Form.SubHeader> : null}
        {confListPr?.[0]?.[0] ? (
          confListPr.map((list, idx) => {
            if (!list || list.filter((i) => !i.hidden).length == 0) {
              return null;
            }
            return (
              <FormContent
                {...rest}
                key={idx}
                formInstance={formInstance}
                confList={list}
                checkSign={checkSign}
                readOnly={readOnly}
                // setFormValues={setFormValues}
                // data={formValues}
                // setFormValues={(value) => onChange({ ...data, ...value })}
                data={formInstance?.getValues() || {}}
                setConfList={(newConfList) =>
                  setConfListPr((co) => {
                    co[idx] = newConfList;
                    return [...co];
                  })
                }
              />
            );
          })
        ) : (
          <FormContent
            {...rest}
            x-if={confList.length > 0}
            formInstance={formInstance}
            confList={confList}
            checkSign={checkSign}
            readOnly={readOnly}
            data={formInstance?.getValues() || {}}
            // data={data}
            // setFormValues={(value) => onChange({ ...data, ...value })}
            // setFormValues={setFormValues}
            // data={formValues}
            setConfList={setConfListPr}
          />
        )}
        <FormContent />
      </Form>
      {styleChildren}
    </View>
  );
};
export { useForm };
export default memo(Index);
