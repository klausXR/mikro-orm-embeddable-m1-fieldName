import { ObjectId } from '@mikro-orm/mongodb'
import { Entity, PrimaryKey, OneToOne, Property } from '@mikro-orm/core'
import { Checkout } from './checkout'

@Entity()
export class Discount {
  @PrimaryKey()
  id!: number

  @OneToOne(
    () => Checkout,
    checkout => checkout.discount, {
      owner: true,
    }
  )
  public checkout: Checkout

  @Property()
  public amount: number

  constructor (amount: number) {
    this.amount = amount
  }
}
