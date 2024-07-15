//@ts-nocheck
import PaymentType, { payment_methods } from '../types/PaymentType'
import { payments_amount, PaymentsAmount } from './payments'

describe('payments_amount', () => {
  it('should calculate the correct payment amounts when there are no payments', () => {
    const payments: Partial<PaymentType>[] = []

    const expected: PaymentsAmount = {
      total: 0,
      cash: 0,
      card: 0,
      transfers: 0,
      canceled: 0,
      transfersNotVerified: 0,
      retirements: 0,
      incomes: 0,
      outcomes: 0
    }

    const result = payments_amount(payments)

    expect(result).toEqual(expected)
  })

  it('should calculate the correct payment amounts when all payments are canceled', () => {
    const payments: Partial<PaymentType>[] = [
      { amount: 10, method: payment_methods.CASH, canceled: true },
      { amount: 20, method: payment_methods.CARD, canceled: true },
      { amount: 30, method: payment_methods.TRANSFER, canceled: true }
    ]

    const expected: PaymentsAmount = {
      total: 0,
      cash: 0,
      card: 0,
      transfers: 0,
      canceled: 60,
      transfersNotVerified: 0,
      retirements: 0,
      incomes: 0,
      outcomes: 0
    }

    const result = payments_amount(payments)

    expect(result).toEqual(expected)
  })

  it('should calculate the correct payment amounts when there are transfers not verified', () => {
    const payments: Partial<PaymentType>[] = [
      { amount: 10, method: payment_methods.CASH },
      { amount: 20, method: payment_methods.CARD },
      {
        amount: 30,
        method: payment_methods.TRANSFER,
        verified: false
      }
    ]

    const expected: PaymentsAmount = {
      total: 60,
      cash: 10,
      card: 20,
      transfers: 30,
      canceled: 0,
      transfersNotVerified: 30,
      retirements: 0,
      incomes: 60,
      outcomes: 0
    }

    const result = payments_amount(payments)

    expect(result).toEqual(expected)
  })
  it('should calculate the correct retirements amounts ', () => {
    const payments: Partial<PaymentType>[] = [
      {
        amount: 10,
        method: payment_methods.CASH,
        isRetirement: true
      },
      {
        amount: 20,
        method: payment_methods.CASH,
        isRetirement: true
      },
      {
        amount: 30,
        method: payment_methods.CASH
      }
    ]

    const expected: PaymentsAmount = {
      total: 0,
      cash: 0,
      card: 0,
      transfers: 0,
      canceled: 0,
      transfersNotVerified: 0,
      retirements: 30,
      incomes: 30,
      outcomes: 30
    }

    const result = payments_amount(payments)

    expect(result).toEqual(expected)
  })
  it('should calculate the correct retirements amounts even if is in other method', () => {
    const payments: Partial<PaymentType>[] = [
      {
        amount: 10,
        method: payment_methods.CASH,
        isRetirement: true
      },
      {
        amount: 20,
        method: payment_methods.CASH,
        isRetirement: true
      },
      {
        amount: 30,
        method: payment_methods.TRANSFER
      }
    ]

    const expected: PaymentsAmount = {
      total: 0,
      cash: -30,
      card: 0,
      transfers: 30,
      canceled: 0,
      transfersNotVerified: 30,
      retirements: 30,
      incomes: 30,
      outcomes: 30
    }

    const result = payments_amount(payments)

    expect(result).toEqual(expected)
  })
})
