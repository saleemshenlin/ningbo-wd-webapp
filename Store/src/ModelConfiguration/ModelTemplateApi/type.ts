import { QueryTemplateListOutput } from '@dhicn/domain-paas-sdk-ts/model-configuration'

export interface ModelTemplateApiState {
    test?: string
    modelTemplateList: QueryTemplateListOutput[]
}
