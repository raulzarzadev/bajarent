export const formatCurrentBalanceToProgress = ({
  currentBalance,
  storeSections
}) => {
  return {
    bySections: {
      sectionId: {
        authorized: 0,
        delivered: 0,
        expired: 0,
        resolved: 0,
        reported: 0,
        reportedSolved: 0,
        payments: []
      }
    }
  }
}
