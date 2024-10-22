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

export enum workshop_status {
  pending = 'pending', //* <--- pending to pick up <---- *!just for external repairs
  pickedUp = 'pickedUp', //* <--- picked up
  started = 'started', //* <--- repair started
  finished = 'finished', //* <--- repair finished
  delivered = 'delivered' //* <--- repair delivered <---- *! this should not be used
}

export type WorkshopStatus = keyof typeof workshop_status
