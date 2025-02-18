import React, { useContext } from 'react';
import { ConfigProvider as AntdConfigProvider } from 'antd';

import { noteOnce } from 'rc-util/lib/warning';

import arEG from './locale/ar_EG';
import zhCN from './locale/zh_CN';
import enUS from './locale/en_US';
import viVN from './locale/vi_VN';
import itIT from './locale/it_IT';
import esES from './locale/es_ES';
import jaJP from './locale/ja_JP';
import ruRU from './locale/ru_RU';
import msMY from './locale/ms_MY';
import zhTW from './locale/zh_TW';
import frFR from './locale/fr_FR';
import ptBR from './locale/pt_BR';
import koKR from './locale/ko_KR';
import idID from './locale/id_ID';
import deDE from './locale/de_DE';

export type ProSchemaValueEnumType = {
  /**
   * @name 演示的文案
   */
  text: React.ReactNode;

  /**
   * @name 预定的颜色
   */
  status: string;
  /**
   * @name 自定义的颜色
   */
  color?: string;
  /**
   * @name 是否禁用
   */
  disabled?: boolean;
};

/**
 * @name ValueEnum 的类型
 * @description 支持 Map 和 Object
 */
export type ProSchemaValueEnumMap = Map<React.ReactText, ProSchemaValueEnumType | React.ReactNode>;

export type ProSchemaValueEnumObj = Record<string, ProSchemaValueEnumType | React.ReactNode>;

export type BaseProFieldFC = {
  /**
   * 值的类型
   */
  text: React.ReactNode;

  fieldProps?: any;
  /**
   * 模式类型
   */
  mode: ProFieldFCMode;
  /**
   * 简约模式
   */
  plain?: boolean;
  /**
   * 轻量模式
   */
  light?: boolean;
  /**
   * label
   */
  label?: React.ReactNode;
  /**
   * 映射值的类型
   */
  valueEnum?: ProSchemaValueEnumObj | ProSchemaValueEnumMap;

  proFieldKey?: React.Key;
};

export type ProFieldFCMode = 'read' | 'edit' | 'update';

/**
 * render 第二个参数，里面包含了一些常用的参数
 */
export type ProFieldFCRenderProps = {
  mode?: ProFieldFCMode;
  placeholder?: string | string[];
  value?: any;
  onChange?: (...rest: any[]) => void;
} & BaseProFieldFC;

