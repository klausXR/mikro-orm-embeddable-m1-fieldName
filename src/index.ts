import dotenv from 'dotenv'
dotenv.config()
import { Discount } from './discount'
import { Checkout } from './checkout'
import { LoadStrategy, MikroORM } from '@mikro-orm/core'

const entrypoint = async () => {
  const orm = await MikroORM.init({
    entities: [Checkout, Discount],
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
    type: 'postgresql',
    debug: true
  })

  {
    // Clean up
    const em = orm.em.fork()
    await em.nativeDelete(Discount, {})
    await em.nativeDelete(Checkout, {})
  }

  const em = orm.em.fork()

  // Creating a checkout with a discount
  let createdCheckout = new Checkout()
  createdCheckout.discount = new Discount(25)

  await em.persistAndFlush(createdCheckout)

  {
    // Remove the discount by setting it to null
    const em = orm.em.fork()
    const checkout = await em.findOne(Checkout, createdCheckout.id, {
      populate: ['discount'],
      strategy: LoadStrategy.JOINED
    })

    checkout.discount = null

    await em.flush()
  }

  {
    // Verify checkout.discount is destroyed
    const em = orm.em.fork()
    const checkout = await em.find(Checkout, createdCheckout.id, {
      populate: ['discount'],
      strategy: LoadStrategy.JOINED
    })

    console.log("Checkout below should not have a discount")
    console.log(checkout)
  }

  orm.close()
}

entrypoint()
