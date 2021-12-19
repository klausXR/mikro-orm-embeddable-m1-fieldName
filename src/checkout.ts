import { Discount } from './discount'
import { Entity, OneToOne, PrimaryKey } from '@mikro-orm/core'

@Entity()
export class Checkout {
  @PrimaryKey()
  id!: number

  @OneToOne(
    () => Discount,
    discount => discount.checkout,
    {
      nullable: true,
      orphanRemoval: true,
    }
  )
  public discount: Discount | null
}