export type ProRenderFieldPropsType = {
  render?:
    | ((
        text: any,
        props: Omit<ProFieldFCRenderProps, 'value' | 'onChange'>,
        dom: JSX.Element,
      ) => JSX.Element)
    | undefined;
  renderFormItem?:
    | ((text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => JSX.Element)
    | undefined;
};

export type IntlType = {
  locale: string;
  getMessage: (id: string, defaultMessage: string) => string;
};

function get(
  source: Record<string, unknown>,
  path: string,
  defaultValue?: string,
): string | undefined {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  let message = defaultValue;
  // eslint-disable-next-line no-restricted-syntax
  for (const p of paths) {
    message = Object(result)[p];
    result = Object(result)[p];
    if (message === undefined) {
      return defaultValue;
    }
  }
  return message;
}

/**
 * 创建一个操作函数
 * @param locale
 * @param localeMap
 */
const createIntl = (locale: string, localeMap: Record<string, any>): IntlType => ({
  getMessage: (id: string, defaultMessage: string) =>
    get(localeMap, id, defaultMessage) || defaultMessage,
  locale,
});

const arEGIntl = createIntl('ar_EG', arEG);
const zhCNIntl = createIntl('zh_CN', zhCN);
const enUSIntl = createIntl('en_US', enUS);
const viVNIntl = createIntl('vi_VN', viVN);
const itITIntl = createIntl('it_IT', itIT);
const jaJPIntl = createIntl('ja_JP', jaJP);
const esESIntl = createIntl('es_ES', esES);
const ruRUIntl = createIntl('ru_RU', ruRU);
const msMYIntl = createIntl('ms_MY', msMY);
const zhTWIntl = createIntl('zh_TW', zhTW);
const frFRIntl = createIntl('fr_FR', frFR);
const ptBRIntl = createIntl('pt_BR', ptBR);
const koKRIntl = createIntl('ko_KR', koKR);
const idIDIntl = createIntl('id_ID', idID);
const deDEIntl = createIntl('de_DE', deDE);

const intlMap = {
  'ar-EG': arEGIntl,
  'zh-CN': zhCNIntl,
  'en-US': enUSIntl,
  'vi-VN': viVNIntl,
  'it-IT': itITIntl,
  'ja-JP': jaJPIntl,
  'es-ES': esESIntl,
  'ru-RU': ruRUIntl,
  'ms-MY': msMYIntl,
  'zh-TW': zhTWIntl,
  'fr-FR': frFRIntl,
  'pt-BR': ptBRIntl,
  'ko-KR': koKRIntl,
  'id-ID': idIDIntl,
  'de-DE': deDEIntl,
};

const intlMapKeys = Object.keys(intlMap);

export type ParamsType = Record<string, any>;

export {
  arEGIntl,
  enUSIntl,
  zhCNIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
  zhTWIntl,
  frFRIntl,
  ptBRIntl,
  koKRIntl,
  idIDIntl,
  deDEIntl,
  intlMap,
  intlMapKeys,
};

export type ConfigContextPropsType = {
  intl: IntlType;
  valueTypeMap: Record<string, ProRenderFieldPropsType>;
};

const ConfigContext = React.createContext<ConfigContextPropsType>({
  intl: {
    ...zhCNIntl,
    locale: 'default',
  },
  valueTypeMap: {},
});

const { Consumer: ConfigConsumer, Provider: ConfigProvider } = ConfigContext;

/**
 * 根据 antd 的 key 来找到的 locale 插件的 key
 * @param localeKey
 */
const findIntlKeyByAntdLocaleKey = (localeKey: string | undefined) => {
  if (!localeKey) {
    return 'zh-CN';
  }
  const localeName = localeKey.toLocaleLowerCase();
  return (
    intlMapKeys.find((intlKey) => {
      const LowerCaseKey = intlKey.toLocaleLowerCase();
      return LowerCaseKey.includes(localeName);
    }) || 'zh-CN'
  );
};

/**
 *  如果没有配置 locale，这里组件会根据 antd 的 key 来自动选择
 * @param param0
 */
const ConfigProviderWrap: React.FC<Record<string, unknown>> = ({ children }) => {
  const { locale } = useContext(AntdConfigProvider.ConfigContext);
  return (
    <ConfigConsumer>
      {(value) => {
        const localeName = locale?.locale;
        const key = findIntlKeyByAntdLocaleKey(localeName);
        // antd 的 key 存在的时候以 antd 的为主
        const intl =
          localeName && value.intl?.locale === 'default'
            ? intlMap[key]
            : value.intl || intlMap[key];
        return (
          <ConfigProvider
            value={{
              ...value,
              intl: intl || zhCNIntl,
            }}
          >
            {children}
          </ConfigProvider>
        );
      }}
    </ConfigConsumer>
  );
};

export { ConfigConsumer, ConfigProvider, ConfigProviderWrap, createIntl };

export function useIntl(): IntlType {
  const context = useContext(ConfigContext);
  noteOnce(
    !!context.intl,
    `
为了提升兼容性  
<IntlProvider value={zhCNIntl}/>
需要修改为:
<ConfigProvider
  value={{
    intl: zhCNIntl,
  }}
/>
我们将会在下个版本中删除它
    `,
  );

  noteOnce(
    !!context.intl,
    `
To improve compatibility
  <IntlProvider value={zhCNIntl}/>
Need to be modified to:
  <ConfigProvider
    value={{
      intl: zhCNIntl,
    }}
  />
We will remove it in the next version
    `,
  );

  if (!context.intl) {
    return ((context as unknown) as IntlType) || zhCNIntl;
  }
  return context.intl || zhCNIntl;
}

export default ConfigContext;
