export enum workshop_flow {
  pendingAt = 'pendingAt',
  pickedUpAt = 'pickedUpAt',
  startedAt = 'startedAt',
  finishedAt = 'finishedAt',
  deliveredAt = 'deliveredAt'
}
export type WorkshopFlow = {
  [key in workshop_flow]?: Date | null
}
