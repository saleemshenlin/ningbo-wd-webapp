// import { onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
export function useInfoMessage(message: string): void {
    Message.info(message)
}

export function useSuccessMessage(message: string): void {
    Message.success(message)
}

export function useErrorMessage(message: string): void {
    Message.error(message)
}

export function useWarningMessage(message: string): void {
    Message.warning(message)
}

export function useSuccessCB(success: boolean = true): void {
    if (success) {
        Message.success('更新成功!')
    } else {
        Message.warning('更新失败!')
    }
}
