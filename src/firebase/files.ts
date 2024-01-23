import { usersCRUD } from './auth'

export const uploadFile = (
  image: Blob | Uint8Array | ArrayBuffer,
  fieldName: string,
  cb: ({
    progress,
    downloadURL
  }: {
    progress: number
    downloadURL: string | null
  }) => void
) => {
  usersCRUD.uploadFile(image, fieldName, (progress, downloadURL) => {
    cb({ progress, downloadURL })
  })
}
export const deleteImage = ({ url }: { url: string }) => {
  return usersCRUD.deleteFile(url)
}
