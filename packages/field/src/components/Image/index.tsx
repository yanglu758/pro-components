import React from 'react';
import { Image, Input } from 'antd';
import type { ProFieldFC } from '../../index';

export type FieldImageProps = {
  text: string;
  width?: number;
};

/**
 * 数字组件
 * @param FieldImageProps
 * {
 *    text: number;
 *    moneySymbol?: string;
 * }
 */
const FieldImage: ProFieldFC<FieldImageProps> = ({
  text,
  mode: type,
  render,
  renderFormItem,
  fieldProps,
  width,
  plain,
  ...rest
}) => {
  if (type === 'read') {
    const dom = <Image width={width || 32} src={text} />;
    if (render) {
      return render(text, { mode: type, ...fieldProps }, dom);
    }
    return dom;
  }
  if (type === 'edit' || type === 'update') {
    const dom = <Input {...rest} {...fieldProps} />;
    if (renderFormItem) {
      return renderFormItem(text, { mode: type, ...fieldProps }, dom);
    }
    return dom;
  }
  return null;
};

export default FieldImage;
