﻿import React, { useContext, useEffect, useMemo, useImperativeHandle, useRef } from 'react';
import { ConfigProvider, Drawer } from 'antd';
import type { FormInstance, FormProps } from 'antd/lib/form';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { DrawerProps } from 'antd/lib/drawer';
import type { Store } from 'antd/lib/form/interface';
import { createPortal } from 'react-dom';
import omit from 'omit.js';

import type { CommonFormProps } from '../../BaseForm';
import BaseForm from '../../BaseForm';
import { noteOnce } from 'rc-util/lib/warning';

export type DrawerFormProps = Omit<FormProps, 'onFinish'> &
  CommonFormProps & {
    /**
     * @name 表单结束后调用
     * @description  接受返回一个boolean，返回 true 会关掉这个抽屉
     */
    onFinish?: (formData: Store) => Promise<boolean | void>;

    /**
     * @name 用于触发抽屉打开的 dom
     */
    trigger?: JSX.Element;

    /**
     * @name 受控的打开关闭
     */
    visible?: DrawerProps['visible'];

    /**
     * @name 打开关闭的事件
     */
    onVisibleChange?: (visible: boolean) => void;
    /**
     * @name 抽屉的属性
     * @description 不支持 'visible'，请使用全局的 visible
     */
    drawerProps?: Omit<DrawerProps, 'visible'>;

    /**
     * @name 抽屉的标题
     */
    title?: DrawerProps['title'];

    /**
     * @name 抽屉的宽度
     */
    width?: DrawerProps['width'];
  };

const DrawerForm: React.FC<DrawerFormProps> = ({
  children,
  trigger,
  onVisibleChange,
  drawerProps,
  onFinish,
  title,
  width,
  ...rest
}) => {
  const [visible, setVisible] = useMergedState<boolean>(!!rest.visible, {
    value: rest.visible,
    onChange: onVisibleChange,
  });

  noteOnce(
    // eslint-disable-next-line @typescript-eslint/dot-notation
    !rest['footer'] || !drawerProps?.footer,
    'DrawerForm 是一个 ProForm 的特殊布局，如果想自定义按钮，请使用 submit.render 自定义。',
  );

  /** 设置 trigger 的情况下，懒渲染优化性能；使之可以直接配合表格操作等场景使用 */
  const isFirstRender = useRef(!drawerProps?.forceRender);

  /**
   * isFirstRender.current 或者 visible 为 true 的时候就渲染
   * 不渲染能会造成一些问题,比如再次打开值不对了
   * 只有手动配置 drawerProps?.destroyOnClose 为 true 的时候才会每次关闭的时候删除 dom
   */
  const shouldRenderFormItems = useMemo(() => {
    if (isFirstRender.current && visible === false) {
      return false;
    }
    if (visible === false && drawerProps?.destroyOnClose) {
      return false;
    }
    return true;
  }, [visible, drawerProps?.destroyOnClose]);
  /**
   * 同步 props 和 本地
   */
  const formRef = useRef<FormInstance>();
  const context = useContext(ConfigProvider.ConfigContext);

  /**
   * 如果 destroyOnClose ，重置一下表单
   */
  useEffect(() => {
    if (visible) {
      isFirstRender.current = false;
    }
    if (!visible && drawerProps?.destroyOnClose) {
      formRef.current?.resetFields();
    }
  }, [drawerProps?.destroyOnClose, visible]);

  useImperativeHandle(rest.formRef, () => formRef.current, [formRef.current]);

  /**
   * 不放到 body 上会导致 z-index 的问题
   * 遮罩什么的都遮不住了
   */
  return (
    <>
      {createPortal(
        <div>
          <BaseForm
            layout="vertical"
            {...omit(rest, ['visible'])}
            formRef={formRef}
            submitter={{
              searchConfig: {
                submitText: '确认',
                resetText: '取消',
              },
              resetButtonProps: {
                onClick: (e: any) => {
                  setVisible(false);
                  drawerProps?.onClose?.(e);
                },
              },
              ...rest.submitter,
            }}
            onFinish={async (values) => {
              if (!onFinish) {
                return;
              }
              const success = await onFinish(values);
              if (success) {
                formRef.current?.resetFields();
                setVisible(false);
              }
            }}
            contentRender={(item, submitter) => {
              return (
                <Drawer
                  title={title}
                  getContainer={false}
                  width={width || 800}
                  {...drawerProps}
                  visible={visible}
                  onClose={(e) => {
                    setVisible(false);
                    drawerProps?.onClose?.(e);
                  }}
                  footer={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {submitter}
                    </div>
                  }
                >
                  {shouldRenderFormItems ? item : null}
                </Drawer>
              );
            }}
          >
            {children}
          </BaseForm>
        </div>,
        context?.getPopupContainer?.(document.body) || document.body,
      )}
      {trigger &&
        React.cloneElement(trigger, {
          ...trigger.props,
          onClick: (e: any) => {
            setVisible(!visible);
            trigger.props?.onClick?.(e);
          },
        })}
    </>
  );
};

export default DrawerForm;
