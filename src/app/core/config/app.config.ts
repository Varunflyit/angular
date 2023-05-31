import { Layout } from 'app/layout/layout.types';
import { environment } from 'environments/environment';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];

// // ApiConfig
// const devApiConfig: ApiConfig = {
//   baseUrl: 'https://api.pre-prod.ecommify.io/v1',
//   serviceUrl: 'https://service.pre-prod.ecommify.io',
//   serviceUrlv1: 'https://service.pre-prod.ecommify.io/api/v1',
//   //   baseUrl: 'v1',
// };

// const prodApiConfig: ApiConfig = {
//   baseUrl: 'https://api.ecommify.io/v1',
//   serviceUrl: 'https://service.pre-prod.ecommify.io',
//   serviceUrlv1: 'https://service.pre-prod.ecommify.io/api/v1',
// };
const envConfig: ApiConfig = {
    baseUrl: environment.API_ENDPOINT,
    serviceUrl: environment.API_SERVICE_ENDPOINT,
    serviceUrlv1: environment.API_SERVICE_ENDPOINT,
};

const getApiConfig = (): ApiConfig => envConfig;
//  environment.production ? prodApiConfig : devApiConfig;

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig {
    layout: Layout;
    scheme: Scheme;
    screens: Screens;
    theme: Theme;
    themes: Themes;
    apiConfig: ApiConfig;
}

export interface ApiConfig {
    baseUrl: string;
    serviceUrl: string;
    serviceUrlv1: string;
}
/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 *
 * "Screens" are carried over to the BreakpointObserver for accessing them within
 * components, and they are required.
 *
 * "Themes" are required for Tailwind to generate themes.
 */
export const appConfig: AppConfig = {
    layout: 'modern',
    scheme: 'light',
    screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1440px',
    },
    theme: 'theme-default',
    themes: [
        {
            id: 'theme-default',
            name: 'Default',
        },
        {
            id: 'theme-brand',
            name: 'Brand',
        },
        {
            id: 'theme-teal',
            name: 'Teal',
        },
        {
            id: 'theme-rose',
            name: 'Rose',
        },
        {
            id: 'theme-purple',
            name: 'Purple',
        },
        {
            id: 'theme-amber',
            name: 'Amber',
        },
    ],
    apiConfig: getApiConfig(),
};


export const UserSettingsTypes = {
    product_view: 'Product View'
}

export const unsaved_table_view = 'Unsaved View'


export const ProductAttributeTypes = {
    short_text: "text",
    paragraph: "paragraph",
    html: "html",
    integer: "integer",
    decimal: "decimal",
    dropdown: "dropdown",
    multiselect: "multiselect",
    date: "date",
    url: "url",
    boolean: "boolean",
    media_single: "media_single",
    media_gallery: "media_gallery",
    completeness: "completeness",
}


export const Attribute_Types = {
    userDefined: 'user-defined',
    integration: 'integration',
    system: 'system'
}


export const OperatorOptions: Array<any> = [
    { value: 'eq', label: 'equal to' },
    { value: '!eq', label: 'not equal to' },
    { value: 'like', label: 'contains' },
    { value: '!like', label: 'dosent contains' },
    { value: 'lt', label: 'less then' },
    { value: 'lte', label: 'less then or equal to' },
    { value: 'gt', label: 'greater then' },
    { value: 'gte', label: 'greater then or equal to' },
];

export const CharacterOperatorOptions: Array<any> = [
    { value: 'exists', label: 'is defined' },
    { value: '!exists', label: 'isnt defined' },
    { value: 'like', label: 'contains' },
    { value: '!like', label: 'dosent contains' },
    { value: 'eq', label: 'equal to' },
    { value: '!eq', label: 'not equal to' },
]
