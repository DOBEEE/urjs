import { createElement, FC, useState, useEffect } from "rax";
import { List } from "@alifd/meet";
import Text from "rax-text";
import View from "rax-view";
import { checkCb, submitCheckCb } from "../../hooks";
import { isNone } from "@/utils";
import cloneElement from "rax-clone-element";
import Children from "rax-children";
import "./index.less";

const CustomizeItem: FC<any> = (props) => {
  const {
    tapable,
    prefix = "argo-",
    children,
    label,
    required,
    onClick,
    readOnly,
    helpText,
    needContainer = true,
    style = {},
  } = props;
  // const readOnly = conf.readOnly || props.readOnly;
  const [errorText, setErrorText] = useState("");
  checkCb(props, setErrorText);
  submitCheckCb(props, setErrorText);
  const _prefix = prefix + "form-item";
  return (
    <View className={`${_prefix}`} style={style}>
      {needContainer ? null : children}
      <View
        x-if={needContainer}
        className={`${_prefix}-container`}
        onClick={(e) => {
          if (readOnly) {
            return;
          }
          onClick && onClick(e);
        }}
      >
        <View className={`${_prefix}-left-side`}>
          <div className={`${_prefix}-label`}>
            <Text
              x-if={label}
              className={
                readOnly
                  ? `${_prefix}-label-text ${_prefix}-label-text-readOnly`
                  : `${_prefix}-label-text`
              }
            >
              {label}
            </Text>
            <div x-if={!readOnly && required} className={`${_prefix}-required`}>
              *
            </div>
          </div>
          <div x-if={!isNone(children)} className={`${_prefix}-content`}>
            {/* {Children.map(children, (child, idx) => {
              return cloneElement(child, {
                ...child.props,
                key: idx,
              });
            })} */}
            {children}
          </div>
        </View>
        <View x-if={tapable} className={`${_prefix}-right-side`}>
          <i className={"icon iconfont arrow-right"}>&#xe60b;</i>
        </View>
      </View>

      <Text
        x-if={needContainer && !readOnly && errorText}
        className={`${_prefix}-alert`}
      >
        {errorText}
      </Text>
      <Text
        x-if={needContainer && helpText}
        className={`${_prefix}-help`}
      >
        {helpText}
      </Text>
      <View
        x-if={needContainer && (readOnly || !errorText)}
        className={`${_prefix}-container-border-wrapper`}
      >
        <View className={`${_prefix}-container-border`} />
      </View>
    </View>
  );
};
export default CustomizeItem;
