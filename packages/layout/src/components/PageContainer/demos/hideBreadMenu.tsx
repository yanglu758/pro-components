/**
 * uuid: a4621ef5
 * title: 隐藏面包屑
 * desc: 不配置 `header` 属性中的 `breadcrumb` 即可。
 */
import React from 'react';
import { Descriptions } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';

export default () => (
  <div
    style={{
      overflowX: 'hidden',
      height: 400,
    }}
  >
    <PageContainer
      ghost
      header={{
        title: '页面标题',
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="创建人">曲丽丽</Descriptions.Item>
          <Descriptions.Item label="关联表单">
            <a>421421</a>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
          <Descriptions.Item label="单据备注">浙江省杭州市西湖区工专路</Descriptions.Item>
        </Descriptions>
      }
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard style={{ height: 200 }} />
        <ProCard gutter={16} ghost style={{ height: 200 }}>
          <ProCard colSpan={16} />
          <ProCard colSpan={8} />
        </ProCard>
      </ProCard>
    </PageContainer>
  </div>
);
