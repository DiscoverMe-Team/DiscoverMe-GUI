export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    Button: typeof import('primevue/button')['default']
    Chart: typeof import('primevue/chart')['default']
    Checkbox: typeof import('primevue/checkbox')['default']
    Column: typeof import('primevue/column')['default']
    DataTable: typeof import('primevue/datatable')['default']
    DatePicker: typeof import('primevue/datepicker')['default']
    Divider: typeof import('primevue/divider')['default']
    FloatingConfigurator: typeof import('./src/components/FloatingConfigurator.vue')['default']
    Fluid: typeof import('primevue/fluid')['default']
    IconField: typeof import('primevue/iconfield')['default']
    InputIcon: typeof import('primevue/inputicon')['default']
    InputNumber: typeof import('primevue/inputnumber')['default']
    InputText: typeof import('primevue/inputtext')['default']
    JournalEntry: typeof import('./src/components/JournalEntry.vue')['default']
    MultiSelect: typeof import('primevue/multiselect')['default']
    Password: typeof import('primevue/password')['default']
    ProgressBar: typeof import('primevue/progressbar')['default']
    Rating: typeof import('primevue/rating')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    Select: typeof import('primevue/select')['default']
    SelectButton: typeof import('primevue/selectbutton')['default']
    Slider: typeof import('primevue/slider')['default']
    Tag: typeof import('primevue/tag')['default']
    Toast: typeof import('primevue/toast')['default']
    ToggleButton: typeof import('primevue/togglebutton')['default']
  }
  export interface ComponentCustomProperties {
    StyleClass: typeof import('primevue/styleclass')['default']
  }
}
