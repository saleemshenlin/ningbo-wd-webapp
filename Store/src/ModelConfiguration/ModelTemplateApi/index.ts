import { defineStore } from 'pinia'
import { ModelTemplateApiState } from './type'
import {
    BusinessTypeEnum,
    LibraryTypeEnum,
    ModelTemplateApi,
    ModelTypeEnum,
} from '@dhicn/domain-paas-sdk-ts/model-configuration'
import { showError } from '../../helper/showError'

const StoreName = 'ModelTemplateApi'
export const useModelTemplateApiStore = defineStore(StoreName, {
    state: (): ModelTemplateApiState => ({
        modelTemplateList: [], // 模板类型
    }),
    actions: {
        /**
         * 上传模型模板文件，同时检查模型文件
         * /api/v2/model-configuration/template/upload-model-template
         * 应用:系统配置-模型模板管理-上传模型模板
         */
        async uploadModelTemplate(
            $api: ModelTemplateApi,
            muppName?: string,
            systemId?: string,
            libraryType?: string,
            businessType?: string,
            modelType?: string,
        ) {
            try {
                const res = await $api.apiV2ModelConfigurationTemplateUploadModelTemplatePost(
                    muppName,
                    systemId,
                    libraryType,
                    businessType,
                    modelType,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'uploadModelTemplate', error)
                return ''
            }
        },

        /**
         * 下载模板模型文件
         * /api/v2/model-configuration/template/download-model-tempalte
         * 应用:系统配置-模型模板管理-下载模型模板
         */
        async downloadModelTemplate($api: ModelTemplateApi, fileName: string) {
            try {
                const res = await $api.apiV2ModelConfigurationTemplateDownloadModelTempaltePost({
                    fileName,
                })
                return res.data
            } catch (error) {
                showError(StoreName, 'downloadModelTempalte', error)
                return ''
            }
        },

        /**
         * 获取模板模型文件列表
         * /api/v2/model-configuration/template/model-tempalte-list
         * 应用:系统配置-模型模板管理-模型模板列表
         */
        async getModelTemplateList($api: ModelTemplateApi) {
            try {
                const res = await $api.apiV2ModelConfigurationTemplateModelTempalteListGet()
                this.modelTemplateList = res.data
                return res.data
            } catch (error) {
                showError(StoreName, 'getModelTemplateList', error)
                return []
            }
        },

        /**
         * 删除模板模型文件
         * /api/v2/model-configuration/template/delete
         * 应用:系统配置-模型模板管理-删除模型模板
         */
        async deleteModelTemplate($api: ModelTemplateApi, ids: string[]) {
            try {
                const res = await $api.apiV2ModelConfigurationTemplateDeletePost(ids)
                return res.data
            } catch (error) {
                showError(StoreName, 'deleteModelTemplate', error)
                return false
            }
        },

        /**
         * 创建模型模板
         * /api/v2/model-configuration/template/create-model-template
         */
        async createModelTemplate(
            $api: ModelTemplateApi,
            muppName?: string,
            fileId?: string,
            systemId?: string,
            libraryType?: LibraryTypeEnum,
            businessType?: BusinessTypeEnum,
            modelType?: ModelTypeEnum,
        ) {
            try {
                const res = await $api.apiV2ModelConfigurationTemplateCreateModelTemplatePost({
                    muppName,
                    fileId,
                    systemId,
                    libraryType,
                    businessType,
                    modelType,
                })
                return res.data
            } catch (error) {
                showError(StoreName, 'createModelTemplate', error)
                return ''
            }
        },
    },
})
